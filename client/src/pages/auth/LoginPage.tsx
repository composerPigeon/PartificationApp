import { Link } from '@tanstack/react-router'
import {
  Alert,
  Link as MuiLink,
  Typography,
} from '@mui/material'
import EmailField from "../../components/auth/EmailField.tsx";
import Form from "../../components/formComponents/Form.tsx";
import PasswordField from "../../components/auth/PasswordField.tsx";
import { ActionButton } from '../../components/buttons/ActionButton'
import FormPage from "../../components/formComponents/FormPage.tsx";

import {type LoginState, useLogIn} from "../../hooks/auth/useLogIn.ts";
import FormTitle from "../../components/formComponents/FormTitle.tsx";

function LoginPage() {
  var state: LoginState = useLogIn();


  return (
    <FormPage>
      <FormTitle>
        Log in
      </FormTitle>

      {state.error.value && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error.value}
        </Alert>
      )}

      <Form submitButtonText="Log in" isBusy={state.isSubmitting.value} isFormIncomplete={state.isIncomplete} handleSubmit={state.handleLogin}>
          <EmailField autoFocus setValue={state.email.set} value={state.email.value}/>
          <PasswordField setValue={state.password.set} value={state.password.value}/>
      </Form>

      <ActionButton fullWidth sx={{ mt: 2 }} busy={state.isSubmitting.value}>
        Continue as guest
      </ActionButton>

      <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
        Don&apos;t have an account?{' '}
        <MuiLink component={Link} to="/signup">
          Sign up
        </MuiLink>
      </Typography>
    </FormPage>
  )
}

export default LoginPage
