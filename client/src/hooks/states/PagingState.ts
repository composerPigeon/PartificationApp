export interface PagingState {
    get pageIndex(): number;
    get pageCount(): number;
    set pageCount(value: number);

    previous(): void;
    next(): void;
    reset(): void;
}
