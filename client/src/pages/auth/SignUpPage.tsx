import {FormProvider} from '../../components/formComponents/FormProvider';
import {Link} from '@tanstack/react-router'
import {
    Link as MuiLink,
    Typography,
} from '@mui/material'
import Form from "../../components/formComponents/Form.tsx";
import PasswordField from '../../components/formComponents/PasswordField.tsx'
import EmailField from "../../components/formComponents/EmailField.tsx";
import FormPage from "../../components/formComponents/FormPage.tsx";
import {useSignUp} from '../../hooks/auth';
import PasswordType from "../../components/formComponents/PasswordType.ts";
import UserNameField from "../../components/formComponents/UserNameField.tsx";

function SignUpPage() {
    return <FormProvider><SignUpContent/></FormProvider>;
}

function SignUpContent() {
    const state = useSignUp()

    return (
        <FormPage title="Create new account" hideProfile>

            <Form submitButtonText="Create account" state={state}>
                <UserNameField state={state} showHelp/>
                <EmailField state={state}/>
                <PasswordField passwordType={PasswordType.New} state={state} field="password"/>
                <PasswordField passwordType={PasswordType.Confirm} state={state} field="confirmPassword"/>
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
