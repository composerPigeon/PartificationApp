import {JsonProperty, Serializable} from "ts-jackson";
import {RequestBodyBase} from "./RequestBodyBase.ts";

@Serializable()
export class LoginBody extends RequestBodyBase {

    @JsonProperty('email')
    email: string;

    @JsonProperty('password')
    password: string;

    constructor(email: string, password: string) {
        super();
        this.email = email
        this.password = password
    }
}