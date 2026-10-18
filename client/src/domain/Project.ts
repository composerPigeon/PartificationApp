import {JsonProperty, Serializable} from "ts-jackson";
import {Instrument} from "./Instrument.ts";

@Serializable()
export class Project {
    @JsonProperty()
    id: string;

    @JsonProperty({path: "project_name"})
    projectName: string;

    @JsonProperty({path: "directory_name"})
    directoryName: string;

    @JsonProperty({path: "page_count"})
    pageCount: number;

    @JsonProperty({path: "instruments"})
    private readonly _instruments: Instrument[];

    constructor(projectId: string = "", projectName: string = "", directoryName: string = "",
                pageCount: number = 0, instruments: Instrument[] = []) {
        this.id = projectId;
        this.projectName = projectName;
        this.directoryName = directoryName;
        this.pageCount = pageCount;
        this._instruments = instruments;
    }

    public addInstrument(instrument: Instrument) {
        if (!this._instruments.find(existing => existing.id === instrument.id)) {
            this._instruments.push(instrument);
        }
    }

    public getInstrument(instrumentTitle: string): Instrument | undefined {
        let id = Instrument.createId(instrumentTitle);
        return this._instruments.find(instrument => instrument.id === id);
    }

    public get instruments(): Instrument[] {
        return this._instruments;
    }

    /** Browser history preserves data but removes class prototypes and getters. */
    public static fromSnapshot(data: Project): Project {
        return new Project(data.id, data.projectName, data.directoryName, data.pageCount,
            (data._instruments ?? data.instruments ?? []).map(instrument =>
                new Instrument(instrument.title, instrument.shortcut)));
    }
}
