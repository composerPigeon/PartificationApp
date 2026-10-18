import {JsonProperty, Serializable} from "ts-jackson";
import {Staff} from "./Staff.ts";
import {Instrument} from './Instrument.ts';
import {GrandStaff} from "./GrandStaff.ts";
import {StaffSystem} from "./StaffSystem.ts";

@Serializable()
export class ProjectPage {
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

    createStaff(centerY: number, height: number = 75, instrument: Instrument = new Instrument('Unassigned', '')): Staff {
        let id = 1;
        for (const existingId of this.staves.keys()) id = Math.max(id, existingId + 1);
        const staff = new Staff(id, {x: 0, y: centerY - height / 2, width: this.width, height}, instrument);
        this.addStaff(staff);
        return staff;
    }

    getStaff(staffNumber: number): Staff | undefined {
        return this.staves.get(staffNumber);
    }

    createGrandStaff(staffNumber: number): void {
        let firstStaff = this.getStaff(staffNumber);
        let secondStaff = this.getStaff(staffNumber + 1);

        if (!this.grandStaves.has(staffNumber)
            && firstStaff && secondStaff
        ) {
            let inst = new Instrument("Untitled", "")
            this.grandStaves.set(staffNumber, new GrandStaff(staffNumber, inst, firstStaff, secondStaff));
        }
    }

    createStaffSystem(staffNumber: number, size: number): void {
        if (this.systems.has(staffNumber))
            return;

        let staves: Staff[] = []

        for (let i = 0; i < size; i++) {
            let staff = this.getStaff(staffNumber + i);
            if (!staff)
                return;

            staves.push(staff);
        }

        let system = new StaffSystem(staffNumber, staves)
        this.systems.set(system.id, system);
    }
}
