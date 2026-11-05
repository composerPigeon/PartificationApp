import {TextField} from "@mui/material";

interface NameFieldProps {
    state: { name: string },
    disabled?: boolean,
    label: string,
    autoComplete: string
    required: boolean
}

export default function NameField({state, disabled, label, autoComplete, required}:NameFieldProps) {

    return <TextField label={label} type="text" value={state.name} fullWidth margin="normal"
        onChange={event => { state.name = event.target.value; }}
        autoComplete={autoComplete} disabled={disabled} required={required}/>
}
