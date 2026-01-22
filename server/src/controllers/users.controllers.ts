import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma_client';
import { logger } from '../helpers/logger';
import { CreateUserBody } from '../schemas/users.schema';
import { AppError } from '../utils/AppError';
import { encryptPassword } from '../helpers/encryptPassword';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const users = await prisma.user.findMany({ orderBy: { fullname: 'asc' } });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      role: user.role,
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
