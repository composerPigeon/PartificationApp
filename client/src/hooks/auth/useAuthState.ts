import {createContext, useContext} from 'react';
import type {AuthState} from './states/AuthState.ts';

export const AuthContext = createContext<AuthState | undefined>(undefined);

// Reads the shared auth state from the nearest AuthProvider.
export function useAuthState(): AuthState {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('useAuthState must be used within AuthProvider.');
    }
    return auth;
}
