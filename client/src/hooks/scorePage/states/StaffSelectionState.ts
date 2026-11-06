import type {BaseState} from '../../states';

export interface StaffSelectionState extends BaseState {
    get staffIds(): ReadonlySet<number>;
    get hasSelection(): boolean;

    isSelected(id: number): boolean;
    select(id: number, additive?: boolean): void;
    clear(id?: number): void;
}
