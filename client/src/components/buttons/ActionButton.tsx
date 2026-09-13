import { Button } from '@mui/material'
import type { ButtonProps } from '@mui/material'

export interface ActionButtonProps extends Pick<ButtonProps,
  'children' | 'onClick' | 'disabled' | 'fullWidth' | 'sx' | 'id' | 'aria-label' | 'aria-controls' | 'aria-expanded'
> {
  busy?: boolean
}

/** Secondary action; never submits its surrounding form. */
export function ActionButton({ busy = false, disabled, ...props }: ActionButtonProps) {
  return <Button {...props} type="button" variant="outlined" disabled={disabled || busy} aria-busy={busy} />
}
