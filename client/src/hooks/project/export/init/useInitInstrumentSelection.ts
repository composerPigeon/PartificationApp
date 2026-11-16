import {useState} from 'react';

export function useInitInstrumentSelection() {
    const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());
    const [draftIds, setDraftIds] = useState<ReadonlySet<string>>(() => new Set());
    const hasChanges = draftIds.size !== selectedIds.size || [...draftIds].some(id => !selectedIds.has(id));
    return {
        selectedIds,
        draftIds,
        hasChanges,
        isSelected(id: string) { return draftIds.has(id); },
        confirm() {
            if (draftIds.size && hasChanges) setSelectedIds(new Set(draftIds));
        },
        reset() {
            setDraftIds(new Set(selectedIds));
        },
        select(instrumentIds: readonly string[]) {
            const next = new Set(instrumentIds);
            setDraftIds(next);
            setSelectedIds(current => current.size === next.size && [...next].every(id => current.has(id)) ? current : next);
        },
        toggle(id: string, selected: boolean) {
            setDraftIds(current => {
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
