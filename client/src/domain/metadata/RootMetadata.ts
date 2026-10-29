import {Account} from "../Account.ts";
import {JsonProperty, Serializable} from "ts-jackson";

@Serializable()
export class RootMetadata {
    @JsonProperty({type: Account})
    guest: Account

    @JsonProperty({type: Array, elementType: Account})
    accounts: Account[]

    public constructor(guest: Account, accounts: Account[]) {
        this.guest = guest;
        this.accounts = accounts;
    }
}
