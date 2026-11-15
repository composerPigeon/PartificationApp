import {useState} from 'react';
import type {Staff, StaffDivider} from '../../../../domain';
import type {PermissionsState} from '../../states/PermissionsState';
import type {ScorePageDomainState} from '../states/ScorePageDomainState';

export function useInitStaffDragging(domain: ScorePageDomainState, permissions: PermissionsState) {
    const [dragPreview, setDragPreview] = useState<{id: number, y: number, height: number} | null>(null);

    return {
        get editable() { return permissions.canManipulateStaff; },
        dragPreview,
        clearPreview(id?: number) {
            setDragPreview(current => id === undefined || current?.id === id ? null : current);
        },
        previewStaff(staff: Staff, y: number) {
            if (permissions.canManipulateStaff) setDragPreview({id: staff.id, y, height: staff.height});
        },
        previewStaffResize(divider: StaffDivider, y: number) {
            const bounds = domain.getStaffResizeBounds(divider, y);
            if (permissions.canManipulateStaff) setDragPreview({id: divider.staff.id, ...bounds});
            return bounds.y + (divider === divider.staff.topDivider ? 0 : bounds.height);
        },
        finishStaffDrag(staff: Staff, y: number) {
            const moved = permissions.canManipulateStaff && domain.moveStaff(staff.id, y);
            setDragPreview(null);
            return moved;
        },
        finishStaffResize(divider: StaffDivider, y: number) {
            const resized = permissions.canManipulateStaff && domain.moveStaffDivider(divider, y);
            setDragPreview(null);
            return resized;
        },
        moveLeftDivider(x: number) { return permissions.canManipulateStaff && domain.moveLeftDivider(x); },
        moveRightDivider(x: number) { return permissions.canManipulateStaff && domain.moveRightDivider(x); },
    };
}

export type StaffDraggingState = ReturnType<typeof useInitStaffDragging>;
