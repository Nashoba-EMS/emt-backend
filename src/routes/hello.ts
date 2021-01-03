import middyfy from '../middleware';

import { HTTPRawHandler } from './handler';

const _handler: HTTPRawHandler = async (event) => {
  console.log('pathParameters', event.pathParameters);
  console.log('queryStringParameters', event.queryStringParameters);
  console.log('body', event.body);

  return {
    message: 'Hello World'
  };
};

export const handler = middyfy(_handler, {
  authorized: false,
  useMongo: false
});
