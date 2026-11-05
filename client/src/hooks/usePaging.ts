import {useState} from 'react';
import {useBaseState} from './useBaseState.ts';
import type {PagingState} from './states/PagingState.ts';

// Navigation for any paged content. Page indexes are zero-based, including empty content.
export function usePaging(initialPageCount = 0): PagingState {
    function normalizeCount(value: number): number {
        return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    }

    const base = useBaseState();
    const [index, setIndex] = useState(0);
    const [count, setCount] = useState(() => normalizeCount(initialPageCount));

    function clamp(index: number): number {
        if (!Number.isFinite(index)) return 0;
        return Math.max(0, Math.min(Math.floor(index), Math.max(0, count - 1)));
    }

    return base.extend({
        get pageIndex() { return index; },

        get pageCount() { return count; },
        set pageCount(value: number) {
            setCount(normalizeCount(value));
            setIndex(0);
        },

        previous() {
            setIndex(current => clamp(current - 1));
        },
        next() {
            setIndex(current => clamp(current + 1));
        },
        reset() { setIndex(0); },
    });
}
