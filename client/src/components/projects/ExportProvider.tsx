import {ViewContext} from '../../hooks/useView';
import type {PropsWithChildren} from 'react';
import {ExportContext, useInitExport} from '../../hooks/project/export';

export function ExportProvider({children}: PropsWithChildren) {
    const state = useInitExport();
    return <ViewContext.Provider value={state.viewState}>
        <ExportContext.Provider value={state}>{children}</ExportContext.Provider>
    </ViewContext.Provider>;
}
