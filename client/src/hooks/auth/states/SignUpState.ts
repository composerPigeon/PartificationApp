import type {SubmitEvent} from "react";

export interface SignUpState {
    get error(): string | null;
    set error(value: string | null);
    get isSubmitting(): boolean;
    set isSubmitting(value: boolean);
    get isIncomplete(): boolean;

    get userName(): string;
    set userName(value: string);
    get email(): string;
    set email(value: string);
    get password(): string;
    set password(value: string);
    get confirmPassword(): string;
    set confirmPassword(value: string);

    handleSignUp: (event: SubmitEvent<HTMLFormElement>) => void;
}
