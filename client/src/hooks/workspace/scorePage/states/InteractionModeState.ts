import type {KonvaEventObject} from 'konva/lib/Node';

export type InteractionMode = 'select' | 'add-staff' | 'edit-staff';

export interface InteractionModeTarget {
    hasName(name: string): boolean;
}

export interface InteractionModeState {
    get mode(): InteractionMode;
    set mode(value: InteractionMode);
    get cursor(): string;

    onClick(event: KonvaEventObject<MouseEvent>): void;
    onMouseMove(event: KonvaEventObject<MouseEvent>): void;
    onMouseLeave(): void;
    onDragStart(event: KonvaEventObject<MouseEvent>): void;
    onDragEnd(event: KonvaEventObject<MouseEvent>): void;

    modeFor(target: InteractionModeTarget | null, dragging?: boolean): InteractionMode;
}
