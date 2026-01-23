import { NextFunction, Request, Response } from 'express';
import {
  AddGroupToFolderBody,
  removeGroupToFolderSchema,
} from '../schemas/groupFolders.schema';
import prisma from '../prisma_client';
import { AppError } from '../utils/AppError';
import { logger } from '../helpers/logger';

export const getFolderPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const folderPermissions = await prisma.folderGroupPermission.findMany();

    logger.info(
      `Permisos de carpetas para grupos recuperados exitosamente (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.json({
      error: null,
      data: folderPermissions,
    });
  } catch (error) {
    next(error);
  }
};

export const addGroupToFolder = async (
  req: Request<object, object, AddGroupToFolderBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { groupId, folderId } = req.body;

    const existingRelation = await prisma.folderGroupPermission.findFirst({
      where: {
        groupId,
        folderId,
      },
    });

    if (existingRelation) {
      throw new AppError(
        'El grupo ya tiene permisos para esta carpeta',
        400,
        'GROUP_ALREADY_HAS_FOLDER_PERMISSION',
        `El grupo ${groupId} ya tiene permisos para la carpeta ${folderId} (Solicitado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.folderGroupPermission.create({
      data: {
        groupId,
        folderId,
      },
    });

    logger.info(
      `Permisos del grupo ${groupId} para la carpeta ${folderId} agregados exitosamente (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.status(201).json({
      error: null,
      message: 'Permisos del grupo para la carpeta agregados exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

export const removeGroupToFolder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { folderId, groupId } = removeGroupToFolderSchema.parse(req.params);

    const existingRelation = await prisma.folderGroupPermission.findFirst({
      where: {
        groupId,
        folderId,
      },
    });

    if (!existingRelation) {
      throw new AppError(
        'El grupo no tiene permisos para esta carpeta',
        404,
        'GROUP_FOLDER_PERMISSION_NOT_FOUND',
        `El grupo ${groupId} no tiene permisos para la carpeta ${folderId} (Solicitado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.folderGroupPermission.deleteMany({
      where: {
        groupId,
        folderId,
      },
    });

    logger.info(
      `Permisos del grupo ${groupId} para la carpeta ${folderId} eliminados exitosamente (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.json({
      error: null,
      message: 'Permisos del grupo para la carpeta eliminados exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
