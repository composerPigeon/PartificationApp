import type {Instrument, ScorePage, Staff, StaffDivider} from '../../domain';
import {useBaseState} from '..';
import type {ScorePageEditorState, StaffResizeBounds} from './states/ScorePageEditorState.ts';

// Edits one page; callers decide whether changes should be saved.
export function useScorePageEditor(page: ScorePage, onChange?: () => void): ScorePageEditorState {
    const base = useBaseState();

    function changed() {
        base.refresh();
        onChange?.();
    }

    function resizeStaff(id: number, y: number, height: number): boolean {
        const staff = page.getStaff(id);
        if (!staff) return false;
        const unchanged = staff.y === y && staff.height === height;
        if (!page.resizeStaff(id, y, height)) return false;
        if (!unchanged) changed();
        return true;
    }

    function getStaffResizeBounds(divider: StaffDivider, y: number): StaffResizeBounds {
        const staff = divider.staff;
        const top = divider === staff.topDivider ? Math.min(y, staff.y + staff.height - 1) : staff.y;
        const bottom = divider === staff.bottomDivider ? Math.max(y, staff.y + 1) : staff.y + staff.height;
        return {y: top, height: bottom - top};
    }

    return base.extend({
        get staves() { return [...page.staves]; },
        get dividers() { return [...new Set([...page.staves].flatMap(staff => [staff.topDivider, staff.bottomDivider]))]; },
        get leftDivider() { return page.leftDivider; },
        get rightDivider() { return page.rightDivider; },
        getStaff(id: number) { return page.getStaff(id); },
        canPlaceStaff(centerY: number, height: number, excludedStaffId?: number) {
            return page.canPlaceStaff(centerY, height, excludedStaffId);
        },
        addStaff(staff: Staff) {
            if (!Number.isSafeInteger(staff.id) || staff.id < 1 || page.staves.has(staff.id)
                || !Number.isFinite(staff.x) || !Number.isFinite(staff.width) || staff.x < 0
                || staff.width <= 0 || staff.x + staff.width > page.width
                || !page.canPlaceStaff(staff.y + staff.height / 2, staff.height)) return false;
            page.addStaff(staff);
            changed();
            return true;
        },
        createStaff(centerY: number, height: number, instrument: Instrument) {
            if (!page.canPlaceStaff(centerY, height)) return null;
            const staff = page.createStaff(centerY, height, instrument);
            changed();
            return staff;
        },
        deleteStaff(id: number) {
            if (!page.deleteStaff(id)) return false;
            changed();
            return true;
        },
        moveStaff(id: number, y: number) {
            const staff = page.getStaff(id);
            if (!staff) return false;
            const unchanged = staff.y === y;
            if (!page.moveStaff(id, y)) return false;
            if (!unchanged) changed();
            return true;
        },
        resizeStaff,
        changeStaffInstrument(id: number, instrument: Instrument) {
            const staff = page.getStaff(id);
            if (!staff) return false;
            const unchanged = staff.instrument === instrument;
            if (!page.changeInstrumentForStaff(id, instrument)) return false;
            if (!unchanged) changed();
            return true;
        },
        getStaffResizeBounds,
        moveStaffDivider(divider: StaffDivider, y: number) {
            const staff = page.getStaff(divider.staff.id);
            if (staff !== divider.staff || (divider !== staff.topDivider && divider !== staff.bottomDivider)) return false;
            const bounds = getStaffResizeBounds(divider, y);
            return resizeStaff(staff.id, bounds.y, bounds.height);
        },
        moveLeftDivider(x: number) {
            const unchanged = page.leftDivider.x === x;
            if (!page.moveLeftDivider(x)) return false;
            if (!unchanged) changed();
            return true;
        },
        moveRightDivider(x: number) {
            const unchanged = page.rightDivider.x === x;
            if (!page.moveRightDivider(x)) return false;
            if (!unchanged) changed();
            return true;
        },
    });
}
