import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma_client';
import { CreateGroupBody } from '../schemas/groups.schema';
import { AppError } from '../utils/AppError';
import { logger } from '../helpers/logger';

export const createGroup = async (
  req: Request<object, object, CreateGroupBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { name } = req.body;

    const existingGroup = await prisma.group.findUnique({
      where: { name },
    });

    if (existingGroup) {
      throw new AppError(
        `Ya existe un grupo con el nombre "${name}".`,
        400,
        'GROUP_ALREADY_EXISTS',
        `Intento de creación de grupo fallido - Nombre de grupo duplicado ${name} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.group.create({
      data: { name },
    });

    logger.info(
      `Grupo "${name}" creado exitosamente (Creado por: ${user?.username || 'Unknown'})`,
    );

    res.status(201).json({
      error: null,
      message: 'Grupo creado exitosamente.',
    });
  } catch (error) {
    next(error);
  }
};
