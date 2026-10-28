import type {ScoreElement} from "./ScoreElement.ts";

export class VerticalDivider implements ScoreElement {
    x: number;

    constructor(x: number) {
        this.x = x;
    }
}
