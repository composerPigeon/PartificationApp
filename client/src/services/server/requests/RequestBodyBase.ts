import {serialize} from "ts-jackson";

export class RequestBodyBase {
    stringify(): string {
        return JSON.stringify(serialize(this))
    }
}