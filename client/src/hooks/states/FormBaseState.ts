import type {PropertyState} from "./PropertyState.ts";

export interface FormBaseState {
    error: PropertyState<string | null>,
    isSubmitting: PropertyState<boolean>,
    isIncomplete: boolean,
}