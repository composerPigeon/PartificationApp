import type {BaseState} from './BaseState.ts';

export interface FormBaseState extends BaseState {
    get isSubmitting(): boolean,
    set isSubmitting(value: boolean),

    get isIncomplete(): boolean,
}
