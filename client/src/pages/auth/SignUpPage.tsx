import {Link} from '@tanstack/react-router'
import {
    Alert,
    Link as MuiLink,
    Typography,
} from '@mui/material'
import Form from "../../components/formComponents/Form.tsx";
import PasswordField from '../../components/formComponents/PasswordField.tsx'
import EmailField from "../../components/formComponents/EmailField.tsx";
import FormPage from "../../components/formComponents/FormPage.tsx";
import {useSignUp} from "../../hooks/auth/useSignUp.ts";
import PasswordType from "../../components/formComponents/PasswordType.ts";
import UserNameField from "../../components/formComponents/UserNameField.tsx";

function SignUpPage() {
    var state = useSignUp()

    return (
        <FormPage title="Create new account" hideProfile>
            {state.error.value && (
                <Alert severity="error" sx={{mb: 2}}>
                    {state.error.value}
                </Alert>
            )}

            <Form submitButtonText="Create account" isBusy={state.isSubmitting.value}
                  isFormIncomplete={state.isIncomplete} handleSubmit={state.handleSignUp}>
                <UserNameField value={state.userName.value} setValue={state.userName.set} showHelp/>
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
