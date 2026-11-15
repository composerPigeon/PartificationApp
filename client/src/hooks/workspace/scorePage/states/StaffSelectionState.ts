import type {KonvaEventObject} from 'konva/lib/Node';

export interface StaffSelectionState {
    get staffIds(): ReadonlySet<number>;
    get hasSelection(): boolean;

    isSelected(id: number): boolean;
    select(id: number, additive?: boolean): void;
    clear(id?: number): void;
    onClick(event: KonvaEventObject<MouseEvent>): void;
}
