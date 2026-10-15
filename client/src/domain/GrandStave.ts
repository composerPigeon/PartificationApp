import {JsonProperty, Serializable} from "ts-jackson";
import type {Stave} from "./Stave.ts";

@Serializable()
export class GrandStave {
    @JsonProperty()
    staves: string

    @JsonProperty()
    id: number;

    firstStave: Stave;
    secondStave: Stave;

    constructor(number: number, firstStave: Stave, secondStave: Stave)  {
        this.id = number;
        this.staves = `${firstStave.id}-${secondStave.id}`;
        this.firstStave = firstStave;
        this.secondStave = secondStave;
    }
}