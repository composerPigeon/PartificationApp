import type {Staff} from "./Staff.ts";
import type {ScoreElement} from "./ScoreElement.ts";


export class StaffDivider implements ScoreElement {
    staff: Staff;
    y: number;

    constructor(staff: Staff, y: number) {
        this.staff = staff;
        this.y = y;
    }
}
