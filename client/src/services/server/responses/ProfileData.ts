import {JsonProperty, Serializable} from "ts-jackson";
import {OperationResultData} from "./OperationResultData.ts";

@Serializable()
export class ProfileData extends OperationResultData {
    @JsonProperty('first_name')
    firstName?: string;

    @JsonProperty('last_name')
    lastName?: string

    @JsonProperty('email')
    email?: string

    @JsonProperty({path: 'created_at', type: Date})
    createdAt?: Date
}
