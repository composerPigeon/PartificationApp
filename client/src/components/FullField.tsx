import { useId } from 'react'
import { TextField } from '@mui/material'

export interface FieldProps {
  label: string
  value: string
  setValue(value: string): void
  name?: string
  type?: 'text' | 'email' | 'password'
  autoComplete?: string
  autoFocus?: boolean
  disabled?: boolean
  required?: boolean
  minLength?: number
  maxLength?: number
  error?: string
}

/** Required, full-width controlled input with consistent spacing and errors. */
export function FullField({
  label, value, setValue, name, type = 'text', autoComplete, autoFocus = false,
  disabled, required = true, minLength, maxLength, error,
}: FieldProps) {
  const id = useId()
  return (
    <TextField id={id} label={label} name={name} type={type} value={value}
      onChange={event => setValue(event.target.value)} fullWidth margin="normal"
      autoComplete={autoComplete} autoFocus={autoFocus} disabled={disabled} required={required}
      error={Boolean(error)} helperText={error}
      slotProps={{ htmlInput: { minLength, maxLength } }} />
  )
}
