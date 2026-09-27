import {LoginBody} from "./LoginBody.ts";
import {JsonProperty, Serializable} from "ts-jackson";

@Serializable()
export class SignupBody extends LoginBody {
    @JsonProperty('first_name')
    firstName: string;

    @JsonProperty('last_name')
    lastName: string;

    constructor(email: string, password: string, firstName: string, lastName: string) {
        super(email, password);
        this.firstName = firstName;
        this.lastName = lastName;
    }
}