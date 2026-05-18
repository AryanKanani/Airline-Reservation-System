import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../shared/errors/app-error';
import { AuthService, type AuthenticatedRequest } from '../modules/auth/auth.service';

const extractToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    return next(new AppError(401, 'Missing bearer token.'));
  }

  try {
    (req as AuthenticatedRequest).user = AuthService.verifyToken(token);
    return next();
  } catch (error) {
    return next(error);
  }
};

export const authorize =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const currentUser = (req as AuthenticatedRequest).user;

    if (!currentUser) {
      return next(new AppError(401, 'Authentication required.'));
    }

    if (!roles.includes(currentUser.role)) {
      return next(new AppError(403, 'You do not have permission to access this resource.'));
    }

    return next();
  };
