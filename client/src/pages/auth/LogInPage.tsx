import {FormProvider} from '../../components/formComponents/FormProvider';
import {Link} from '@tanstack/react-router'
import {
    Link as MuiLink,
    Typography,
} from '@mui/material'
import UserNameField from "../../components/formComponents/UserNameField.tsx";
import Form from "../../components/formComponents/Form.tsx";
import PasswordField from "../../components/formComponents/PasswordField.tsx";
import FormPage from "../../components/formComponents/FormPage.tsx";

import {useLogIn} from '../../hooks/auth';
import PasswordType from "../../components/formComponents/PasswordType.ts";

function LogInPage() {
    return <FormProvider><LogInContent/></FormProvider>;
}

function LogInContent() {
    const state = useLogIn();


    return (
        <FormPage title="Log in" hideProfile>

            <Form submitButtonText="Log in" state={state}>
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
