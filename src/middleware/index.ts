import { ShallotAWS } from 'shallot';
import { ShallotAWSHttpJsonBodyParser } from '@shallot/http-json-body-parser';
import { ShallotAWSHttpErrorHandler } from '@shallot/http-error-handler';
import urlEncodeBodyParser from '@middy/http-urlencode-body-parser';
import { ShallotAWSHttpCors } from '@shallot/http-cors';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import oc from 'js-optchain';
import { Callback, Context } from 'aws-lambda';

import * as auth from '../utils/auth';
import { HTTPRawHandler, HTTPRawResult, HTTPUnknownEvent } from '../routes/handler';
import { getUser } from '../models/user';
import mongoConnector from './mongoConnector';

/**
 * Wrap the handler to have proper response type
 */
const wrappedHandler = (handler: HTTPRawHandler) => async (
  event: HTTPUnknownEvent,
  context: Context,
  callback: Callback<HTTPRawResult>
) => {
  const res = await handler(event, context, callback);

  return {
    statusCode: 200,
    body: JSON.stringify(res)
  };
};

/**
 * Attempt to authorize the handler
 */
const httpHeaderAuthorizer = () => ({
  before: async (handler: { event: HTTPUnknownEvent }) => {
    handler.event.middleware = {
      authorized: false,
      override: false,
      user: null
    };

    if (oc(handler.event.headers, { Authorization: '' }).Authorization.startsWith('Bearer')) {
      const token = auth.extractToken(handler.event.headers.Authorization);
      const email = auth.verifyAndDecodeToken(token);

      if (email) {
        const user = await getUser(email);

        if (user) {
          handler.event.middleware = {
            authorized: true,
            override: false,
            user
          };

          console.log('Signed in', handler.event.middleware.user);
        } else {
          console.log('Failed sign in', email);
        }
      } else {
        console.log('Failed sign in no email');

        if (token === process.env.ADMIN_SECRET) {
          handler.event.middleware = {
            authorized: false,
            override: true,
            user: null
          };

          console.log('Sign in override');
        }
      }
    }

    return;
  }
});

/**
 * Trim query string params
 */
const queryTrimmer = () => ({
  before: (handler) => {
    const params = Object.entries(handler.event.queryStringParameters || []);

    for (const [key, value] of params) {
      if (typeof value === 'string') {
        handler.event.queryStringParameters[key] = value.trim();
      }
    }
  }
});

/**
 * Automatically handle errors thrown by the handler
 */
const errorHandler = () => ({
  onError: (handler, next) => {
    if (handler.error.statusCode && handler.error.message) {
      console.error(handler.error);

      handler.response = {
        statusCode: handler.error.statusCode,
        body: JSON.stringify({
          error: {
            message: handler.error.message,
            details: handler.error.details
          }
        })
      };

      return;
    }

    return handler.error;
  }
});

/**
 * Wrap the handler with middleware
 */
const middyfy = (handler: HTTPRawHandler<any, any, any, any>, config = { authorized: true, useMongo: true }) => {
  // @ts-ignore
  const middleware = ShallotAWS(wrappedHandler(handler));

  if (config.authorized || config.useMongo) {
    middleware.use(
      mongoConnector({
        databaseURI: process.env.MONGODB_URI
      })
    );
  }

  middleware
    // @ts-ignore
    .use(queryTrimmer())
    // @ts-ignore
    .use(ShallotAWSHttpJsonBodyParser())
    // @ts-ignore
    .use(ShallotAWSHttpCors());
  // @ts-ignore
  // .use(doNotWaitForEmptyEventLoop({ runOnBefore: true, runOnError: true }))
  // @ts-ignore
  // .use(urlEncodeBodyParser({ extended: true }));

  if (config.authorized) {
    middleware.use(httpHeaderAuthorizer());
  }

  // @ts-ignore
  middleware.use(errorHandler());

  return middleware;
};

export default middyfy;
