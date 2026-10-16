import type {Stave} from "./Stave.ts";
import type {ScoreElement} from "./ScoreElement.ts";


export class StaveDivider implements ScoreElement {
    stave: Stave;
    y: number;

    constructor(stave: Stave, y: number) {
        this.stave = stave;
        this.y = y;
    }

    private canMergeWithBottom(bottomDiv: StaveDivider): boolean {
        return this.stave.id === bottomDiv.stave.id - 1
            && this.stave.topDivider === this
            && bottomDiv.stave.bottomDivider === bottomDiv;
    }

    private mergeWithBottom(bottomDiv: StaveDivider): void {
        this.y = Math.round((this.y + bottomDiv.y) / 2);
        bottomDiv.stave.bottomDivider = this;
    }

    private canMergeWithTop(topDiv: StaveDivider): boolean {
        return this.stave.id === topDiv.stave.id + 1
            && topDiv.stave.topDivider === topDiv
            && this.stave.bottomDivider === this;
    }

    private mergeWithTop(topDiv: StaveDivider): void {
        this.y = Math.round((this.y + topDiv.y) / 2);
        topDiv.stave.topDivider = this;
    }

    canMergeWith(divider: StaveDivider): boolean {
        return this.canMergeWithBottom(divider) || this.canMergeWithTop(divider);
    }

    mergeWith(divider: StaveDivider) {
        if (this.canMergeWithBottom(divider)) {
            this.mergeWithBottom(divider);
        }
        else if (this.canMergeWithTop(divider)) {
            this.mergeWithTop(divider);
        }
    }
}
