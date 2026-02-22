import { NextFunction, Request, Response } from 'express';

import prisma from '../prisma_client';

import { inheritancePermissionsSchema } from '../schemas/inheritancePermissions.schema';
import { logger } from '../helpers/logger';

export const applyInheritanceToTree = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { folderId, groupId } = inheritancePermissionsSchema.parse(
      req.params,
    );

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

    const allFilesIds: number[] = [];

    for (const id of allFolderIds) {
      const files = await prisma.file.findMany({
        where: { folderId: id },
        select: { id: true },
      });

      allFilesIds.push(...files.map((f) => f.id));
    }

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

    for (const fileId of allFilesIds) {
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

    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    logger.info(
      `Usuario "${user?.username}" aplicó permisos de herencia al grupo ${group?.name} (id: ${groupId}) para la carpeta ${folder?.folderName} (id: ${folderId}) y sus subcarpetas y archivos.`,
    );

    res.status(201).json({
      error: null,
      message: 'Permisos de herencia aplicados correctamente',
    });
  } catch (error) {
    next(error);
  }
};
