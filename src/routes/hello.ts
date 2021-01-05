import middyfy from '../middleware';
import { HTTPRawHandler } from './handler';

/**
 * Check if server is alive
 */
const _handler: HTTPRawHandler<{}, {}, {}, any> = async (event) => {
  console.log('pathParameters', event.pathParameters);
  console.log('queryStringParameters', event.queryStringParameters);
  console.log('body', event.body);

  return {
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
    body: event.body
  };
};

export const handler = middyfy(_handler, {
  authorized: false,
  useMongo: false
});
