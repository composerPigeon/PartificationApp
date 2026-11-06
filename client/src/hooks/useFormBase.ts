import {useRef, useState} from 'react';
import type {FormBaseState} from './states';
import {useBaseState} from './useBaseState.ts';

interface FormState extends FormBaseState {
    get isIncomplete(): boolean;
    set isIncomplete(value: boolean);
    submit: (action: () => Promise<void>, fallbackError: string) => Promise<void>;
}

export function useFormBase(): FormState {
    // Derived by the owning form on each render; updating it needs no extra render.
    let isIncomplete = false;
    const base = useBaseState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitting = useRef(false);

    function updateSubmitting(value: boolean) {
        submitting.current = value;
        setIsSubmitting(value);
    }

    async function submit(action: () => Promise<void>, fallbackError: string) {
        if (submitting.current) return;
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

    return base.extend({
        get isSubmitting() { return isSubmitting; },
        set isSubmitting(value: boolean) { updateSubmitting(value); },
        get isIncomplete() { return isIncomplete; },
        set isIncomplete(value: boolean) { isIncomplete = value; },
        submit,
    });
}
