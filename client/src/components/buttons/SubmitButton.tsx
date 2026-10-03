import {Button} from '@mui/material'
import type {ReactNode} from 'react'

export interface SubmitButtonProps {
    children: ReactNode
    busy?: boolean
    busyLabel?: string
    disabled?: boolean
}

/** Standard full-width form action. The form owns validation and submission. */
export function SubmitButton({children, busy = false, busyLabel = 'Submitting…', disabled}: SubmitButtonProps) {
    return (
        <Button type="submit" variant="contained" fullWidth size="large"
                disabled={disabled || busy} aria-busy={busy}>
            {busy ? busyLabel : children}
        </Button>
    )
}
