import {TextField} from "@mui/material";
import PasswordType from "./PasswordType.ts";

interface PasswordFieldProps<K extends 'password' | 'confirmPassword'> {
    state: Record<K, string>;
    field: K;
    disabled?: boolean;
    passwordType: PasswordType;
}

export default function PasswordField<K extends 'password' | 'confirmPassword'>({state, field, disabled, passwordType}: PasswordFieldProps<K>) {
    let label = "Password";
    let name = "password";
    let autoComplete = "password";

    if (passwordType === PasswordType.New) {
        autoComplete = "new-password";
    }
    else if (passwordType === PasswordType.Confirm) {
        label = "Confirm password";
        name = "confirm-password";
        autoComplete = "confirm-password";
    }

    return <TextField label={label} name={name} type="password" value={state[field]}
        onChange={event => { state[field] = event.target.value; }} fullWidth margin="normal"
        autoComplete={autoComplete} disabled={disabled} required/>
}
