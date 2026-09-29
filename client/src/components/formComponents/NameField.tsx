import {TextField} from "@mui/material";

interface NameFieldProps {
    value: string,
    setValue: (value: string) => void,
    disabled?: boolean,
    label: string,
    autoComplete: string
    required: boolean
}

export default function NameField({value, setValue, disabled, label, autoComplete, required}:NameFieldProps) {

    return <TextField label={label} type="text" value={value} fullWidth margin="normal"
        onChange={event => setValue(event.target.value)}
        autoComplete={autoComplete} disabled={disabled} required={required}/>
}