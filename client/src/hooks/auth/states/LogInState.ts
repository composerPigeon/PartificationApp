import type {FormState} from '../../form/states/FormState';

export interface LogInState extends FormState {
    get userName(): string,
    set userName(value: string),

    get password(): string,
    set password(value: string),
}
