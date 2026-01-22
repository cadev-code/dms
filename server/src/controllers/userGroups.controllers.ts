import { NextFunction, Request, Response } from 'express';
import {
  AddUserToGroupBody,
  getGroupMembersSchema,
  removeUserFromGroupSchema,
} from '../schemas/userGroups.schema';
import prisma from '../prisma_client';
import { AppError } from '../utils/AppError';
import { logger } from '../helpers/logger';

export const getGroupMembers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    const { groupId } = getGroupMembersSchema.parse(req.params);

    const members = await prisma.userGroup.findMany({
      where: {
        groupId,
      },
    });

    logger.info(
      `Miembros del grupo ${groupId} obtenidos exitosamente (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.status(200).json({
      error: null,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

export const addUserToGroup = async (
  req: Request<object, object, AddUserToGroupBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    const { userId, groupId } = req.body;

    const existingRelation = await prisma.userGroup.findFirst({
      where: {
        userId,
        groupId,
      },
    });

    if (existingRelation) {
      throw new AppError(
        'El usuario ya pertenece a este grupo.',
        400,
        'USER_ALREADY_IN_GROUP',
        `Intento de agregar usuario a grupo fallido - Usuario ${userId}, Grupo ID: ${groupId} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.userGroup.create({
      data: {
        userId,
        groupId,
      },
    });

    logger.info(
      `Usuario ${userId} agregado al grupo ${groupId} exitosamente (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.status(201).json({
      error: null,
      message: 'Usuario agregado al grupo exitosamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const removeUserFromGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    const { groupId, userId } = removeUserFromGroupSchema.parse(req.params);

    const existingRelation = await prisma.userGroup.findFirst({
      where: {
        userId,
        groupId,
      },
    });

    if (!existingRelation) {
      throw new AppError(
        'El usuario no pertenece a este grupo.',
        400,
        'USER_NOT_IN_GROUP',
        `Intento de remover usuario de grupo fallido - Usuario ${userId}, Grupo ID: ${groupId} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.userGroup.deleteMany({
      where: {
        userId,
        groupId,
      },
    });

    logger.info(
      `Usuario ${userId} removido del grupo ${groupId} exitosamente (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.status(200).json({
      error: null,
      message: 'Usuario removido del grupo exitosamente.',
    });
  } catch (error) {
    next(error);
  }
};
