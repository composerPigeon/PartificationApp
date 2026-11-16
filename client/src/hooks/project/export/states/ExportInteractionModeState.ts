export type ExportInteractionMode = 'select' | 'settings' | 'exports';

export interface ExportInteractionModeState {
    get mode(): ExportInteractionMode;
    set mode(value: ExportInteractionMode);
    isSelected(value: ExportInteractionMode): boolean;
}
