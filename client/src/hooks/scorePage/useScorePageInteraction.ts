/* eslint-disable react-hooks/immutability -- State accessors delegate to React state setters. */
import {useRef, useState} from 'react';
import {useBaseState} from '..';
import type {KonvaEventObject, Node} from 'konva/lib/Node';
import type {Stage} from 'konva/lib/Stage';
import type {Instrument, ScorePage, Staff, StaffDivider} from '../../domain';
import type {ProjectState} from '../project';
import type {StaffSelectionState} from './states/StaffSelectionState';
import type {EditingModeState} from './states/EditingModeState';
import type {ScorePageEditorState} from './states/ScorePageEditorState';
import {recommendInstrument} from '../../services/projects/recommendInstrument';

type Position = {top: number, left: number};
type PageEvent = KonvaEventObject<MouseEvent>;

interface ScorePageInteractionOptions {
    projectState: ProjectState;
    page: ScorePage | undefined;
    editor: ScorePageEditorState;
    editing: EditingModeState;
    selection: StaffSelectionState;
    disabled?: boolean;
}

// Coordinates temporary canvas interactions; the editor owns committed geometry changes.
export function useScorePageInteraction({projectState, page, editor, editing, selection,
    disabled = false}: ScorePageInteractionOptions) {
    const base = useBaseState();
    const {project, pages} = projectState;
    const stageRef = useRef<Stage>(null);
    const dragTargetRef = useRef<Node | null>(null);
    const [hoverCursor, setHoverCursor] = useState({mode: editing.mode, value: 'default'});
    const [pendingStaff, setPendingStaff] = useState<{startY: number, endY: number} | null>(null);
    const [newStaff, setNewStaff] = useState<{centerY: number, height: number, position: Position} | null>(null);
    const [editingInstrument, setEditingInstrument] = useState<{staffId: number, instrument: Instrument, position: Position} | null>(null);
    const [dragPreview, setDragPreview] = useState<{id: number, y: number, height: number} | null>(null);
    const editable = !!page && !disabled && !selection.hasSelection;
    const cursor = !editable ? 'default' : editing.mode === 'add-staff' ? 'crosshair'
        : hoverCursor.mode === editing.mode ? hoverCursor.value : 'default';

    function updateInteraction(target: Node | null, dragging = false) {
        if (!editable || pendingStaff || newStaff || editingInstrument) return;
        const mode = editing.updateForTarget(target, dragging);
        setHoverCursor({mode, value: editing.cursorFor(target, dragging, mode)});
    }

    // eslint-disable-next-line react-hooks/refs -- extend preserves descriptors; it never reads stageRef.current.
    return base.extend({
        stageRef, editable, cursor, pendingStaff, newStaff, editingInstrument, dragPreview,
        copyStavesLayoutToNextPage() {
            if (disabled || !page) return false;
            return editor.copyStavesLayoutToNextPage();
        },
        moveLeftDivider(x: number) {
            if (!editable) return false;
            return editor.moveLeftDivider(x);
        },
        moveRightDivider(x: number) {
            if (!editable) return false;
            return editor.moveRightDivider(x);
        },
        onClick(event: PageEvent) {
            if (event.evt.button !== 0 || disabled || !page) return;
            if (!selection.hasSelection) editing.mode = editing.modeFor(event.target);
            if (event.target.hasName('staff-body')) selection.toggle(Number(event.target.id()));
            else selection.clear();
        },
        onMouseDown(event: PageEvent) {
            if (event.evt.button !== 0 || !editable || newStaff || editingInstrument
                || editing.modeFor(event.target) !== 'add-staff') return;
            const pointer = stageRef.current?.getRelativePointerPosition();
            if (!pointer) return;
            editing.mode = 'add-staff';
            setPendingStaff({startY: pointer.y, endY: pointer.y});
        },
        onMouseUp(event: PageEvent) {
            if (!pendingStaff || event.evt.button !== 0) return;
            setPendingStaff(null);
            const pointer = stageRef.current?.getRelativePointerPosition();
            if (!pointer || !editable || !page) return;
            const centerY = (pendingStaff.startY + pointer.y) / 2;
            const height = Math.abs(pointer.y - pendingStaff.startY);
            if (!editor.canPlaceStaff(centerY, height)) return;
            const instrument = recommendInstrument(project, pages, page, centerY);
            if (instrument) editor.createStaff(centerY, height, instrument);
            else setNewStaff({centerY, height, position: {top: event.evt.clientY, left: event.evt.clientX}});
        },
        onMouseMove(event: PageEvent) {
            if (pendingStaff) {
                const pointer = stageRef.current?.getRelativePointerPosition();
                if (pointer) setPendingStaff({...pendingStaff, endY: pointer.y});
                return;
            }
            updateInteraction(dragTargetRef.current ?? event.target, !!dragTargetRef.current);
        },
        onMouseLeave() {
            setPendingStaff(null);
            setHoverCursor({mode: editing.mode, value: editing.cursorFor(dragTargetRef.current, !!dragTargetRef.current)});
        },
        onDragStart(event: PageEvent) {
            dragTargetRef.current = event.target;
            updateInteraction(event.target, true);
        },
        onDragEnd() {
            dragTargetRef.current = null;
            const stage = stageRef.current;
            const pointer = stage?.getPointerPosition();
            updateInteraction(stage && pointer ? stage.getIntersection(pointer) : null);
        },
        previewStaff(staff: Staff, y: number) {
            setDragPreview({id: staff.id, y, height: staff.height});
        },
        previewStaffResize(divider: StaffDivider, y: number) {
            const bounds = editor.getStaffResizeBounds(divider, y);
            setDragPreview({id: divider.staff.id, ...bounds});
            return bounds.y + (divider === divider.staff.topDivider ? 0 : bounds.height);
        },
        finishStaffDrag(staff: Staff, y: number) {
            const moved = editor.moveStaff(staff.id, y);
            setDragPreview(null);
            return moved;
        },
        finishStaffResize(divider: StaffDivider, y: number) {
            const resized = editor.moveStaffDivider(divider, y);
            setDragPreview(null);
            return resized;
        },
        editInstrument(staff: Staff, position: Position) {
            if (!page) return;
            editing.mode = 'select';
            selection.staffId = staff.id;
            const instrument = recommendInstrument(project, pages, page, staff.y) ?? staff.instrument;
            setEditingInstrument({staffId: staff.id, instrument, position});
        },
        deleteStaff(id: number) {
            if (!editor.deleteStaff(id)) return false;
            selection.clear(id);
            if (editingInstrument?.staffId === id) setEditingInstrument(null);
            if (dragPreview?.id === id) setDragPreview(null);
            return true;
        },
        cancelInstrument() {
            setNewStaff(null);
            setEditingInstrument(null);
        },
        submitInstrument(name: string, shortcut: string) {
            if (!newStaff && (!editingInstrument || !editor.getStaff(editingInstrument.staffId))) return;
            const instrument = project.getOrCreateInstrument(name, shortcut);
            if (newStaff) editor.createStaff(newStaff.centerY, newStaff.height, instrument);
            else if (editingInstrument) editor.changeStaffInstrument(editingInstrument.staffId, instrument);
            setNewStaff(null);
            setEditingInstrument(null);
        },
    });
}

export type ScorePageInteractionState = ReturnType<typeof useScorePageInteraction>;
