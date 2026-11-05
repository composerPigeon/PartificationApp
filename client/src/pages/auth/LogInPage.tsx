import {Link} from '@tanstack/react-router'
import {
    Alert,
    Link as MuiLink,
    Typography,
} from '@mui/material'
import UserNameField from "../../components/formComponents/UserNameField.tsx";
import Form from "../../components/formComponents/Form.tsx";
import PasswordField from "../../components/formComponents/PasswordField.tsx";
import FormPage from "../../components/formComponents/FormPage.tsx";

import {useLogIn} from "../../hooks/auth/useLogIn.ts";
import PasswordType from "../../components/formComponents/PasswordType.ts";

function LogInPage() {
    const state = useLogIn();


    return (
        <FormPage title="Log in" hideProfile>
            {state.error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {state.error}
                </Alert>
            )}

            <Form submitButtonText="Log in" isBusy={state.isSubmitting} isFormIncomplete={state.isIncomplete}
                  handleSubmit={state.handleLogIn}>
                <UserNameField state={state}/>
                <PasswordField passwordType={PasswordType.Normal} state={state} field="password"/>
            </Form>

            <Typography align="center" color="text.secondary" sx={{mt: 3}}>
                Don&apos;t have an account?{' '}
                <MuiLink component={Link} to="/signup">
                    Sign up
                </MuiLink>
            </Typography>
        </FormPage>
    )
}

export default LogInPage
