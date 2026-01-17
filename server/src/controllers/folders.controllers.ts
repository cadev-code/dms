import { NextFunction, Request, Response } from 'express';
import { CreateFolderBody } from '../schemas/folders.schema';
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
    });

    const folders = await prisma.folder.findMany({
      orderBy: { folderName: 'asc' },
    });

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
      `Todas las carpetas obtenidas exitosamente (Solicitado por: ${user?.username})`,
    );

    res.status(200).json({ error: null, data: rootFolders });
  } catch (error) {
    next(error);
  }
};
