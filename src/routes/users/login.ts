import httpErrors from 'http-errors';

import middyfy from '../../middleware';
import { HTTPRawHandler } from '../handler';

import { getUser } from '../../models/user';
import { UserWithoutPassword } from '../../models/user.d';
import { generateToken, validatePassword } from '../../utils/auth';

/**
 * Login and generate a token and retrieve profile details
 */
const _handler: HTTPRawHandler<
  {
    email: string;
    password: string;
  },
  {},
  {},
  {
    token: string;
    user: UserWithoutPassword;
  }
> = async (event) => {
  const user = await getUser(event.body.email, null);

  if (!user) {
    // No user was found
    throw new httpErrors.NotFound('No user with that email exists');
  }

  // Separate the password to not return it in response
  const { password: passwordHash, ...userWithoutPassword } = user;

  if (!(await validatePassword(passwordHash, event.body.password))) {
    throw new httpErrors.Unauthorized('Password did not match');
  }

  return {
    message: 'Success',
    data: {
      token: generateToken(user.email),
      user: userWithoutPassword
    }
  };
};

export const handler = middyfy(_handler, {
  authorized: false,
  useMongo: true
});
