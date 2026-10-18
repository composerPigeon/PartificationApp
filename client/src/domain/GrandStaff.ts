import {JsonProperty, Serializable} from "ts-jackson";
import type {Staff} from "./Staff.ts";
import type {Instrument} from "./Instrument.ts";

@Serializable()
export class GrandStaff {
    @JsonProperty()
    staves: string

    @JsonProperty()
    id: number;

    instrument: Instrument;
    firstStaff: Staff;
    secondStaff: Staff;

    constructor(number: number, instrument: Instrument, firstStaff: Staff, secondStaff: Staff)  {
        this.id = number;
        this.staves = `${firstStaff.id}-${secondStaff.id}`;
        this.firstStaff = firstStaff;
        this.secondStaff = secondStaff;
        this.instrument = instrument;
    }
}