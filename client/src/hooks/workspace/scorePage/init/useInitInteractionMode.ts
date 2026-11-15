import {useRef, useState} from 'react';
import type {KonvaEventObject, Node} from 'konva/lib/Node';
import type {InteractionMode, InteractionModeState, InteractionModeTarget} from '../states/InteractionModeState.ts';
import type {PermissionsState} from '../../states/PermissionsState';
import type {StaffSelectionState} from '../states/StaffSelectionState.ts';

// Owns tool selection and automatic mode/cursor changes for score interactions.
export function useInitInteractionMode(selection: StaffSelectionState, permissions: PermissionsState): InteractionModeState {
    const [mode, setMode] = useState<InteractionMode>('select');
    const dragTargetRef = useRef<Node | null>(null);
    const [hoverCursor, setHoverCursor] = useState<{mode: InteractionMode, value: string}>({mode: 'select', value: 'default'});

    function modeFor(target: InteractionModeTarget | null, dragging = false): InteractionMode {
        if (dragging || target?.hasName('staff-divider') || target?.hasName('vertical-divider')) return 'edit-staff';
        return target?.hasName('staff-body') ? 'select' : 'add-staff';
    }

    function updateForTarget(target: InteractionModeTarget | null, dragging = false): InteractionMode {
        // Hover updates must preserve selection, including clicks in the same React batch.
        const next = modeFor(target, dragging);
        if (!permissions.canManipulateStaff) return mode;
        setMode(next);
        return next;
    }

    function cursorFor(target: InteractionModeTarget | null, dragging = false, activeMode = mode): string {
        if (target?.hasName('vertical-divider')) return 'ew-resize';
        if (target?.hasName('staff-divider')) return 'ns-resize';
        if (target?.hasName('staff-body')) return dragging ? 'grabbing' : activeMode === 'select' ? 'pointer' : 'grab';
        return 'default';
    }

    function updatePointer(target: Node | null, dragging: boolean) {
        if (!permissions.canManipulateStaff) return;
        const next = updateForTarget(target, dragging);
        setHoverCursor({mode: next, value: cursorFor(target, dragging, next)});
    }

    return {
        get mode() { return mode; },
        set mode(next: InteractionMode) {
            if (!permissions.canChangeTool) return;
            selection.clear();
            setMode(next);
        },
        get cursor() {
            if (!permissions.canFinishCreation) return 'default';
            if (mode === 'add-staff') return 'crosshair';
            return hoverCursor.mode === mode ? hoverCursor.value : 'default';
        },
        onClick(event: KonvaEventObject<MouseEvent>) {
            if (event.evt.button !== 0 || !permissions.canChangeTool || selection.hasSelection) return;
            updateForTarget(event.target);
        },
        onMouseMove(event: KonvaEventObject<MouseEvent>) {
            updatePointer(dragTargetRef.current ?? event.target, !!dragTargetRef.current);
        },
        onMouseLeave() {
            setHoverCursor({mode, value: cursorFor(dragTargetRef.current, !!dragTargetRef.current)});
        },
        onDragStart(event: KonvaEventObject<MouseEvent>) {
            if (!permissions.canManipulateStaff) return;
            dragTargetRef.current = event.target;
            updatePointer(event.target, true);
        },
        onDragEnd(event: KonvaEventObject<MouseEvent>) {
            dragTargetRef.current = null;
            const stage = event.target.getStage();
            const pointer = stage?.getPointerPosition();
            updatePointer(stage && pointer ? stage.getIntersection(pointer) : null, false);
        },
        modeFor,
    };
}
