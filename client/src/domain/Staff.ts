import {JsonProperty, Serializable} from 'ts-jackson'
import {StaffDivider} from './StaffDivider.ts'
import type {Instrument} from './Instrument.ts'
import type {ScoreElement} from './ScoreElement.ts'

export interface StaffBounds {
    x: number
    y: number
    width: number
    height: number
}

@Serializable()
export class Staff implements ScoreElement {
    @JsonProperty()
    id: number

    @JsonProperty()
    bbox: [number, number, number, number]

    instrument: Instrument
    topDivider: StaffDivider
    bottomDivider: StaffDivider

    constructor(id: number, bounds: StaffBounds, instrument: Instrument) {
        this.id = id
        this.bbox = [bounds.x, bounds.y, bounds.width, bounds.height]
        this.instrument = instrument
        this.topDivider = new StaffDivider(this, bounds.y)
        this.bottomDivider = new StaffDivider(this, this.y + this.height)
    }

    get bounds(): StaffBounds {
        return {
            x: this.bbox[0],
            y: this.bbox[1],
            width: this.bbox[2],
            height: this.bbox[3]
        }
    }

    get x(): number { return this.bbox[0] }
    get y(): number { return this.bbox[1] }
    set y(value: number) { this.bbox[1] = value }
    get width(): number { return this.bbox[2] }
    get height(): number { return this.bbox[3] }
}
