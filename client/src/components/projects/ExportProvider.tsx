import type {PropsWithChildren} from 'react';
import {ExportContext, useInitExport} from '../../hooks/export';

export function ExportProvider({children}: PropsWithChildren) {
    const state = useInitExport();
    return <ExportContext.Provider value={state}>{children}</ExportContext.Provider>;
}
