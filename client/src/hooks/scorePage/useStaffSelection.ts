import {useState} from 'react';
import type {ScorePage} from '../../domain';
import {useBaseState} from '..';
import type {StaffSelectionState} from './states/StaffSelectionState';

// Owns the selected staff and resets selection when the displayed page changes.
export function useStaffSelection(page?: ScorePage): StaffSelectionState {
    const base = useBaseState();
    const [staffId, setStaffId] = useState<number | null>(null);
    const [selectedPage, setSelectedPage] = useState(page);

    if (selectedPage !== page) {
        setSelectedPage(page);
        setStaffId(null);
    }

    const selection = base.extend({
        get staffId() { return staffId; },
        set staffId(value: number | null) { setStaffId(value); },
        get hasSelection() { return staffId !== null; },
        isSelected(id: number) { return staffId === id; },
        toggle(id: number) { setStaffId(current => current === id ? null : id); },
        clear(id?: number) {
            setStaffId(current => id === undefined || current === id ? null : current);
        },
    });
    return selection;
}
