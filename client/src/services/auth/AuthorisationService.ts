import {Account} from '../../domain/Account';

export interface IAuthorisationService {
    readonly currentAccount: Account | null;
    addAccount(userId: string, userName: string): void;
    authenticate(userId: string): void;
    revoke(userId: string): void;
}

export class AuthorisationService implements IAuthorisationService {
    private readonly _accounts: Account[] = [];
    private _currentAccount: Account | null = null;

    get currentAccount(): Account | null {
        return this._currentAccount;
    }

    private getAccountById(userId: string): Account | undefined {
        return this._accounts.find(account => account.userId === userId);
    }

    addAccount(userId: string, userName: string): void {
        const account = this.getAccountById(userId);
        if (account) {
            account.userName = userName;
            return;
        }
        this._accounts.push(new Account(userId, userName, false));
    }

    authenticate(userId: string): void {
        const account = this.getAccountById(userId);
        if (!account) throw new Error(`Unknown account ${userId}.`);
        account.isAuthenticated = true;
        this._currentAccount = account;
    }

    revoke(userId: string): void {
        const account = this.getAccountById(userId);
        if (account) account.isAuthenticated = false;
        if (this._currentAccount?.userId === userId) {
            this._currentAccount = null;
        }
    }
}
