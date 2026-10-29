import {OperationResultData, ProfileData, LoginData, isRecord} from "./responses";
import {LoginBody, SignupBody, RequestBodyBase} from "./requests";
import {deserialize} from "ts-jackson";

export interface IServerProxy {
    getFullAddress(relativeUrl: string): string

    executeLogin(userName: string, password: string): Promise<LoginData>

    executeSignup(userName: string, email: string, password: string): Promise<OperationResultData>

    getProfile(): Promise<ProfileData>
}

export class ServerProxy implements IServerProxy {
    private csrfToken: Promise<string> | undefined;

    getFullAddress(relativeUrl: string): string {
        relativeUrl = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`
        return `${relativeUrl}`
    }

    getHeadersForRequest(): any {
        return {'Content-Type': 'application/json'}
    }

    private executeGet(relativeUrl: string): Promise<Response> {
        const endpointUrl = this.getFullAddress(relativeUrl);
        const headers = this.getHeadersForRequest();

        return fetch(endpointUrl, {
            method: 'GET',
            headers: headers,
        })
    }

    private async fetchCsrfToken(): Promise<string> {
        const csrfResponse = await this.executeGet('/auth/csrf');
        if (!csrfResponse.ok) {
            throw new Error('Unable to obtain CSRF token.');
        }
        const csrf = await this.parseResponse(csrfResponse);
        if (typeof csrf.csrf_token !== 'string') {
            throw new Error('Invalid CSRF token response.');
        }
        return csrf.csrf_token;
    }

    private async getPostHeaders(): Promise<Record<string, string>> {
        this.csrfToken ??= this.fetchCsrfToken().catch(error => {
            this.csrfToken = undefined;
            throw error;
        });
        return {...this.getHeadersForRequest(), 'X-CSRFToken': await this.csrfToken};
    }

    private async fetchWithCsrf(endpointUrl: string, options: RequestInit, retry: boolean = true): Promise<Response> {
        const headers = await this.getPostHeaders();
        const response = await fetch(endpointUrl, {...options, headers});
        if (response.status === 400 && response.headers.get('X-CSRFError') === '1') {
            this.csrfToken = undefined;
            if (retry) {
                return this.fetchWithCsrf(endpointUrl, options, false);
            }
        }
        return response;
    }

    private executePost(relativeUrl: string, body: RequestBodyBase | undefined = undefined): Promise<Response> {
        const endpointUrl = this.getFullAddress(relativeUrl);

        return this.fetchWithCsrf(endpointUrl, {
            method: 'POST',
            body: (body !== undefined) ? body.stringify() : undefined,
        })
    }

    private async parseResponse(response: Response): Promise<Record<string, any>> {
        let json = await response.json();
        if (!isRecord(json)) {
            throw new Error('Json object is not valid record.')
        }
        return json;
    }

    private parseResult(jsonResponse: Record<string, any>): OperationResultData {
        try {
            let result = deserialize(jsonResponse, OperationResultData);
            result.assert()
            return result;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    private parseData<TData extends OperationResultData>(
        jsonResponse: Record<string, any>,
        parseDataFunction: (data: Record<string, any>) => TData
    ): TData {
        try {
            let data: TData;
            data = parseDataFunction(jsonResponse)
            data.assert()
            return data
        } catch (error) {
            throw new Error(`Unable to parse response: ${error}`);
        }
    }

    async executeLogin(userName: string, password: string): Promise<LoginData> {
        const response = await this.executePost(
            '/auth/login',
            new LoginBody(userName, password),
        )

        let jsonResponse = await this.parseResponse(response)
        return this.parseData(jsonResponse, data => deserialize(data, LoginData));
    }

    async executeSignup(userName: string, email: string, password: string): Promise<OperationResultData> {
        const response = await this.executePost(
            '/auth/signup',
            new SignupBody(userName, email, password),
        )

        let jsonResponse = await this.parseResponse(response)
        return this.parseResult(jsonResponse)
    }

    async getProfile(): Promise<ProfileData> {
        const response = await this.executeGet(
            '/settings/profile',
        )

        let jsonResponse = await this.parseResponse(response)
        return this.parseData(jsonResponse, (data: Record<string, any>) => deserialize(data, ProfileData));
    }
}
