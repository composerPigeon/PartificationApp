import type {BaseState} from '../../states';

export interface StaffSelectionState extends BaseState {
    get staffId(): number | null;
    set staffId(value: number | null);
    get hasSelection(): boolean;

    isSelected(id: number): boolean;
    toggle(id: number): void;
    clear(id?: number): void;
}
