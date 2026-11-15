import type {SubmitEvent} from 'react';

export interface FormState {
    readonly isIncomplete: boolean;
    handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void>;
}
