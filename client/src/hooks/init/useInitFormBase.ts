import {useRef, useState} from 'react';
import type {FormBaseState, ViewState} from '../states';

export function useInitFormBase(base: ViewState, isIncomplete = false): FormBaseState {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitting = useRef(false);

    function updateSubmitting(value: boolean) {
        submitting.current = value;
        setIsSubmitting(value);
    }

    async function submit(action: () => Promise<void>, fallbackError: string) {
        if (submitting.current) return;
        // eslint-disable-next-line react-hooks/immutability -- The accessor delegates to a React state setter.
        base.error = null;
        updateSubmitting(true);
        try {
            await action();
        } catch (caughtError) {
            base.error = caughtError instanceof Error ? caughtError.message : fallbackError;
        } finally {
            updateSubmitting(false);
        }
    }

    return {
        get error() { return base.error; },
        set error(value: string | null) { base.error = value; },
        get isSubmitting() { return isSubmitting; },
        set isSubmitting(value: boolean) { updateSubmitting(value); },
        get isIncomplete() { return isIncomplete; },
        submit,
    };
}
