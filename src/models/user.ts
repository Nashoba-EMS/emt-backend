import { db } from '../middleware/mongoConnector';
import { User } from './user.d';

export const getUser = async (email: string) => {
  try {
    const collection = db?.collection<User>('users');

    const res = await collection?.findOne({
      email
    });

    return res ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
