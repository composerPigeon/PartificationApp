import {useState} from 'react';

export function useInitInstrumentSelection() {
    const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());
    return {
        selectedIds,
        isSelected(id: string) { return selectedIds.has(id); },
        toggle(id: string, selected: boolean) {
            setSelectedIds(current => {
                if (current.has(id) === selected) return current;
                const next = new Set(current);
                if (selected) next.add(id);
                else next.delete(id);
                return next;
            });
        },
    };
}
export type InstrumentSelectionState = ReturnType<typeof useInitInstrumentSelection>;
