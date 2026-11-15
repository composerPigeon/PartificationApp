export interface ViewState {
    get error(): string | null;
    set error(value: string | null);

    /** Requests a render after changing mutable domain objects. */
    refresh(): void;
}
