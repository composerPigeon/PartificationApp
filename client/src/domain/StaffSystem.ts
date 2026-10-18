import {JsonProperty, Serializable} from "ts-jackson";
import type {Staff} from "./Staff.ts";

@Serializable()
export class StaffSystem {
    @JsonProperty()
    id: number;

    @JsonProperty({path: "staves"})
    staffCode: string = "";

    minStaffId: number;
    staves: Map<number, Staff>;

    constructor(id: number, staves: Staff[]) {
        this.id = id;
        this.staves = new Map(staves.map(s => [s.id, s]));
        this.minStaffId = Math.min(...staves.map(s => s.id));
        this.updateStaffCode()
    }

    private updateStaffCode() {
        this.staffCode = `${this.minStaffId}-${this.minStaffId + this.staves.size}`
    }

    addStaff(staff: Staff) {
        if (staff.id === this.minStaffId - 1) {
            this.staves.set(staff.id, staff);
            this.minStaffId = staff.id;
        }
        else if (staff.id === this.minStaffId + this.staves.size) {
            this.staves.set(staff.id, staff);
        }
        else return;

        this.updateStaffCode()
    }

    removeStaff(staffNumber: number) {
        if (this.staves.size === 1)
            return;

        if (staffNumber === this.minStaffId - 1) {
            this.staves.delete(staffNumber);
            this.minStaffId = staffNumber + 1;
        }
        else if (staffNumber === this.minStaffId + this.staves.size) {
            this.staves.delete(staffNumber);
        }
        else return;

        this.updateStaffCode()
    }
}