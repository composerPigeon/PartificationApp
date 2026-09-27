import {Box} from '@mui/material';
import type {ReactNode, SubmitEvent} from 'react';
import {SubmitButton} from '../buttons/SubmitButton.tsx';

interface FormProps {
    submitButtonText: string;
    isBusy: boolean;
    isFormIncomplete: boolean;
    handleSubmit(event: SubmitEvent<HTMLFormElement>): void;
    children: ReactNode;
}

function Form({submitButtonText, isBusy, isFormIncomplete, handleSubmit, children}: FormProps) {
    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Box component="fieldset" disabled={isBusy} sx={{border: 0, p: 0, m: 0, minWidth: 0}}>
                {children}
            </Box>
            <Box sx={{mt: 3}}>
                <SubmitButton disabled={isBusy || isFormIncomplete}>
                    {submitButtonText}
                </SubmitButton>
            </Box>
        </Box>
    );
}

export default Form;
