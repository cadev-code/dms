import type { Request, Response, NextFunction } from 'express';
import prisma from '../prisma_client';
import { AppError } from '../utils/AppError';
import { compareEncryptedPassword } from '../helpers/compareEncryptedPassword';
import jwt from 'jsonwebtoken';
import { logger } from '../helpers/logger';
import { LoginBody } from '../schemas/auth.schema';

export const login = async (
  req: Request<object, object, LoginBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new AppError(
        'Credenciales inválidas',
        404,
        'USER_NOT_FOUND',
        `Intento de autenticación fallido - El nombre de usuario '${username}' no existe`,
      );
    }

    const isPasswordValid = await compareEncryptedPassword(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new AppError(
        'Credenciales inválidas',
        401,
        'INVALID_CREDENTIALS',
        `Intento de autenticación fallido - Contraseña incorrecta para el usuario '${username}'`,
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
      },
      process.env.JWT_SECRET || 'default_secret',
      {
        expiresIn: '30m', // 30 minutos
      },
    );

    logger.info(`Usuario autenticado exitosamente - User: ${username}`);

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 30, // 30 minutos
      })
      .json({
        userId: user.id,
      });
  } catch (error) {
    next(error);
  }
};
