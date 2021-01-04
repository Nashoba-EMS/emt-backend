import { Handler, Callback } from 'aws-lambda';
import { User } from '../models/user.d';

export type HTTPRawHandler = Handler<HTTPUnauthorizedEvent | HTTPAuthorizedEvent, HTTPRawResult>;

export type HTTPRawCallback = Callback<HTTPRawResult>;

export interface HTTPRawResult {
  message: string;
  data?: any;
}

export type HTTPUnknownEvent = HTTPUnauthorizedEvent | HTTPAuthorizedEvent;

export type HTTPUnauthorizedEvent = EventBase<{
  authorized: false;
  user: null;
}>;

export type HTTPAuthorizedEvent = EventBase<{
  authorized: true;
  user: User;
}>;

export interface EventBase<MiddlewarePayload> {
  body: any;
  headers: { [name: string]: any };
  multiValueHeaders: { [name: string]: any };
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: { [name: string]: string } | null;
  queryStringParameters: { [name: string]: string } | null;
  multiValueQueryStringParameters: { [name: string]: string[] } | null;

  middleware: MiddlewarePayload;
}
