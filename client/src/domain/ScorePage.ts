import {JsonProperty, Serializable} from "ts-jackson";
import {Staff} from "./Staff.ts";
import {Instrument} from './Instrument.ts';
import {GrandStaff} from "./GrandStaff.ts";
import {StaffSystem} from "./StaffSystem.ts";

@Serializable()
export class ScorePage {
    projectId: string;
    number: number;
    blob: Blob;

    @JsonProperty()
    width: number;
    @JsonProperty()
    height: number;

    staves: Map<number, Staff>;
    grandStaves: Map<number, GrandStaff>;
    systems: Map<number, StaffSystem>;

    constructor(projectId: string, number: number, width: number, height: number, blob: Blob) {
        this.projectId = projectId;
        this.number = number;
        this.width = width;
        this.height = height;
        this.blob = blob;

        this.staves = new Map();
        this.grandStaves = new Map();
        this.systems = new Map();
    }

    addStaff(staff: Staff): void {
        if (!this.staves.has(staff.id)) {
            this.staves.set(staff.id, staff);
        }
    }

    createStaff(centerY: number, height: number = 75, instrument: Instrument): Staff {
        let id = 1;
        for (const existingId of this.staves.keys()) id = Math.max(id, existingId + 1);
        const staff = new Staff(id, {x: 0, y: centerY - height / 2, width: this.width, height}, instrument);
        this.addStaff(staff);
        return staff;
    }

    getStaff(staffNumber: number): Staff | undefined {
        return this.staves.get(staffNumber);
    }
}
