import { NextFunction, Request, Response } from 'express';

import prisma from '../prisma_client';

import { inheritancePermissionsSchema } from '../schemas/inheritancePermissions.schema';
import { logger } from '../helpers/logger';

const getAllDescendantFolderIds = async (
  folderId: number,
): Promise<number[]> => {
  const allFolderIds: number[] = [];
  const queue: number[] = [folderId];

  while (queue.length > 0) {
    const currentId = queue.shift()!; // Obtiene el primer id de la cola y lo elimina de la cola

    // Evitar duplicados si el árbol no está perfectamente limpio
    if (allFolderIds.includes(currentId)) continue;
    allFolderIds.push(currentId);

    const children = await prisma.folder.findMany({
      where: { parentId: currentId },
      select: { id: true },
    });

    queue.push(...children.map((c) => c.id));
  }

  return allFolderIds;
};

const getAllDescendantFileIds = async (
  allFolderIds: number[],
): Promise<number[]> => {
  const allFileIds: number[] = [];

  for (const folderId of allFolderIds) {
    const files = await prisma.file.findMany({
      where: { folderId },
      select: { id: true },
    });

    allFileIds.push(...files.map((f) => f.id));
  }

  return allFileIds;
};

export const applyInheritanceToTree = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { folderId, groupId } = inheritancePermissionsSchema.parse(
      req.params,
    );

    const allFolderIds: number[] = await getAllDescendantFolderIds(folderId);

    const allFileIds: number[] = await getAllDescendantFileIds(allFolderIds);

    for (const folderId of allFolderIds) {
      const existingPermission = await prisma.folderGroupPermission.findFirst({
        where: {
          folderId,
          groupId,
        },
      });

      if (existingPermission) continue;

      await prisma.folderGroupPermission.create({
        data: {
          folderId,
          groupId,
        },
      });
    }

    for (const fileId of allFileIds) {
      const existingPermission = await prisma.fileGroupPermission.findFirst({
        where: {
          fileId,
          groupId,
        },
      });

      if (existingPermission) continue;

      await prisma.fileGroupPermission.create({
        data: {
          fileId,
          groupId,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    logger.info(
      `Usuario "${user?.username}" aplicó permisos de herencia al grupo ${groupId} para la carpeta ${folderId} y sus subcarpetas y archivos.`,
    );

    res.status(201).json({
      error: null,
      message: 'Permisos de herencia aplicados correctamente',
    });
  } catch (error) {
    next(error);
  }
};

export const removeInheritanceToTree = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { folderId, groupId } = inheritancePermissionsSchema.parse(
      req.params,
    );

    const allFolderIds = await getAllDescendantFolderIds(folderId);
    const allFileIds = await getAllDescendantFileIds(allFolderIds);

    for (const folderId of allFolderIds) {
      const existingPermission = await prisma.folderGroupPermission.findFirst({
        where: {
          folderId,
          groupId,
        },
      });

      if (!existingPermission) continue;

      await prisma.folderGroupPermission.delete({
        where: {
          folderId_groupId: {
            folderId,
            groupId,
          },
        },
      });
    }

    for (const fileId of allFileIds) {
      const existingPermission = await prisma.fileGroupPermission.findFirst({
        where: {
          fileId,
          groupId,
        },
      });

      if (!existingPermission) continue;

      await prisma.fileGroupPermission.delete({
        where: {
          fileId_groupId: {
            fileId,
            groupId,
          },
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    logger.info(
      `Usuario "${user?.username}" eliminó permisos de herencia al grupo ${groupId} para la carpeta ${folderId} y sus subcarpetas y archivos.`,
    );

    res.status(201).json({
      error: null,
      message: 'Permisos de herencia eliminados correctamente',
    });
  } catch (error) {
    next(error);
  }
};
