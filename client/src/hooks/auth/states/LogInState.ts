import type {FormBaseState} from "../../states/FormBaseState.ts";
import type {SubmitEvent} from 'react'

export interface LogInState extends FormBaseState {
    get userName(): string,
    set userName(value: string),

    get password(): string,
    set password(value: string),

    handleLogIn: (event: SubmitEvent<HTMLFormElement>) => Promise<void>
}