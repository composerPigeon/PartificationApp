import type {BaseState} from './BaseState.ts';

export interface PagingState extends BaseState {
    get pageIndex(): number;
    get pageCount(): number;
    set pageCount(value: number);

    previous(): void;
    next(): void;
    reset(): void;
}
