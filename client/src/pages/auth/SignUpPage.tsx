import {Link} from '@tanstack/react-router'
import {
    Alert,
    Link as MuiLink,
    Stack,
    Typography,
} from '@mui/material'
import Form from "../../components/formComponents/Form.tsx";
import PasswordField from '../../components/formComponents/PasswordField.tsx'
import EmailField from "../../components/formComponents/EmailField.tsx";
import FormPage from "../../components/formComponents/FormPage.tsx";
import {useSignUp} from "../../hooks/auth/useSignUp.ts";
import PasswordType from "../../components/formComponents/PasswordType.ts";
import NameField from "../../components/formComponents/NameField.tsx";

function SignUpPage() {
    var state = useSignUp()

    return (
        <FormPage title="Create new account">
            <Typography color="text.secondary" align="center" sx={{mb: 3}}>
                Start using Partification
            </Typography>

            {state.error.value && (
                <Alert severity="error" sx={{mb: 2}}>
                    {state.error.value}
                </Alert>
            )}

            <Form submitButtonText="Create account" isBusy={state.isSubmitting.value}
                  isFormIncomplete={state.isIncomplete} handleSubmit={state.handleSignUp}>
                <Stack direction={{xs: 'column', sm: 'row'}} spacing={{sm: 2}}>
                    <NameField label="Given name" autoComplete="given-name" required
                               value={state.givenName.value} setValue={state.givenName.set}/>
                    <NameField label="Family name" autoComplete="family-name" required
                               value={state.familyName.value} setValue={state.familyName.set}/>
                </Stack>
                <EmailField setValue={state.email.set} value={state.email.value}/>
                <PasswordField passwordType={PasswordType.New} value={state.password.value}
                               setValue={state.password.set}/>
                <PasswordField passwordType={PasswordType.Confirm} value={state.confirmPassword.value}
                               setValue={state.confirmPassword.set}/>
            </Form>

            <Typography align="center" color="text.secondary" sx={{mt: 3}}>
                Already have an account?{' '}
                <MuiLink component={Link} to="/login">
                    Log in
                </MuiLink>
            </Typography>
        </FormPage>
    )
}

export default SignUpPage
