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

    @JsonProperty({type: Object})
    leftDivider: {x: number};

    @JsonProperty({type: Object})
    rightDivider: {x: number};

    constructor(width: number = 0, height: number = 0, instruments: Record<string, string> = {}) {
        this.width = width;
        this.height = height;
        this.instruments = instruments;
        this.leftDivider = {x: 0};
        this.rightDivider = {x: width};
    }

    static create(page: ScorePage): ScorePageMetadata {
        const metadata = new ScorePageMetadata(page.width, page.height);
        metadata.leftDivider = {x: page.leftDivider.x};
        metadata.rightDivider = {x: page.rightDivider.x};
        let order = 1;
        for (const staff of page.staves) metadata.instruments[String(order++)] = staff.instrument.id;
        return metadata;
    }
}
