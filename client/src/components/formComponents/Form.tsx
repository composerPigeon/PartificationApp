import {useView} from '../../hooks/useView';
import {useSubmitting} from '../../hooks/form';
import {Alert, Box} from '@mui/material';
import type {ReactNode} from 'react';
import type {FormState} from '../../hooks/form';
import {SubmitButton} from '../buttons/SubmitButton.tsx';

interface FormProps {
    submitButtonText: string;
    state: FormState;
    children: ReactNode;
}

function Form({submitButtonText, state, children}: FormProps) {
    const {isSubmitting} = useSubmitting();
    const {error} = useView();
    return (
        <Box component="form" onSubmit={state.handleSubmit}>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            <Box component="fieldset" disabled={isSubmitting} sx={{border: 0, p: 0, m: 0, minWidth: 0}}>
                {children}
            </Box>
            <Box sx={{mt: 3}}>
                <SubmitButton disabled={isSubmitting || state.isIncomplete}>
                    {submitButtonText}
                </SubmitButton>
            </Box>
        </Box>
    );
}

export default Form;
