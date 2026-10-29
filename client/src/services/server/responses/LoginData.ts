import {JsonProperty, Serializable} from 'ts-jackson';
import {OperationResultData} from './OperationResultData';

@Serializable()
export class LoginData extends OperationResultData {
    @JsonProperty('user_id')
    userId: string = '';

    @JsonProperty('user_name')
    userName: string = '';

    public override assert(): void {
        super.assert();
        if (typeof this.userId !== 'string'
            || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(this.userId)
            || typeof this.userName !== 'string' || !this.userName) {
            throw new Error('Invalid login identity.');
        }
    }
}
