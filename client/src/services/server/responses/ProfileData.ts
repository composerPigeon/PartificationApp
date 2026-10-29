import {JsonProperty, Serializable} from "ts-jackson";
import {OperationResultData} from "./OperationResultData.ts";

@Serializable()
export class ProfileData extends OperationResultData {
    @JsonProperty('user_id')
    userId?: string;

    @JsonProperty('user_name')
    userName?: string;

    @JsonProperty('email')
    email?: string

    @JsonProperty({path: 'created_at', type: Date})
    createdAt?: Date
}
