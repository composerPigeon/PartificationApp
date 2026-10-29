import {JsonProperty, Serializable} from "ts-jackson";
import {Staff} from "./Staff.ts";
import {Instrument} from './Instrument.ts';
import {GrandStaff} from "./GrandStaff.ts";
import {StaffSystem} from "./StaffSystem.ts";
import {StavesCollection} from './StavesCollection.ts';
import {VerticalDivider} from "./VerticalDivider.ts";

@Serializable()
export class ScorePage {
    projectId: string;
    number: number;
    blob: Blob;
    isChanged: boolean = true;
    private changeVersion: number = 0;

    get version(): number { return this.changeVersion; }

    markSaved(version: number = this.changeVersion): void {
        if (version === this.changeVersion) this.isChanged = false;
    }

    private markChanged(): void {
        this.changeVersion++;
        this.isChanged = true;
    }

    @JsonProperty()
    width: number;
    @JsonProperty()
    height: number;

    staves: StavesCollection;
    grandStaves: Map<number, GrandStaff>;
    systems: Map<number, StaffSystem>;
    leftDivider: VerticalDivider;
    rightDivider: VerticalDivider;

    constructor(projectId: string, number: number, width: number, height: number, blob: Blob) {
        this.projectId = projectId;
        this.number = number;
        this.width = width;
        this.height = height;
        this.blob = blob;
        this.leftDivider = new VerticalDivider(0);
        this.rightDivider = new VerticalDivider(width);

        this.staves = new StavesCollection();
        this.grandStaves = new Map();
        this.systems = new Map();
    }

    moveLeftDivider(n: number): void {
        if (this.leftDivider.x === n) return;
        this.leftDivider.x = n;
        this.staves.moveLeftDivider(n);
        this.markChanged();
    }

    moveRightDivider(n: number): void {
        if (this.rightDivider.x === n) return;
        this.rightDivider.x = n;
        this.staves.moveRightDivider(n);
        this.markChanged();
    }

    addStaff(staff: Staff): void {
        if (this.staves.has(staff.id)) return;
        this.staves.add(staff);
        this.markChanged();
    }

    createStaff(centerY: number, height: number = 75, instrument: Instrument): Staff {
        if (!this.canPlaceStaff(centerY, height)) {
            throw new RangeError('Staff must fit on the page without overlapping another staff.');
        }
        let id = 1;
        for (const existingId of this.staves.keys()) id = Math.max(id, existingId + 1);
        const staff = new Staff(id, {
            x: this.leftDivider.x,
            y: centerY - height / 2,
            width: this.rightDivider.x - this.leftDivider.x,
            height
        }, instrument);
        this.addStaff(staff);
        return staff;
    }

    canPlaceStaff(centerY: number, height: number, excludedStaffId?: number): boolean {
        if (!Number.isFinite(centerY) || !Number.isFinite(height) || height <= 0)
            return false;

        const top = centerY - height / 2;
        const bottom = centerY + height / 2;
        if (top < 0 || bottom > this.height)
            return false;

        const previousStaff = this.staves.getPrevious(top, excludedStaffId);
        // Search from the top so a staff inside the proposed area is not skipped.
        const nextStaff = this.staves.getNext(top, excludedStaffId);

        return (!previousStaff || previousStaff.y + previousStaff.height <= top)
            && (!nextStaff || bottom <= nextStaff.y);
    }

    moveStaff(id: number, y: number): boolean {
        const staff = this.staves.get(id);
        if (!staff || !this.canPlaceStaff(y + staff.height / 2, staff.height, id)) return false;
        if (staff.y === y) return true;
        this.staves.move(id, y);
        this.markChanged();
        return true;
    }

    resizeStaff(id: number, y: number, height: number): boolean {
        const staff = this.staves.get(id);
        if (!staff || !this.canPlaceStaff(y + height / 2, height, id)) return false;
        if (staff.y === y && staff.height === height) return true;
        this.staves.move(id, y);
        staff.height = height;
        this.markChanged();
        return true;
    }

    /** Pass the Instrument instance from the owning project. */
    changeInstrumentForStaff(staffId: number, instrument: Instrument): boolean {
        const staff = this.staves.get(staffId);
        if (!staff) return false;
        staff.instrument = instrument;
        this.markChanged();
        return true;
    }

    getStaff(staffNumber: number): Staff | undefined {
        return this.staves.get(staffNumber);
    }
}
