export interface IAuthorisationService {
    readonly isAuthenticated: boolean;
    readonly userName: string;
    authenticate(userName: string): void;
    revoke(): void;
}

export class AuthorisationService implements IAuthorisationService {
    private _userName = '';
    private _isAuthenticated = false;

    get userName(): string {
        return this._userName;
    }

    get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    authenticate(userName: string): void {
        this._userName = userName;
        this._isAuthenticated = true;
    }

    revoke(): void {
        this._userName = '';
        this._isAuthenticated = false;
    }
}

