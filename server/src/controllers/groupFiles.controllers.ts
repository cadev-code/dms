import { NextFunction, Request, Response } from 'express';

import {
  AddGroupToFileBody,
  getFilePermissionsSchema,
  removeGroupToFileSchema,
} from '../schemas/groupFiles.schema';

import prisma from '../prisma_client';
import { AppError } from '../utils/AppError';
import { logger } from '../helpers/logger';

export const getFilePermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { fileId } = getFilePermissionsSchema.parse(req.params);

    const filePermissions = await prisma.fileGroupPermission.findMany({
      where: { fileId },
    });

    logger.info(
      `Permisos de archivos para grupos recuperados exitosamente (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.json({
      error: null,
      data: filePermissions,
    });
  } catch (error) {
    next(error);
  }
};

export const addGroupToFile = async (
  req: Request<object, object, AddGroupToFileBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { groupId, fileId } = req.body;

    const existingFile = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!existingFile) {
      throw new AppError(
        'El archivo no existe',
        404,
        'FILE_NOT_FOUND',
        `El archivo con ID ${fileId} no existe (Solicitado por: ${user?.username || 'Unknown'})`,
      );
    }

    const existingGroup = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!existingGroup) {
      throw new AppError(
        'El grupo no existe',
        404,
        'GROUP_NOT_FOUND',
        `El grupo con ID ${groupId} no existe (Solicitado por: ${user?.username || 'Unknown'})`,
      );
    }

    const existingRelation = await prisma.fileGroupPermission.findFirst({
      where: {
        groupId,
        fileId,
      },
    });

    if (existingRelation) {
      throw new AppError(
        'El grupo ya tiene permisos para este archivo',
        400,
        'GROUP_ALREADY_HAS_FILE_PERMISSION',
        `El grupo ${groupId} ya tiene permisos para el archivo ${fileId} (Solicitado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.fileGroupPermission.create({
      data: {
        groupId,
        fileId,
      },
    });

    logger.info(
      `Permisos del grupo ${groupId} para el archivo ${fileId} agregados exitosamente (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.status(201).json({
      error: null,
      message: 'Permisos del grupo para el archivo agregados exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

export const removeGroupToFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { fileId, groupId } = removeGroupToFileSchema.parse(req.params);

    const existingRelation = await prisma.fileGroupPermission.findFirst({
      where: {
        groupId,
        fileId,
      },
    });

    if (!existingRelation) {
      throw new AppError(
        'El grupo no tiene permisos para este archivo',
        404,
        'GROUP_FILE_PERMISSION_NOT_FOUND',
        `El grupo ${groupId} no tiene permisos para el archivo ${fileId} (Solicitado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.fileGroupPermission.deleteMany({
      where: {
        groupId,
        fileId,
      },
    });

    logger.info(
      `Permisos del grupo ${groupId} para el archivo ${fileId} eliminados exitosamente (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.json({
      error: null,
      message: 'Permisos del grupo para el archivo eliminados exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
