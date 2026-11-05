import type {Account} from '../../../domain';

export interface AuthState {
    currentAccount: Account | null;
    accounts: readonly Account[];
    addAccount(userId: string, userName: string): void;
    setCurrent(userId: string): void;
    authenticate(userId: string): void;
    revoke(userId: string): void;
}
