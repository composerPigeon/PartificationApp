import type {ViewState} from '../states';
import {useState} from 'react';

export function useInitViewState(): ViewState {
    const [error, setError] = useState<string | null>(null);
    const [, setRevision] = useState(0);
    return {
        get error() { return error; },
        set error(value: string | null) { setError(value); },
        refresh() { setRevision(value => value + 1); },
    };
}
