import {useState, type ReactNode} from 'react';
import {AuthContext} from '../hooks/auth/useAuth';
import {authService} from '../services';

export function AuthProvider({children}: {children: ReactNode}) {
    const [{currentAccount}, setAuthState] = useState(() => ({currentAccount: authService.currentAccount}));

    function addAccount(userId: string, userName: string) {
        authService.addAccount(userId, userName);
        setAuthState({currentAccount: authService.currentAccount});
    }

    function setCurrent(userId: string) {
        authService.setCurrent(userId);
        setAuthState({currentAccount: authService.currentAccount});
    }

    function authenticate(userId: string) {
        authService.authenticate(userId);
        setAuthState({currentAccount: authService.currentAccount});
    }

    function revoke(userId: string) {
        authService.revoke(userId);
        setAuthState({currentAccount: authService.currentAccount});
    }

    return (
        <AuthContext.Provider value={{currentAccount, accounts: authService.accounts, addAccount, setCurrent, authenticate, revoke}}>
            {children}
        </AuthContext.Provider>
    );
}
