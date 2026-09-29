import { Link } from '@tanstack/react-router'
import {
  Alert,
  Link as MuiLink,
  Typography,
} from '@mui/material'
import EmailField from "../../components/formComponents/EmailField.tsx";
import Form from "../../components/formComponents/Form.tsx";
import PasswordField from "../../components/formComponents/PasswordField.tsx";
import { ActionButton } from '../../components/buttons/ActionButton'
import FormPage from "../../components/formComponents/FormPage.tsx";

import {type LoginState, useLogIn} from "../../hooks/auth/useLogIn.ts";
import FormTitle from "../../components/formComponents/FormTitle.tsx";
import PasswordType from "../../components/formComponents/PasswordType.ts";

function LogInPage() {
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
          <EmailField setValue={state.email.set} value={state.email.value}/>
          <PasswordField passwordType={PasswordType.Normal} setValue={state.password.set} value={state.password.value}/>
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

export default LogInPage
