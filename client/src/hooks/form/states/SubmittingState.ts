export interface SubmittingState {
    readonly isSubmitting: boolean;
    submit(action: () => Promise<void>, fallbackError: string): Promise<void>;
}
