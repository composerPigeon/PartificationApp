import {useExport} from './useExport';

export function useExportSave() {
    return useExport().saveState;
}
