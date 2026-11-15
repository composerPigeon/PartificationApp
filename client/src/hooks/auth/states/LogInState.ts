import type {SubmitEvent} from 'react'

export interface LogInState {
    get error(): string | null;
    set error(value: string | null);
    get isSubmitting(): boolean;
    set isSubmitting(value: boolean);
    get isIncomplete(): boolean;

    get userName(): string,
    set userName(value: string),

    get password(): string,
    set password(value: string),

    handleLogIn: (event: SubmitEvent<HTMLFormElement>) => Promise<void>
}
