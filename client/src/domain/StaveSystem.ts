import {JsonProperty, Serializable} from "ts-jackson";
import type {Stave} from "./Stave.ts";

@Serializable()
export class StaveSystem {
    @JsonProperty()
    id: number;

    @JsonProperty({path: "staves"})
    staveCode: string = "";

    minStaveId: number;
    staves: Map<number, Stave>;

    constructor(id: number, staves: Stave[]) {
        this.id = id;
        this.staves = new Map(staves.map(s => [s.id, s]));
        this.minStaveId = Math.min(...staves.map(s => s.id));
        this.updateStaveCode()
    }

    private updateStaveCode() {
        this.staveCode = `${this.minStaveId}-${this.minStaveId + this.staves.size}`
    }

    addStave(stave: Stave) {
        if (stave.id === this.minStaveId - 1) {
            this.staves.set(stave.id, stave);
            this.minStaveId = stave.id;
        }
        else if (stave.id === this.minStaveId + this.staves.size) {
            this.staves.set(stave.id, stave);
        }
        else return;

        this.updateStaveCode()
    }

    removeStave(staveNumber: number) {
        if (this.staves.size === 1)
            return;

        if (staveNumber === this.minStaveId - 1) {
            this.staves.delete(staveNumber);
            this.minStaveId = staveNumber + 1;
        }
        else if (staveNumber === this.minStaveId + this.staves.size) {
            this.staves.delete(staveNumber);
        }
        else return;

        this.updateStaveCode()
    }
}