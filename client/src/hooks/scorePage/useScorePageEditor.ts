import type {Instrument, Staff, StaffDivider} from '../../domain';
import {useBaseState} from '..';
import type {ProjectState, ProjectSaveState} from '../project';
import type {PagingState} from '../states';
import type {ScorePageEditorState, StaffResizeBounds} from './states/ScorePageEditorState.ts';

// Owns committed page edits and requests saving after each change.
export function useScorePageEditor(projectState: ProjectState, paging: PagingState, saveState: ProjectSaveState): ScorePageEditorState {
    const base = useBaseState();
    const page = projectState.pages[paging.pageIndex];

    function nextPage() {
        return page ? projectState.pages[paging.pageIndex + 1] : undefined;
    }

    function canCopyLayout() {
        const next = nextPage();
        return !!page && !!next && page.staves.size > 0 && next.staves.size === 0
            && next.projectId === page.projectId && next.number === page.number + 1
            && [page.width, page.height, next.width, next.height].every(value => Number.isFinite(value) && value > 0);
    }

    function changed() {
        base.refresh();
        void saveState.save();
    }

    function resizeStaff(id: number, y: number, height: number): boolean {
        const staff = page?.getStaff(id);
        if (!page || !staff) return false;
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
        get canCopyStavesLayout() { return canCopyLayout(); },
        copyStavesLayoutToNextPage() {
            const next = nextPage();
            if (!page || !next || !canCopyLayout() || !page.copyStavesLayoutTo(next)) return false;
            changed();
            return true;
        },
        get staves() { return page ? [...page.staves] : []; },
        get dividers() { return page ? [...new Set([...page.staves].flatMap(staff => [staff.topDivider, staff.bottomDivider]))] : []; },
        get leftDivider() { return page.leftDivider; },
        get rightDivider() { return page.rightDivider; },
        getStaff(id: number) { return page?.getStaff(id); },
        canPlaceStaff(centerY: number, height: number, excludedStaffId?: number) {
            return page?.canPlaceStaff(centerY, height, excludedStaffId) ?? false;
        },
        addStaff(staff: Staff) {
            if (!page || !Number.isSafeInteger(staff.id) || staff.id < 1 || page.staves.has(staff.id)
                || !Number.isFinite(staff.x) || !Number.isFinite(staff.width) || staff.x < 0
                || staff.width <= 0 || staff.x + staff.width > page.width
                || !page.canPlaceStaff(staff.y + staff.height / 2, staff.height)) return false;
            page.addStaff(staff);
            changed();
            return true;
        },
        createStaff(centerY: number, height: number, instrument: Instrument) {
            if (!page || !page.canPlaceStaff(centerY, height)) return null;
            const staff = page.createStaff(centerY, height, instrument);
            changed();
            return staff;
        },
        deleteStaff(id: number) {
            if (!page?.deleteStaff(id)) return false;
            changed();
            return true;
        },
        moveStaff(id: number, y: number) {
            const staff = page?.getStaff(id);
            if (!page || !staff) return false;
            const unchanged = staff.y === y;
            if (!page.moveStaff(id, y)) return false;
            if (!unchanged) changed();
            return true;
        },
        resizeStaff,
        changeStaffInstrument(id: number, instrument: Instrument) {
            const staff = page?.getStaff(id);
            if (!page || !staff) return false;
            const unchanged = staff.instrument === instrument;
            if (!page.changeInstrumentForStaff(id, instrument)) return false;
            if (!unchanged) changed();
            return true;
        },
        getStaffResizeBounds,
        moveStaffDivider(divider: StaffDivider, y: number) {
            const staff = page?.getStaff(divider.staff.id);
            if (!page || !staff || staff !== divider.staff || (divider !== staff.topDivider && divider !== staff.bottomDivider)) return false;
            const bounds = getStaffResizeBounds(divider, y);
            return resizeStaff(staff.id, bounds.y, bounds.height);
        },
        moveLeftDivider(x: number) {
            if (!page) return false;
            const unchanged = page.leftDivider.x === x;
            if (!page.moveLeftDivider(x)) return false;
            if (!unchanged) changed();
            return true;
        },
        moveRightDivider(x: number) {
            if (!page) return false;
            const unchanged = page.rightDivider.x === x;
            if (!page.moveRightDivider(x)) return false;
            if (!unchanged) changed();
            return true;
        },
    });
}
