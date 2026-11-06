import type {BaseState} from './states';
import {useState} from 'react';

export function useBaseState(): BaseState {
    const [error, setError] = useState<string | null>(null);
    const [, setRevision] = useState(0);
    return {
        get error() { return error; },
        set error(value: string | null) { setError(value); },
        refresh() { setRevision(value => value + 1); },
        extend(this: BaseState, fields: object) {
            // Preserve accessors rather than copying their current values.
            return Object.defineProperties(fields, Object.getOwnPropertyDescriptors(this));
        },
    } as BaseState;
}
