import {createContext, useContext} from 'react';
import type {ExportPdfState} from './init/useInitExportPdf';

export const ExportPdfContext = createContext<ExportPdfState | undefined>(undefined);

export function useExportPdf(): ExportPdfState {
    const state = useContext(ExportPdfContext);
    if (!state) throw new Error('useExportPdf must be used within ExportPdfProvider.');
    return state;
}
