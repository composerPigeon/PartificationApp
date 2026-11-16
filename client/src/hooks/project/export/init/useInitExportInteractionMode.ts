import {useState} from 'react';
import type {ExportInteractionMode, ExportInteractionModeState} from '../states/ExportInteractionModeState';

export function useInitExportInteractionMode(): ExportInteractionModeState {
    const [mode, setMode] = useState<ExportInteractionMode>('select');
    return {
        get mode() {return mode;},
        set mode(next: ExportInteractionMode) {setMode(next);},
        isSelected(value: ExportInteractionMode) {return mode === value;},
    };
}
