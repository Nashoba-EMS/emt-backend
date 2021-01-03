import {
  Handler,
  Callback,
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayEventDefaultAuthorizerContext
} from 'aws-lambda';

export type HTTPRawHandler = Handler<HTTPRawEvent, HTTPRawResult>;

export type HTTPRawCallback = Callback<HTTPRawResult>;

export interface HTTPRawResult {
  message: string;
  data?: any;
}

export type HTTPRawEvent = EventBase<APIGatewayEventDefaultAuthorizerContext>;
export interface EventBase<TAuthorizerContext> {
  body: any;
  headers: { [name: string]: any };
  multiValueHeaders: { [name: string]: any };
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: { [name: string]: string } | null;
  queryStringParameters: { [name: string]: string } | null;
  multiValueQueryStringParameters: { [name: string]: string[] } | null;
  stageVariables: { [name: string]: string } | null;
  requestContext: APIGatewayEventRequestContextWithAuthorizer<TAuthorizerContext>;
}
