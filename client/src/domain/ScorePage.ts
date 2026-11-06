import {JsonProperty, Serializable} from "ts-jackson";
import {Staff} from "./Staff.ts";
import {Instrument} from './Instrument.ts';
import {GrandStaff} from "./GrandStaff.ts";
import {StaffSystem} from "./StaffSystem.ts";
import {StaffCollection} from './StaffCollection.ts';
import {VerticalDivider} from "./VerticalDivider.ts";

@Serializable()
export class ScorePage {
    projectId: string;
    number: number;
    blob: Blob;
    isChanged: boolean = true;

    markSaved(): void {
        this.isChanged = false;
        for (const staff of this.staves) staff.isChanged = false;
    }

    private markChanged(): void {
        this.isChanged = true;
    }

    @JsonProperty()
    width: number;
    @JsonProperty()
    height: number;

    staves: StaffCollection;
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

        this.staves = new StaffCollection();
        this.grandStaves = new Map();
        this.systems = new Map();
    }

    moveLeftDivider(n: number): boolean {
        if (!Number.isFinite(n) || n < 0 || n > this.rightDivider.x - 1) return false;
        if (this.leftDivider.x === n) return true;
        this.leftDivider.x = n;
        this.staves.moveLeftDivider(n);
        this.markChanged();
        return true;
    }

    moveRightDivider(n: number): boolean {
        if (!Number.isFinite(n) || n < this.leftDivider.x + 1 || n > this.width) return false;
        if (this.rightDivider.x === n) return true;
        this.rightDivider.x = n;
        this.staves.moveRightDivider(n);
        this.markChanged();
        return true;
    }

    addStaff(staff: Staff): void {
        if (this.staves.has(staff.id)) return;
        this.staves.add(staff);
        this.markChanged();
    }

    /** Copies independent geometry to the next empty page, scaled to its dimensions. */
    copyStavesLayoutTo(nextPage: ScorePage): boolean {
        if (nextPage === this || nextPage.projectId !== this.projectId || nextPage.number !== this.number + 1
            || !this.staves.size || nextPage.staves.size) return false;
        if (![this.width, this.height, nextPage.width, nextPage.height]
            .every(value => Number.isFinite(value) && value > 0)) return false;

        const scaleX = nextPage.width / this.width;
        const scaleY = nextPage.height / this.height;
        const staves = new StaffCollection();
        for (const staff of this.staves) {
            staves.add(Staff.copy(staff, scaleX, scaleY));
        }

        const grandStaves = new Map<number, GrandStaff>();
        for (const [id, grandStaff] of this.grandStaves) {
            const first = staves.get(grandStaff.firstStaff.id);
            const second = staves.get(grandStaff.secondStaff.id);
            if (!first || !second) return false;
            grandStaves.set(id, new GrandStaff(grandStaff.id, grandStaff.instrument, first, second));
        }
        const systems = new Map<number, StaffSystem>();
        for (const [id, system] of this.systems) {
            const members: Staff[] = [];
            for (const staff of system.staves.values()) {
                const copy = staves.get(staff.id);
                if (!copy) return false;
                members.push(copy);
            }
            systems.set(id, new StaffSystem(system.id, members));
        }

        nextPage.staves = staves;
        nextPage.grandStaves = grandStaves;
        nextPage.systems = systems;
        nextPage.leftDivider = new VerticalDivider(this.leftDivider.x * scaleX);
        nextPage.rightDivider = new VerticalDivider(this.rightDivider.x * scaleX);
        nextPage.markChanged();
        return true;
    }

    deleteStaff(id: number): boolean {
        if (!this.staves.delete(id)) return false;
        for (const [key, grandStaff] of this.grandStaves) {
            if (grandStaff.firstStaff.id === id || grandStaff.secondStaff.id === id) {
                this.grandStaves.delete(key);
            }
        }
        for (const [key, system] of this.systems) {
            if (!system.staves.has(id)) continue;
            const remaining = [...system.staves.values()].filter(staff => staff.id !== id);
            if (remaining.length) this.systems.set(key, new StaffSystem(system.id, remaining));
            else this.systems.delete(key);
        }
        this.markChanged();
        return true;
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
        const staff = this.getStaff(id);
        if (!staff || !this.canPlaceStaff(y + staff.height / 2, staff.height, id)) return false;
        if (staff.y === y) return true;
        this.staves.move(id, y);
        this.markChanged();
        return true;
    }

    resizeStaff(id: number, y: number, height: number): boolean {
        const staff = this.getStaff(id);
        if (!staff || !this.canPlaceStaff(y + height / 2, height, id)) return false;
        if (staff.y === y && staff.height === height) return true;
        this.staves.move(id, y);
        staff.height = height;
        staff.isChanged = true;
        this.markChanged();
        return true;
    }

    /** Pass the Instrument instance from the owning project. */
    changeInstrumentForStaff(staffId: number, instrument: Instrument): boolean {
        const staff = this.getStaff(staffId);
        if (!staff) return false;
        if (staff.instrument === instrument) return true;
        staff.instrument = instrument;
        staff.isChanged = true;
        this.markChanged();
        return true;
    }

    getStaff(id: number): Staff | undefined {
        return this.staves.get(id);
    }
}
