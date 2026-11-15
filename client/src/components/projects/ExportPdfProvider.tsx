import type {PropsWithChildren} from 'react';
import {useExportPreview} from '../../hooks/project/export';
import {ExportPdfContext} from '../../hooks/project/export/pdf/useExportPdf';
import {useInitExportPdf} from '../../hooks/project/export/pdf/init/useInitExportPdf';

export function ExportPdfProvider({children}: PropsWithChildren) {
    const {pdf} = useExportPreview();
    const state = useInitExportPdf(pdf);
    return <ExportPdfContext.Provider value={state}>{children}</ExportPdfContext.Provider>;
}
