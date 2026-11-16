import {JsonProperty, Serializable} from "ts-jackson";
import {Instrument} from "./Instrument.ts";
import {ExportContext} from './ExportContext.ts';
import {StaffSystem} from './StaffSystem.ts';
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

    @JsonProperty({path: "instruments", type: Array, elementType: Instrument})
    private readonly _instruments: Instrument[];

    @JsonProperty({path: 'exports', type: Array, elementType: ExportContext})
    exports: ExportContext[] = [];

    @JsonProperty({type: Array, elementType: StaffSystem})
    systems: StaffSystem[] = [];

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

    public deleteInstrument(instrumentId: string): boolean {
        const index = this._instruments.findIndex(instrument => instrument.id === instrumentId);
        if (index < 0) return false;
        this._instruments.splice(index, 1);
        for (const context of [...this.exports]) {
            if (context.instrumentIds.includes(instrumentId)) this.deleteExportContext(context.id);
        }
        return true;
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

    public getOrCreateExportContext(instruments: readonly Instrument[]): ExportContext {
        const context = new ExportContext(instruments.map(instrument => instrument.id));
        const existing = this.exports.find(existing => existing.id === context.id);
        if (existing) return existing;
        this.exports.push(context);
        return context;
    }

    public deleteExportContext(exportId: string): boolean {
        if (!this.exports.some(context => context.id === exportId)) return false;
        this.exports = this.exports.filter(context => context.id !== exportId);
        return true;
    }

    public resolveInstruments(context: ExportContext): Instrument[] {
        if (!this.exports.find(ex => ex.id === context.id))
            return [];

        const instrumentIds = new Set(context.instrumentIds);
        return this._instruments.filter(instrument => instrumentIds.has(instrument.id));
    }

}
