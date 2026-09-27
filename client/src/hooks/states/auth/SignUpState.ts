import type {FormBaseState} from "../FormBaseState.ts";
import type {PropertyState} from "../PropertyState.ts";
import type {SubmitEvent} from "react";

export interface SignUpState extends FormBaseState {
    givenName: PropertyState<string>;
    familyName: PropertyState<string>;
    email: PropertyState<string>;
    password: PropertyState<string>;
    confirmPassword: PropertyState<string>;

    handleSignUp: (event: SubmitEvent<HTMLFormElement>) => void;
}