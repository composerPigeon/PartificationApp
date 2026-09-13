import { FullField } from '../FullField'
import type { FieldProps } from '../FullField'

interface PasswordFieldProps extends Pick<FieldProps, 'value' | 'setValue' | 'disabled' | 'error'> {
  newPassword?: boolean
  label?: string
  name?: string
}

export default function PasswordField({ newPassword = false, label = 'Password', name = 'password', ...props }: PasswordFieldProps) {
  return <FullField {...props} label={label} name={name} type="password"
    autoComplete={newPassword ? 'new-password' : 'current-password'} maxLength={1024} />
}
