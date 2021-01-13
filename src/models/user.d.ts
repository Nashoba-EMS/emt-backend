import { ObjectID } from 'mongodb';

export interface User {
  _id: ObjectID;
  email: string;
  password: string;
  admin: boolean;
  name: string;
  birthdate: string;
  eligible: boolean;
  certified: boolean;
  chief: boolean;
  availability: UserAvailability[];
}

export type UserWithoutId = Omit<User, '_id'>;
export type UserWithoutPassword = Omit<User, 'password'>;
export type UserOptionalPassword = UserWithoutPassword & { password?: string };

export interface UserAvailability {
  date: string;
}
