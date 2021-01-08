import httpErrors from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const BEARER_OFFSET = 7;
const SALT_ROUNDS = 10;

export interface TokenPayload {
  email: string;
}

/**
 * Hash a given password for storing in the database
 */
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Validate a given hash matches a given password
 */
export const validatePassword = async (hash: string, password: string) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a random password
 */
export const generateRandomPassword = (len = 6) => {
  return ([...Array(len)].map(() => (~~(Math.random() * 36)).toString(36)).join('') + new Array(len + 1).join('0')) // Safety in case string is too short
    .replace(/[^a-z0-9]+/g, '')
    .substr(0, len)
    .toUpperCase();
};

/**
 * Extract a Bearer Token from Authorization header
 */
export const extractToken = (bearer: string): string => {
  return bearer.substring(BEARER_OFFSET);
};

/**
 * Generate a JWT for the given email
 */
export const generateToken = (email: string): string => {
  if (!process.env.AUTH_SECRET) {
    throw new httpErrors.InternalServerError('Secrets not set');
  }

  return jwt.sign(
    {
      email
    },
    process.env.AUTH_SECRET,
    {
      expiresIn: '60d'
    }
  );
};

/**
 * Decode a given JWT
 */
export const verifyAndDecodeToken = (token: string): string | null => {
  if (!process.env.AUTH_SECRET) {
    throw new httpErrors.InternalServerError('Secrets not set');
  }

  try {
    return (jwt.verify(token, process.env.AUTH_SECRET) as TokenPayload).email;
  } catch (err) {
    return null;
  }
};

/**
 * Check if a given object is "empty-ish"
 */
export const isEmpty = (obj: any): boolean => {
  if (obj === undefined || obj === null) return true;
  if (obj.constructor !== Object) return false;

  for (const _ in obj) {
    return false;
  }

  return true;
};
