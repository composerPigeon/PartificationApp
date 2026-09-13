import {Box} from '@mui/material';
import type {ReactNode, SubmitEvent} from 'react';
import {SubmitButton} from './buttons/SubmitButton';

interface FormProps {
    submitButtonText: string;
    submittingText?: string;
    isSubmitting?: boolean;
    isSubmitButtonDisabled: boolean;
    handleSubmit(event: SubmitEvent<HTMLFormElement>): void;
    children: ReactNode;
    noValidate?: boolean;
}

function Form({submitButtonText, submittingText, isSubmitting, isSubmitButtonDisabled, handleSubmit, children, noValidate = false}: FormProps) {
    return (
        <Box component="form" onSubmit={handleSubmit} noValidate={noValidate}>
            <Box component="fieldset" disabled={isSubmitting} sx={{border: 0, p: 0, m: 0, minWidth: 0}}>
                {children}
            </Box>
            <Box sx={{mt: 3}}>
                <SubmitButton busy={isSubmitting} busyLabel={submittingText} disabled={isSubmitButtonDisabled}>
                    {submitButtonText}
                </SubmitButton>
            </Box>
        </Box>
    );
}

export default Form;
