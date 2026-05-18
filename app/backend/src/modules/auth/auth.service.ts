import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import type { Request } from 'express';
import { prisma } from '../../shared/lib/prisma';
import { AppError } from '../../shared/errors/app-error';
import { env } from '../../config/env';

const SALT_ROUNDS = 10;
const DEFAULT_ROLE = 'PASSENGER';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  gender?: string | null;
  phone?: string | null;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

type AuthTokenPayload = AuthenticatedUser;

const signToken = (payload: AuthTokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

const parseBirthDate = (value: string): Date => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError(400, 'dateOfBirth must be a valid date.');
  }

  return parsedDate;
};

const sanitizeUser = (user: { id: string; email: string; role: string }) => ({
  id: user.id,
  email: user.email,
  role: user.role,
});

export class AuthService {
  static async register(input: RegisterInput) {
    const [existingUser, existingPassenger] = await Promise.all([
      prisma.user.findUnique({
        where: {
          email: input.email,
        },
      }),
      prisma.passenger.findUnique({
        where: {
          passportNumber: input.passportNumber,
        },
      }),
    ]);

    if (existingUser) {
      throw new AppError(409, 'Email is already registered.');
    }

    if (existingPassenger) {
      throw new AppError(409, 'Passport number is already registered.');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const { user, passenger } = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          role: DEFAULT_ROLE,
        },
      });

      const createdPassenger = await tx.passenger.create({
        data: {
          userId: createdUser.id,
          firstName: input.firstName,
          lastName: input.lastName,
          passportNumber: input.passportNumber,
          nationality: input.nationality,
          dateOfBirth: parseBirthDate(input.dateOfBirth),
          gender: input.gender ?? null,
          phone: input.phone ?? null,
        },
      });

      return {
        user: createdUser,
        passenger: createdPassenger,
      };
    });

    return {
      user: sanitizeUser(user),
      passenger,
      token: signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password.');
    }

    const passenger = await prisma.passenger.findUnique({
      where: {
        userId: user.id,
      },
    });

    return {
      user: sanitizeUser(user),
      passenger,
      token: signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found.');
    }

    const passenger = await prisma.passenger.findUnique({
      where: {
        userId,
      },
    });

    return {
      user: sanitizeUser(user),
      passenger,
    };
  }

  static verifyToken(token: string): AuthenticatedUser {
    try {
      const decodedToken = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;

      if (!decodedToken.userId || !decodedToken.email || !decodedToken.role) {
        throw new AppError(401, 'Invalid authentication token.');
      }

      return decodedToken;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(401, 'Invalid or expired authentication token.');
    }
  }
}
