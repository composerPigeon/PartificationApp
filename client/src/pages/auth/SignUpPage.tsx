import { Link } from '@tanstack/react-router'
import {
  Alert,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material'
import Form from "../../components/formComponents/Form.tsx";
import { FullField } from '../../components/FullField'
import PasswordField from '../../components/auth/PasswordField'
import EmailField from "../../components/auth/EmailField.tsx";
import FormPage from "../../components/formComponents/FormPage.tsx";
import FormTitle from "../../components/formComponents/FormTitle.tsx";
import {useSignUp} from "../../hooks/auth/useSignUp.ts";

function SignUpPage() {
  var state = useSignUp()

  return (
    <FormPage>
      <FormTitle>Create new account</FormTitle>
      <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
        Start using Partification
      </Typography>

      {state.error.value && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error.value}
        </Alert>
      )}

      <Form submitButtonText="Create account" isBusy={state.isSubmitting.value} isFormIncomplete={state.isIncomplete} handleSubmit={state.handleSignUp}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ sm: 2 }}>
          <FullField label="First name" name="firstName" autoComplete="given-name" autoFocus
            minLength={3} maxLength={80} value={state.givenName.value} setValue={state.givenName.set} />
          <FullField label="Last name" name="lastName" autoComplete="family-name"
            minLength={3} maxLength={80} value={state.familyName.value} setValue={state.familyName.set} />
        </Stack>
        <EmailField setValue={state.email.set} value={state.email.value}/>
        <PasswordField newPassword value={state.password.value} setValue={state.password.set} />
        <PasswordField newPassword label="Confirm password" name="confirmPassword"
          value={state.confirmPassword.value} setValue={state.confirmPassword.set} />
      </Form>

      <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
        Already have an account?{' '}
        <MuiLink component={Link} to="/login">
          Log in
        </MuiLink>
      </Typography>
    </FormPage>
  )
}

export default SignUpPage
