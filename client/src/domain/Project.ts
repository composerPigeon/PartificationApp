import {JsonProperty, Serializable} from "ts-jackson";
import {Instrument} from "./Instrument.ts";
import type {ProjectScoreDetails} from './ProjectScoreDetails.ts';

@Serializable()
export class Project implements ProjectScoreDetails {
    @JsonProperty()
    id: string;

    @JsonProperty({path: "project_name"})
    projectName: string;

    @JsonProperty({path: "directory_name"})
    directoryName: string;

    @JsonProperty({path: "page_count"})
    pageCount: number;

    @JsonProperty()
    title: string = '';

    @JsonProperty()
    subtitle: string = '';

    @JsonProperty()
    author: string = '';

    @JsonProperty({path: 'author_date'})
    authorDate: string = '';

    @JsonProperty()
    genre: string = '';

    @JsonProperty({path: 'allow_layout_model_training'})
    allowLayoutModelTraining: boolean = false;

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

    public getOrCreateInstrument(instrumentTitle: string, shortcut: string): Instrument {
        const existing = this.getInstrument(instrumentTitle);
        if (existing) return existing;
        const instrument = new Instrument(instrumentTitle, shortcut);
        this.addInstrument(instrument);
        return instrument;
    }

    public get instruments(): Instrument[] {
        return this._instruments;
    }

    /** Browser history preserves data but removes class prototypes and getters. */
    public static fromSnapshot(data: Project): Project {
        const project = new Project(data.id, data.projectName, data.directoryName, data.pageCount,
            (data._instruments ?? data.instruments ?? []).map(instrument =>
                new Instrument(instrument.title, instrument.shortcut)));
        project.title = data.title ?? '';
        project.subtitle = data.subtitle ?? '';
        project.author = data.author ?? '';
        project.authorDate = data.authorDate ?? '';
        project.genre = data.genre ?? '';
        project.allowLayoutModelTraining = data.allowLayoutModelTraining === true;
        return project;
    }
}
