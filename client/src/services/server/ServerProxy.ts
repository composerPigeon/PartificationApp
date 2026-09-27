import {OperationResultData, ProfileData, isRecord} from "./responses";
import {LoginBody, SignupBody, RequestBodyBase} from "./requests";
import {deserialize} from "ts-jackson";

export interface IServerProxy {
  getFullAddress(relativeUrl: string): string

  executeLogin(email: string, password: string): Promise<OperationResultData>

  executeSignup(email: string, password: string, firstName: string, lastName: string): Promise<OperationResultData>

  getProfile(): Promise<ProfileData>
}

export class ServerProxy implements IServerProxy {
  getFullAddress(relativeUrl: string): string {
    relativeUrl = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`
    return `${relativeUrl}`
  }

  getHeadersForRequest(): any {
    return {'Content-Type': 'application/json'}
  }

  private executeGet(relativeUrl: string, credentials: boolean = false): Promise<Response> {
    const endpointUrl = this.getFullAddress(relativeUrl);
    const headers = this.getHeadersForRequest();

    return fetch(endpointUrl, {
      method: 'GET',
      headers: headers,
      credentials: (credentials) ? 'include' : undefined,
    })
  }

  private executePost(relativeUrl: string, body: RequestBodyBase | undefined = undefined, credentials: boolean = false): Promise<Response> {
    const endpointUrl = this.getFullAddress(relativeUrl);
    const headers = this.getHeadersForRequest();

    return fetch(endpointUrl, {
      method: 'POST',
      headers: headers,
      body: (body !== undefined) ? body.stringify() : undefined,
      credentials: (credentials) ? 'include' : undefined,
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
    }
    catch (error) {
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
    }
    catch (error) {
      throw new Error(`Unable to parse response: ${error}`);
    }
  }

  async executeLogin(email: string, password: string): Promise<OperationResultData> {
    const response = await this.executePost(
        '/auth/login',
        new LoginBody(email, password),
    )

    let jsonResponse = await this.parseResponse(response)
    return this.parseResult(jsonResponse)
  }

  async executeSignup(email: string, password: string, firstName: string, lastName: string): Promise<OperationResultData> {
    const response = await this.executePost(
        '/auth/signup',
        new SignupBody(email, password, firstName, lastName),
    )

    let jsonResponse = await this.parseResponse(response)
    return this.parseResult(jsonResponse)
  }

  async getProfile(): Promise<ProfileData> {
    const response = await this.executeGet(
        '/settings/profile',
        true
    )

    let jsonResponse = await this.parseResponse(response)
    return this.parseData(jsonResponse, (data: Record<string, any>) => deserialize(data, ProfileData));
  }
}
