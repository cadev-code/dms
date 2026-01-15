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
    const { folderName, parentId } = req.body;

    const existingFolder = await prisma.folder.findUnique({
      where: { folderName, parentId },
    });

    if (existingFolder) {
      throw new AppError(
        `Ya existe una carpeta con el nombre "${folderName}" en esta ubicación.`,
        400,
        'FOLDER_ALREADY_EXISTS',
        `Intento de creación de carpeta fallido - Nombre de carpeta duplicado (Intentado por: ${req.userId})`,
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
          `Intento de creación de carpeta fallido - Carpeta padre no encontrada - parentId: ${parentId} (Intentado por: ${req.userId})`,
        );
      }
    }

    const newFolder = await prisma.folder.create({
      data: { folderName, parentId },
    });

    logger.info(
      `Carpeta creada exitosamente - ${newFolder.folderName}, Carpeta padre: ${newFolder.parentId} (Creado por: ${req.userId})`,
    );

    res
      .status(201)
      .json({ error: null, message: 'Carpeta creada exitosamente' });
  } catch (error) {
    next(error);
  }
};
