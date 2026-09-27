import {JsonProperty, Serializable} from "ts-jackson";

@Serializable()
export class OperationResultData {
    @JsonProperty('ok')
    ok?: boolean;

    @JsonProperty("error")
    error?: string;

    public assert(): void {
        if (!this.ok) {
            const finalMessage = this.error ?? "Unknown error occurred.";
            throw new Error(finalMessage)
        }
    }
}

export function isRecord(value: any): value is Record<string, any> {
    return (typeof value === 'object' && value !== null && value !== undefined && !Array.isArray(value))
}