import httpErrors from 'http-errors';

import middyfy from '../../middleware';
import { HTTPRawHandler } from '../handler';

import { getAllUsers } from '../../models/user';
import { User } from '../../models/user.d';

/**
 * Get a list of all users
 */
const _handler: HTTPRawHandler<
  {},
  {},
  {},
  {
    users: Omit<User, 'password'>[];
  }
> = async (event) => {
  if (!event.middleware.authorized) {
    throw new httpErrors.Unauthorized('Not authorized');
  }

  const users = await getAllUsers();

  if (!users) {
    throw new httpErrors.InternalServerError('Could not get users');
  }

  return {
    message: 'Success',
    data: {
      users
    }
  };
};

export const handler = middyfy(_handler, {
  authorized: true,
  useMongo: true
});
