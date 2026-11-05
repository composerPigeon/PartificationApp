import {TextField} from "@mui/material";

interface EmailFieldProps {
    state: { email: string },
    disabled?: boolean
}

export default function EmailField({state, disabled}: EmailFieldProps) {
    return <TextField label="Email address" name="email" type="email" value={state.email}
        onChange={event => { state.email = event.target.value; }} fullWidth
        margin="normal" autoComplete="email" disabled={disabled} required />
}
