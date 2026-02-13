import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma_client';
import { AppError } from '../utils/AppError';
import { logger } from '../helpers/logger';
import { GroupBody, groupIdSchema } from '../schemas/groups.schema';

export const getGroups = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const groups = await prisma.group.findMany({
      orderBy: { name: 'asc' },
    });

    logger.info(
      `Grupos recuperados exitosamente (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.status(200).json({
      error: null,
      data: groups,
    });
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (
  req: Request<object, object, GroupBody>,
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

export const updateGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { groupId } = groupIdSchema.parse(req.params);

    const existingGroup = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!existingGroup) {
      throw new AppError(
        `No se encontró un grupo.`,
        404,
        'GROUP_NOT_FOUND',
        `Intento de actualización de grupo fallido - Grupo no encontrado (ID: ${groupId}) (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    const { name } = req.body;

    const duplicateGroup = await prisma.group.findFirst({
      where: {
        name,
        id: { not: groupId },
      },
    });

    if (duplicateGroup) {
      throw new AppError(
        `Ya existe un grupo con el nombre "${name}".`,
        400,
        'GROUP_ALREADY_EXISTS',
        `Intento de actualización de grupo fallido - Nombre de grupo duplicado ${name} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.group.update({
      where: { id: groupId },
      data: { name },
    });

    logger.info(
      `Grupo "${name}" actualizado exitosamente (Actualizado por: ${user?.username || 'Unknown'})`,
    );

    res.status(200).json({
      error: null,
      message: 'Grupo actualizado exitosamente.',
    });
  } catch (error) {
    next(error);
  }
};
