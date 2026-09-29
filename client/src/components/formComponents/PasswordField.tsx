import {TextField} from "@mui/material";
import PasswordType from "./PasswordType.ts";

interface PasswordFieldProps {
    value: string;
    setValue: (value: string) => void;
    disabled?: boolean;
    passwordType: PasswordType;
}

export default function PasswordField({ value, setValue, disabled, passwordType}: PasswordFieldProps) {
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

    return <TextField label={label} name={name} type="password" value={value}
        onChange={event => setValue(event.target.value)} fullWidth margin="normal"
        autoComplete={autoComplete} disabled={disabled} required/>
}