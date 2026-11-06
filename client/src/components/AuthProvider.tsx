import type {ReactNode} from 'react';
import {AuthContext, useInitAuthState} from '../hooks/auth';

export function AuthProvider({children}: {children: ReactNode}) {
    const state = useInitAuthState();

    return (
        <AuthContext.Provider value={state}>
            {children}
        </AuthContext.Provider>
    );
}
