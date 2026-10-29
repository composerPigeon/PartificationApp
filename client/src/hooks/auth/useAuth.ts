import {createContext, useContext} from 'react';

interface AuthState {
    isAuthenticated: boolean;
    userName: string;
    authenticate(userName: string): void;
    revoke(): void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function useAuth(): AuthState {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('useAuth must be used within AuthProvider.');
    }
    return auth;
}
