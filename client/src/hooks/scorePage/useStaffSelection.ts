import {useState} from 'react';
import type {ScorePage} from '../../domain';
import {useBaseState} from '..';
import type {StaffSelectionState} from './states/StaffSelectionState';

// Owns selected staves and resets selection when the displayed page changes.
export function useStaffSelection(page?: ScorePage): StaffSelectionState {
    const base = useBaseState();
    const [staffIds, setStaffIds] = useState<ReadonlySet<number>>(() => new Set());
    const [selectedPage, setSelectedPage] = useState(page);

    if (selectedPage !== page) {
        setSelectedPage(page);
        setStaffIds(new Set());
    }

    const selection = base.extend({
        get staffIds() { return staffIds; },
        get hasSelection() { return staffIds.size > 0; },
        isSelected(id: number) { return staffIds.has(id); },
        select(id: number, additive = false) {
            setStaffIds(current => {
                if (!additive) return current.size === 1 && current.has(id) ? current : new Set([id]);
                const next = new Set(current);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
        },
        clear(id?: number) {
            setStaffIds(current => {
                if (id === undefined) return current.size ? new Set() : current;
                if (!current.has(id)) return current;
                const next = new Set(current);
                next.delete(id);
                return next;
            });
        },
    });
    return selection;
}
