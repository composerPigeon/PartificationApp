import {createContext, useContext} from 'react';
import type {SubmittingState} from './states/SubmittingState';

export const SubmittingContext = createContext<SubmittingState | undefined>(undefined);

export function useSubmitting(): SubmittingState {
    const state = useContext(SubmittingContext);
    if (!state) throw new Error('useSubmitting must be used within FormProvider.');
    return state;
}
