export class Account {
    readonly userId: string;
    userName: string;
    isAuthenticated: boolean;

    constructor(userId: string, userName: string, isAuthenticated: boolean) {
        this.userId = userId;
        this.userName = userName;
        this.isAuthenticated = isAuthenticated;
    }
}
