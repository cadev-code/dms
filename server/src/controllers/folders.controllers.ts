import { NextFunction, Request, Response } from 'express';
import {
  CreateFolderBody,
  mutateFolderParamsSchema,
  renameFolderSchema,
} from '../schemas/folders.schema';
import prisma from '../prisma_client';
import { AppError } from '../utils/AppError';
import { logger } from '../helpers/logger';

export const createFolder = async (
  req: Request<object, object, CreateFolderBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { folderName, parentId } = req.body;

    const existingFolder = await prisma.folder.findUnique({
      where: { folderName, parentId },
    });

    if (existingFolder) {
      throw new AppError(
        `Ya existe una carpeta con el nombre "${folderName}" en esta ubicación.`,
        400,
        'FOLDER_ALREADY_EXISTS',
        `Intento de creación de carpeta fallido - Nombre de carpeta duplicado (Intentado por: ${user?.username})`,
      );
    }

    if (parentId) {
      const existingParentFolder = await prisma.folder.findUnique({
        where: { id: parentId },
      });

      if (!existingParentFolder) {
        throw new AppError(
          `La carpeta padre no existe.`,
          400,
          'PARENT_FOLDER_NOT_FOUND',
          `Intento de creación de carpeta fallido - Carpeta padre no encontrada - parentId: ${parentId} (Intentado por: ${user?.username})`,
        );
      }
    }

    const newFolder = await prisma.folder.create({
      data: { folderName, parentId },
    });

    logger.info(
      `Carpeta creada exitosamente - ${newFolder.folderName}, Carpeta padre: ${newFolder.parentId} (Creado por: ${user?.username})`,
    );

    res
      .status(201)
      .json({ error: null, message: 'Carpeta creada exitosamente' });
  } catch (error) {
    next(error);
  }
};

export const getAllFolders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { groups: true },
    });

    let folders = [];

    if (user?.role !== 'USER') {
      // si el usuario es admin
      folders = await prisma.folder.findMany({
        orderBy: { folderName: 'asc' },
      });
    } else {
      // si el usuario es user
      const groupsIds = user.groups.map(({ groupId }) => groupId);

      const folderPermissions = await prisma.folderGroupPermission.findMany({
        where: { groupId: { in: groupsIds } },
      });

      const foldersIds = folderPermissions.map(({ folderId }) => folderId);

      folders = await prisma.folder.findMany({
        where: {
          id: { in: foldersIds },
        },
        orderBy: { folderName: 'asc' },
      });
    }

    // Árbol de carpetas a partir de una lista plana
    type FolderNode = (typeof folders)[number] & { children: FolderNode[] };

    const folderMap = new Map<number, FolderNode>();

    // Inicializar el mapa de carpetas
    folders.forEach((folder) => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    const rootFolders: FolderNode[] = [];

    // Construir la jerarquía de carpetas
    folderMap.forEach((folderNode) => {
      if (folderNode.parentId === null) {
        rootFolders.push(folderNode);
      } else {
        const parentNode = folderMap.get(folderNode.parentId);

        if (parentNode) {
          parentNode.children.push(folderNode);
        } else {
          rootFolders.push(folderNode);
        }
      }
    });

    logger.info(
      `Carpetas obtenidas exitosamente (Solicitado por: ${user?.username})`,
    );

    res.status(200).json({ error: null, data: rootFolders });
  } catch (error) {
    next(error);
  }
};

export const renameFolder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { folderId } = mutateFolderParamsSchema.parse(req.params);
    const { folderName } = renameFolderSchema.parse(req.body);

    const existingFolder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!existingFolder) {
      throw new AppError(
        `La carpeta no existe.`,
        400,
        'FOLDER_NOT_FOUND',
        `Intento de renombrar carpeta fallido - Carpeta no encontrada - folderId: ${folderId} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    const existingFolderWithName = await prisma.folder.findUnique({
      where: { folderName, parentId: existingFolder.parentId },
    });

    if (existingFolderWithName) {
      throw new AppError(
        `Ya existe una carpeta con el nombre "${folderName}" en esta ubicación.`,
        400,
        'FOLDER_ALREADY_EXISTS',
        `Intento de renombrar carpeta fallido - Nombre de carpeta duplicado (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.folder.update({
      where: { id: folderId },
      data: { folderName },
    });

    logger.info(
      `Carpeta renombrada exitosamente - ID: ${folderId}, Nombre Anterior: ${existingFolder.folderName}, Nuevo nombre: ${folderName} (Renombrado por: ${user?.username || 'Unknown'})`,
    );

    res
      .status(200)
      .json({ error: null, message: 'Carpeta renombrada exitosamente' });
  } catch (error) {
    next(error);
  }
};

export const deleteFolder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { folderId } = mutateFolderParamsSchema.parse(req.params);

    const existingFolder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!existingFolder) {
      throw new AppError(
        `La carpeta no existe.`,
        400,
        'FOLDER_NOT_FOUND',
        `Intento de eliminar carpeta fallido - Carpeta no encontrada - folderId: ${folderId} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.folder.delete({
      where: { id: folderId },
    });

    logger.info(
      `Carpeta eliminada exitosamente - ID: ${folderId} FolderName: ${existingFolder.folderName} (Eliminado por: ${user?.username || 'Unknown'})`,
    );

    res
      .status(200)
      .json({ error: null, message: 'Carpeta eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
};
