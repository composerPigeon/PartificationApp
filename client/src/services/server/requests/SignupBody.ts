import {LoginBody} from "./LoginBody.ts";
import {JsonProperty, Serializable} from "ts-jackson";

@Serializable()
export class SignupBody extends LoginBody {
    @JsonProperty('email')
    email: string;

    constructor(userName: string, email: string, password: string) {
        super(userName, password);
        this.email = email;
    }
}