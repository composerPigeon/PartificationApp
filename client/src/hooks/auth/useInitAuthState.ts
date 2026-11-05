import {useState} from 'react';
import type {AuthState} from './states/AuthState.ts';
import {authService} from '../../services';

// Creates auth state and actions; called only by AuthProvider.
export function useInitAuthState(): AuthState {
    const [{currentAccount}, setAuthState] = useState(() => ({currentAccount: authService.currentAccount}));

    function update(action: () => void) {
        action();
        setAuthState({currentAccount: authService.currentAccount});
    }

    return {
        currentAccount,
        accounts: authService.accounts,
        addAccount(userId: string, userName: string) {
            update(() => authService.addAccount(userId, userName));
        },
        setCurrent(userId: string) {
            update(() => authService.setCurrent(userId));
        },
        authenticate(userId: string) {
            update(() => authService.authenticate(userId));
        },
        revoke(userId: string) {
            update(() => authService.revoke(userId));
        },
    };
}
