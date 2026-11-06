import type {BaseState} from '../../states';

export type EditingMode = 'select' | 'add-staff' | 'edit-staff';

export interface EditingTarget {
    hasName(name: string): boolean;
}

export interface EditingModeState extends BaseState {
    get mode(): EditingMode;
    set mode(value: EditingMode);
    get locked(): boolean;

    modeFor(target: EditingTarget | null, dragging?: boolean): EditingMode;
    cursorFor(target: EditingTarget | null, dragging?: boolean, mode?: EditingMode): string;
}
