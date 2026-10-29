import {Account} from '../../domain/Account';
import type {RootMetadata} from "../../domain/metadata/RootMetadata.ts";

export interface IAuthorisationService {
    readonly currentAccount: Account | null;
    readonly accounts: readonly Account[];
    addAccount(userId: string, userName: string): void;
    setCurrent(userId: string): void;
    authenticate(userId: string): void;
    revoke(userId: string): void;
}

export class AuthorisationService implements IAuthorisationService {
    private readonly _accounts: Account[];
    private _current: Account | null = null;
    private readonly _guest: Account;

    private constructor(accounts: Account[], guest: Account) {
        this._accounts = accounts;
        this._current = guest;
        this._guest = guest;
    }

    get currentAccount(): Account | null {
        return this._current;
    }

    get accounts(): readonly Account[] {
        return [this._guest, ...this._accounts.filter(account => account.userId !== this._guest.userId)];
    }

    setCurrent(userId: string): void {
        const account = this.getAccountById(userId);
        if (!account) throw new Error(`Unknown account ${userId}.`);
        this._current = account;
    }

    private getAccountById(userId: string): Account | undefined {
        if (this._guest.userId === userId) return this._guest;
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
        this._current = account;
    }

    revoke(userId: string): void {
        const account = this.getAccountById(userId);
        if (account) account.isAuthenticated = false;
        if (this._current?.userId === userId) {
            this._current = null;
        }
    }

    public static fromMetadata(metadata: RootMetadata): AuthorisationService {
        return new AuthorisationService(
            metadata.accounts,
            metadata.guest
        )
    }

    public static create(guest: Account) {
        return new AuthorisationService(
            [],
            guest,
        )
    }
}
