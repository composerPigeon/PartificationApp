import {JsonProperty, Serializable} from "ts-jackson";
import {Staff} from "./Staff.ts";
import {Instrument} from './Instrument.ts';
import {GrandStaff} from "./GrandStaff.ts";
import {StaffSystem} from "./StaffSystem.ts";
import {StavesCollection} from './StavesCollection.ts';

@Serializable()
export class ScorePage {
    projectId: string;
    number: number;
    blob: Blob;

    @JsonProperty()
    width: number;
    @JsonProperty()
    height: number;

    staves: StavesCollection;
    grandStaves: Map<number, GrandStaff>;
    systems: Map<number, StaffSystem>;

    constructor(projectId: string, number: number, width: number, height: number, blob: Blob) {
        this.projectId = projectId;
        this.number = number;
        this.width = width;
        this.height = height;
        this.blob = blob;

        this.staves = new StavesCollection();
        this.grandStaves = new Map();
        this.systems = new Map();
    }

    addStaff(staff: Staff): void {
        this.staves.add(staff);
    }

    createStaff(centerY: number, height: number = 75, instrument: Instrument): Staff {
        if (!this.canCreateStaff(centerY, height)) {
            throw new RangeError('Staff must fit on the page without overlapping another staff.');
        }
        let id = 1;
        for (const existingId of this.staves.keys()) id = Math.max(id, existingId + 1);
        const staff = new Staff(id, {x: 0, y: centerY - height / 2, width: this.width, height}, instrument);
        this.addStaff(staff);
        return staff;
    }

    canCreateStaff(centerY: number, height: number): boolean {
        if (!Number.isFinite(centerY) || !Number.isFinite(height) || height <= 0) return false;
        const top = centerY - height / 2;
        const bottom = centerY + height / 2;
        if (top < 0 || bottom > this.height) return false;
        const previous = this.staves.getPrevious(top);
        const next = this.staves.getNext(top);
        return (!previous || previous.y + previous.height <= top)
            && (!next || bottom <= next.y);
    }

    getStaff(staffNumber: number): Staff | undefined {
        return this.staves.get(staffNumber);
    }
}
