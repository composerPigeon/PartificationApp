import {createContext, useContext} from 'react';
import type {ViewState} from './states';

export const ViewContext = createContext<ViewState | undefined>(undefined);

export function useView(): ViewState {
    const state = useContext(ViewContext);
    if (!state) throw new Error('useView must be used within a view provider.');
    return state;
}
