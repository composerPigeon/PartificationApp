import {JsonProperty, Serializable} from "ts-jackson";
import {RequestBodyBase} from "./RequestBodyBase.ts";

@Serializable()
export class LoginBody extends RequestBodyBase {

    @JsonProperty('user_name')
    userName: string;

    @JsonProperty('password')
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName
        this.password = password
    }
}