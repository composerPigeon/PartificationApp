import type {FormState} from '../../form/states/FormState';

export interface SignUpState extends FormState {
    get userName(): string;
    set userName(value: string);
    get email(): string;
    set email(value: string);
    get password(): string;
    set password(value: string);
    get confirmPassword(): string;
    set confirmPassword(value: string);
}
