import {JsonProperty, Serializable} from "ts-jackson";
import type {Stave} from "./Stave.ts";
import {GrandStave} from "./GrandStave.ts";
import {StaveSystem} from "./StaveSystem.ts";

@Serializable()
export class ProjectPage {
    projectId: string;
    number: number;
    blob: Blob;

    @JsonProperty()
    width: number;
    @JsonProperty()
    height: number;

    staves: Map<number, Stave>;
    grandStaves: Map<number, GrandStave>;
    systems: Map<number, StaveSystem>;

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

    addStave(stave: Stave): void {
        if (!this.staves.has(stave.id)) {
            this.staves.set(stave.id, stave);
        }
    }

    getStave(staveNumber: number): Stave | undefined {
        return this.staves.get(staveNumber);
    }

    createGrandStave(staveNumber: number): void {
        let firstStave = this.getStave(staveNumber);
        let secondStave = this.getStave(staveNumber + 1);

        if (!this.grandStaves.has(staveNumber)
            && firstStave && secondStave
        ) {
            this.grandStaves.set(staveNumber, new GrandStave(staveNumber, firstStave, secondStave));
        }
    }

    createStaveSystem(staveNumber: number, size: number): void {
        if (this.systems.has(staveNumber))
            return;

        let staves: Stave[] = []

        for (let i = 0; i < size; i++) {
            let stave = this.getStave(staveNumber + i);
            if (!stave)
                return;

            staves.push(stave);
        }

        let system = new StaveSystem(staveNumber, staves)
        this.systems.set(system.id, system);
    }
}
