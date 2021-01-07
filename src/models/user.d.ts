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
  availability: UserAvailability[];
}

export type UserWithoutPassword = Omit<User, 'password'>;

export interface UserAvailability {
  date: string;
}
