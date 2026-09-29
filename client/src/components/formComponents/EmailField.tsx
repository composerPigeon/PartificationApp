import {TextField} from "@mui/material";

interface EmailFieldProps {
    value: string,
    setValue: (value: string) => void,
    disabled?: boolean
}

export default function EmailField({value, setValue, disabled}: EmailFieldProps) {
    return <TextField label="Email address" name="email" type="email" value={value}
        onChange={event => setValue(event.target.value)} fullWidth
        margin="normal" autoComplete="email" disabled={disabled} required />
}
