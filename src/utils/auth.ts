import httpErrors from 'http-errors';
import jwt from 'jsonwebtoken';

const BEARER_OFFSET = 7;

export interface TokenPayload {
  email: string;
}

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
