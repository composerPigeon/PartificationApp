import {createContext, useContext} from 'react';
import type {Account} from '../../domain/Account';

interface AuthState {
    currentAccount: Account | null;
    addAccount(userId: string, userName: string): void;
    authenticate(userId: string): void;
    revoke(userId: string): void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function useAuth(): AuthState {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('useAuth must be used within AuthProvider.');
    }
    return auth;
}
