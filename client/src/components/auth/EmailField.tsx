import { FullField } from '../FullField'
import type { FieldProps } from '../FullField'

type EmailFieldProps = Pick<FieldProps, 'value' | 'setValue' | 'disabled' | 'autoFocus' | 'error'>

export default function EmailField(props: EmailFieldProps) {
  return <FullField {...props} label="Email address" name="email" type="email" autoComplete="email" maxLength={120} />
}
