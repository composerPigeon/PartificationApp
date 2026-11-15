import {createContext, useContext} from 'react';
import type {ExportState} from './states/ExportState';

export const ExportContext = createContext<ExportState | undefined>(undefined);

export function useExport(): ExportState {
    const state = useContext(ExportContext);
    if (!state) throw new Error('useExport must be used within ExportProvider.');
    return state;
}
