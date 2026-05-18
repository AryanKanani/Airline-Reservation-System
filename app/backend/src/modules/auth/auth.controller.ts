import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../shared/errors/app-error';
import { asyncHandler } from '../../shared/utils/async-handler';
import { AuthService, type AuthenticatedRequest, type LoginInput, type RegisterInput } from './auth.service';

const readNonEmptyString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
};

const parseLoginInput = (body: Request['body']): LoginInput => {
  const email = readNonEmptyString(body.email)?.toLowerCase();
  const password = readNonEmptyString(body.password);

  if (!email || !password) {
    throw new AppError(400, 'Email and password are required.');
  }

  return { email, password };
};

const parseRegisterInput = (body: Request['body']): RegisterInput => {
  const firstName = readNonEmptyString(body.firstName ?? body.first_name);
  const lastName = readNonEmptyString(body.lastName ?? body.last_name);
  const passportNumber = readNonEmptyString(body.passportNumber ?? body.passport);
  const nationality = readNonEmptyString(body.nationality);
  const dateOfBirth = readNonEmptyString(body.dateOfBirth ?? body.date_of_birth);
  const email = readNonEmptyString(body.email)?.toLowerCase();
  const password = readNonEmptyString(body.password);
  const gender = readNonEmptyString(body.gender);
  const phone = readNonEmptyString(body.phone);

  if (!firstName || !lastName || !passportNumber || !nationality || !dateOfBirth || !email || !password) {
    throw new AppError(400, 'Missing required registration fields.');
  }

  return {
    email,
    password,
    firstName,
    lastName,
    passportNumber,
    nationality,
    dateOfBirth,
    gender,
    phone,
  };
};

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.register(parseRegisterInput(req.body));
    res.status(201).json(user);
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const session = await AuthService.login(parseLoginInput(req.body));
    res.status(200).json(session);
  });

  static me = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = (req as AuthenticatedRequest).user;

    if (!currentUser) {
      return next(new AppError(401, 'Authentication required.'));
    }

    const profile = await AuthService.getProfile(currentUser.userId);
    res.status(200).json(profile);
  });
}
