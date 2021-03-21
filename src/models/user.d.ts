import { ObjectID } from 'mongodb';

export interface User {
  _id: ObjectID;
  email: string;
  password: string;
  adminPassword: string;
  admin: boolean;
  name: string;
  birthdate: string;
  gender: '' | 'M' | 'F' | 'O';
  eligible: boolean;
  certified: boolean;
  chief: boolean;
  cohort: '' | 'A' | 'B' | 'R';
}

export type UserWithoutId = Omit<User, '_id'>;
export type UserWithoutPassword = Omit<User, 'password'>;
export type UserOptionalPassword = UserWithoutPassword & { password?: string };
