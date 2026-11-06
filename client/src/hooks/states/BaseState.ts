export interface BaseState {
    get error(): string | null;
    set error(value: string | null);

    /** Requests a render after changing mutable domain objects. */
    refresh(): void;

    extend<T extends object>(fields: T): T & this;
}
