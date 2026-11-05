import type {ReactNode} from 'react';
import {AuthContext} from '../hooks/auth/useAuthState';
import {useInitAuthState} from '../hooks/auth/useInitAuthState';

export function AuthProvider({children}: {children: ReactNode}) {
    const state = useInitAuthState();

    return (
        <AuthContext.Provider value={state}>
            {children}
        </AuthContext.Provider>
    );
}
