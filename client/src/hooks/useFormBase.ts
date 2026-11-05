import {useRef, useState} from 'react';
import type {FormBaseState} from './states/FormBaseState.ts';

interface FormState extends FormBaseState {
    get isIncomplete(): boolean;
    set isIncomplete(value: boolean);
    submit: (action: () => Promise<void>, fallbackError: string) => Promise<void>;
    extend: <T extends object>(fields: T) => T & FormBaseState;
}

export function useFormBase(): FormState {
    // Derived by the owning form on each render; updating it needs no extra render.
    let isIncomplete = false;
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitting = useRef(false);

    function updateSubmitting(value: boolean) {
        submitting.current = value;
        setIsSubmitting(value);
    }

    async function submit(action: () => Promise<void>, fallbackError: string) {
        if (submitting.current) return;
        setError(null);
        updateSubmitting(true);
        try {
            await action();
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : fallbackError);
        } finally {
            updateSubmitting(false);
        }
    }

    const state = {
        get error() { return error; },
        set error(value: string | null) { setError(value); },
        get isSubmitting() { return isSubmitting; },
        set isSubmitting(value: boolean) { updateSubmitting(value); },
        get isIncomplete() { return isIncomplete; },
        set isIncomplete(value: boolean) { isIncomplete = value; },
    };

    const descriptors = Object.getOwnPropertyDescriptors(state);
    return Object.assign(state, {
        submit,
        extend<T extends object>(fields: T): T & FormBaseState {
            // Copy descriptors so accessors remain connected to the base hook.
            return Object.defineProperties(fields, descriptors) as T & FormBaseState;
        },
    });
}
