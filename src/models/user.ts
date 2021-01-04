import { db } from '../middleware/mongoConnector';
import { User } from './user.d';

/**
 * Get the User collection from Mongo
 */
const userCollection = () => db?.collection<User>('users');

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
    const res = await userCollection()?.findOne(
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

/**
 * Create a new user
 */
export const createUser = async (user: Omit<User, '_id'>) => {
  try {
    const res = await userCollection()?.insertOne(user);

    return res?.ops[0] ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Update a given user if they exist
 */
export const updateUser = async (
  email: string,
  changes: Partial<User>,
  projection:
    | {
        [P in keyof User]?: any;
      }
    | null = {
    password: 0
  }
) => {
  try {
    const res = await userCollection()?.findOneAndUpdate(
      {
        email
      },
      {
        $set: changes
      },
      {
        returnOriginal: false,
        projection: projection ?? undefined
      }
    );

    return res?.value ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Delete a given user if they exist
 */
export const deleteUser = async (email: string) => {
  try {
    await userCollection()?.deleteOne({
      email
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
