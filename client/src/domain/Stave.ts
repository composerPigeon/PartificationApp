import {JsonProperty, Serializable} from 'ts-jackson'
import {StaveDivider} from './StaveDivider.ts'
import type {Instrument} from './Instrument.ts'
import type {ScoreElement} from './ScoreElement.ts'

export interface StaveBounds {
    x: number
    y: number
    width: number
    height: number
}

@Serializable()
export class Stave implements ScoreElement {
    @JsonProperty()
    id: number

    @JsonProperty()
    bbox: [number, number, number, number]

    instrument: Instrument
    topDivider: StaveDivider
    bottomDivider: StaveDivider

    constructor(id: number, bounds: StaveBounds, instrument: Instrument) {
        this.id = id
        this.bbox = [bounds.x, bounds.y, bounds.width, bounds.height]
        this.instrument = instrument
        this.topDivider = new StaveDivider(this, bounds.y)
        this.bottomDivider = new StaveDivider(this, this.y + this.height)
    }

    get x(): number { return this.bbox[0] }
    set x(value: number) { this.bbox[0] = value }
    get y(): number { return this.bbox[1] }
    set y(value: number) { this.bbox[1] = value }
    get width(): number { return this.bbox[2] }
    set width(value: number) { this.bbox[2] = value }
    get height(): number { return this.bbox[3] }
    set height(value: number) { this.bbox[3] = value }
}
