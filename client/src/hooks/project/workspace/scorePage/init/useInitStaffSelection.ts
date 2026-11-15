import type {KonvaEventObject} from 'konva/lib/Node';
import type {InteractionActivityState} from '../../init/useInitInteractionActivity';
import type {PermissionsState} from '../../states/PermissionsState';
import type {StaffSelectionState} from '../states/StaffSelectionState';

// Owns selected staves and resets selection when the displayed page changes.
export function useInitStaffSelection(activity: InteractionActivityState, permissions: PermissionsState): StaffSelectionState {
    const {staffIds, setStaffIds} = activity;

    const selection = {
        get staffIds() { return staffIds; },
        get hasSelection() { return staffIds.size > 0; },
        isSelected(id: number) { return staffIds.has(id); },
        onClick(event: KonvaEventObject<MouseEvent>) {
            if (event.evt.button !== 0 || !permissions.canChangeTool) return;
            if (event.target.hasName('staff-body')) selection.select(Number(event.target.id()), event.evt.shiftKey);
            else selection.clear();
        },
        select(id: number, additive = false) {
            setStaffIds(current => {
                if (!additive) return current.size === 1 && current.has(id) ? current : new Set([id]);
                const next = new Set(current);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
        },
        clear(id?: number) {
            setStaffIds(current => {
                if (id === undefined) return current.size ? new Set() : current;
                if (!current.has(id)) return current;
                const next = new Set(current);
                next.delete(id);
                return next;
            });
        },
    };
    return selection;
}
