import { db } from '../middleware/mongoConnector';
import { User } from './user.d';

/**
 * Get a user that matches the given email.
 *
 * Defaults to excluding the password hash.
 */
export const getUser = async (
  email: string,
  projection:
    | {
        [P in keyof User]?: any;
      }
    | null = {
    password: 0
  }
) => {
  try {
    const collection = db?.collection<User>('users');

    const res = await collection?.findOne(
      {
        email
      },
      {
        projection: projection ?? undefined
      }
    );

    return res ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
