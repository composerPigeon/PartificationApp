import {JsonProperty, Serializable} from "ts-jackson";
import {StaveDivider} from "./StaveDivider.ts";
import type {Instrument} from "./Instrument.ts";


@Serializable()
export class Stave {
    @JsonProperty()
    id: number;

    @JsonProperty()
    bbox: number[];

    x: number;
    y: number;
    width: number;
    height: number;

    instrument: Instrument;
    topDivider: StaveDivider;
    bottomDivider: StaveDivider;

    constructor(number: number, x: number, y: number, width: number, height: number, instrument: Instrument) {
        this.id = number;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.bbox = [x, y, width, height];

        this.instrument = instrument;

        this.topDivider = new StaveDivider(this, y)
        this.bottomDivider = new StaveDivider(this, y + height)
    }
}