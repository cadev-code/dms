import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma_client';
import { logger } from '../helpers/logger';
import {
  CreateUserBody,
  ResetPasswordBody,
  userIdSchema,
} from '../schemas/users.schema';
import { AppError } from '../utils/AppError';
import { encryptPassword } from '../helpers/encryptPassword';
import { compareEncryptedPassword } from '../helpers/compareEncryptedPassword';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const users = await prisma.user.findMany({
      orderBy: [{ isActive: 'desc' }, { fullname: 'asc' }],
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
    }));

    logger.info(
      `Todos los usuarios obtenidos exitosamente (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.status(200).json({ error: null, data: formattedUsers });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request<object, object, CreateUserBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { fullname, username, role, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new AppError(
        `Ya existe un usuario con el nombre de usuario "${username}".`,
        400,
        'USER_ALREADY_EXISTS',
        `Intento de creación de usuario fallido - Nombre de usuario duplicado ${username} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    const passwordHash = await encryptPassword(password);

    await prisma.user.create({
      data: {
        fullname,
        username,
        role,
        passwordHash,
      },
    });

    logger.info(
      `Usuario "${username}" creado exitosamente (Creado por: ${user?.username || 'Unknown'})`,
    );

    res.status(201).json({
      error: null,
      message: 'Usuario creado exitosamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request<object, object, ResetPasswordBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { userId } = userIdSchema.parse(req.params);

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new AppError(
        `El usuario con ID ${userId} no existe.`,
        404,
        'USER_NOT_FOUND',
        `Intento de restablecimiento de contraseña fallido - Usuario no encontrado (ID: ${userId})`,
      );
    }

    const { password, mustChangePassword } = req.body;

    const isNewPasswordSameAsOld = await compareEncryptedPassword(
      password,
      existingUser.passwordHash,
    );

    if (isNewPasswordSameAsOld) {
      throw new AppError(
        'La nueva contraseña no puede ser igual a la contraseña anterior.',
        400,
        'SAME_PASSWORD_ERROR',
        `Intento de restablecimiento de contraseña fallido - Nueva contraseña igual a la anterior (Usuario: ${existingUser.username || 'Unknown'})`,
      );
    }

    const newPasswordHash = await encryptPassword(password);

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword,
      },
    });

    logger.info(
      `Contraseña del usuario "${existingUser.username}" restablecida exitosamente${mustChangePassword ? ' con cambio obligatorio de contraseña' : ''} (Restablecido por: ${user?.username || 'Unknown'})`,
    );

    res.status(200).json({
      error: null,
      message: 'Se aplico el restablecimiento de contraseña exitosamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const disableUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { userId } = userIdSchema.parse(req.params);

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new AppError(
        `El usuario no existe.`,
        404,
        'USER_NOT_FOUND',
        `Intento de deshabilitar usuario fallido - Usuario no encontrado (ID: ${userId}) (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    if (!existingUser.isActive) {
      throw new AppError(
        `El usuario ya está deshabilitado.`,
        400,
        'USER_ALREADY_DISABLED',
        `Intento de deshabilitar usuario fallido - Usuario ya deshabilitado: ${existingUser.username} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { isActive: false, disableAt: new Date() },
    });

    logger.info(
      `Usuario "${existingUser.username}" deshabilitado exitosamente (Deshabilitado por: ${user?.username || 'Unknown'})`,
    );

    res.status(200).json({
      error: null,
      message: 'Usuario deshabilitado exitosamente.',
    });
  } catch (error) {
    next(error);
  }
};
