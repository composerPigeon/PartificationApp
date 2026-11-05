import type {FormBaseState} from "../FormBaseState.ts";
import type {SubmitEvent} from "react";

export interface SignUpState extends FormBaseState {
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
