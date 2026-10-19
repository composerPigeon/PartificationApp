import {JsonProperty, Serializable} from 'ts-jackson';
import type {ScorePage} from '../ScorePage.ts';

@Serializable()
export class ScorePageMetadata {
    @JsonProperty()
    width: number;

    @JsonProperty()
    height: number;

    @JsonProperty({type: Object, required: true})
    instruments: Record<string, string>;

    constructor(width: number = 0, height: number = 0, instruments: Record<string, string> = {}) {
        this.width = width;
        this.height = height;
        this.instruments = instruments;
    }

    static create(page: ScorePage): ScorePageMetadata {
        const metadata = new ScorePageMetadata(page.width, page.height);
        let order = 1;
        for (const staff of page.staves) metadata.instruments[String(order++)] = staff.instrument.id;
        return metadata;
    }
}
