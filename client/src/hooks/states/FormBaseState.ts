export interface FormBaseState {
    get error(): string | null,
    set error(value: string | null),

    get isSubmitting(): boolean,
    set isSubmitting(value: boolean),

    get isIncomplete(): boolean,
}
