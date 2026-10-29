import {JsonProperty, Serializable} from "ts-jackson";

@Serializable()
export class Account {
    @JsonProperty({path: "user_id"})
    readonly userId: string;

    @JsonProperty({path: "user_name"})
    userName: string;

    @JsonProperty({path: "is_authenticated"})
    isAuthenticated: boolean;

    constructor(userId: string, userName: string, isAuthenticated: boolean) {
        this.userId = userId;
        this.userName = userName;
        this.isAuthenticated = isAuthenticated;
    }
}
