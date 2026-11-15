import type {Instrument, Staff, StaffDivider, VerticalDivider} from '../../../../domain';
export interface StaffResizeBounds {
    y: number;
    height: number;
}

export interface ScorePageDomainState {
    get staves(): readonly Staff[];
    get dividers(): readonly StaffDivider[];
    get leftDivider(): VerticalDivider;
    get rightDivider(): VerticalDivider;
    get canCopyStavesLayout(): boolean;

    copyStavesLayoutToNextPage(): boolean;

    getStaff(id: number): Staff | undefined;
    canPlaceStaff(centerY: number, height: number, excludedStaffId?: number): boolean;
    createStaff(centerY: number, height: number, instrument: Instrument): Staff | null;
    deleteStaff(id: number): boolean;
    moveStaff(id: number, y: number): boolean;
    changeStaffInstrument(id: number, instrument: Instrument): boolean;
    getStaffResizeBounds(divider: StaffDivider, y: number): StaffResizeBounds;
    moveStaffDivider(divider: StaffDivider, y: number): boolean;
    moveLeftDivider(x: number): boolean;
    moveRightDivider(x: number): boolean;
}
