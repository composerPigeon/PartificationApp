import type {Instrument, ScorePage, StaffDivider} from '../../../../../domain';
import type {ProjectState, ProjectSaveState} from '../../..';
import type {ViewState} from '../../../../states';
import type {WorkspacePagingState} from '../../states/WorkspacePagingState';
import type {ScorePageDomainState, StaffResizeBounds} from '../states/ScorePageDomainState.ts';

// Owns committed page edits and requests saving after each change.
export function useInitScorePageDomain(viewState: ViewState, projectState: ProjectState, paging: WorkspacePagingState, saveState: ProjectSaveState, page: ScorePage): ScorePageDomainState {

    function nextPage() {
        return projectState.pages[paging.pageIndex + 1];
    }

    function canCopyStavesLayout() {
        const next = nextPage();
        return !!next && page.staves.size > 0 && next.staves.size === 0
            && next.projectId === page.projectId && next.number === page.number + 1
            && [page.width, page.height, next.width, next.height].every(value => Number.isFinite(value) && value > 0);
    }

    function changed() {
        viewState.refresh();
        void saveState.save();
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

    return {
        get canCopyStavesLayout() { return canCopyStavesLayout(); },
        copyStavesLayoutToNextPage() {
            const next = nextPage();
            if (!next || !canCopyStavesLayout() || !page.copyStavesLayoutTo(next)) return false;
            changed();
            return true;
        },
        get staves() { return [...page.staves]; },
        get dividers() { return [...new Set([...page.staves].flatMap(staff => [staff.topDivider, staff.bottomDivider]))]; },
        get leftDivider() { return page.leftDivider; },
        get rightDivider() { return page.rightDivider; },
        getStaff(id: number) { return page.getStaff(id); },
        canPlaceStaff(centerY: number, height: number, excludedStaffId?: number) {
            return page.canPlaceStaff(centerY, height, excludedStaffId);
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
            if (!staff || staff !== divider.staff || (divider !== staff.topDivider && divider !== staff.bottomDivider)) return false;
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
    };
}
