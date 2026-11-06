import {useState} from 'react';
import {useBaseState} from '..';
import type {EditingMode, EditingModeState, EditingTarget} from './states/EditingModeState.ts';

// Owns tool selection and automatic mode/cursor changes for score interactions.
export function useEditingMode(locked = false): EditingModeState {
    const base = useBaseState();
    const [mode, setMode] = useState<EditingMode>('select');

    const editing = base.extend({
        get mode() { return mode; },
        set mode(next: EditingMode) {
            if (locked && next !== 'select') return;
            setMode(next);
        },
        get locked() { return locked; },
        modeFor(target: EditingTarget | null, dragging = false): EditingMode {
            if (dragging || target?.hasName('staff-divider') || target?.hasName('vertical-divider')) return 'edit-staff';
            return target?.hasName('staff-body') ? 'select' : 'add-staff';
        },
        cursorFor(target: EditingTarget | null, dragging = false, activeMode = mode): string {
            if (locked) return 'default';
            if (target?.hasName('vertical-divider')) return 'ew-resize';
            if (target?.hasName('staff-divider')) return 'ns-resize';
            if (target?.hasName('staff-body')) return dragging ? 'grabbing' : activeMode === 'select' ? 'pointer' : 'grab';
            return 'default';
        },
    });
    return editing;
}
