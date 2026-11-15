import {useRef, useState} from 'react';
import type {ViewState} from '../../states';
import type {SubmittingState} from '../states/SubmittingState';

export function useInitSubmitting(view: ViewState): SubmittingState {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitting = useRef(false);

    function updateSubmitting(value: boolean) {
        submitting.current = value;
        setIsSubmitting(value);
    }

    async function submit(action: () => Promise<void>, fallbackError: string) {
        if (submitting.current) return;
        // eslint-disable-next-line react-hooks/immutability -- The accessor delegates to a React state setter.
        view.error = null;
        updateSubmitting(true);
        try {
            await action();
        } catch (caughtError) {
            view.error = caughtError instanceof Error ? caughtError.message : fallbackError;
        } finally {
            updateSubmitting(false);
        }
    }

    return {
        get isSubmitting() { return isSubmitting; },
        submit,
    };
}
