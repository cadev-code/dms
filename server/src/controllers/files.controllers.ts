import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma_client';
import { AppError } from '../utils/AppError';
import { removeUploadedFile } from '../helpers/removeUploadedFile';
import { logger } from '../helpers/logger';

interface FileBody {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export const uploadFile = async (
  req: Request<object, object, FileBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
      },
    });

    const file = req.file;

    if (!file) {
      throw new AppError(
        `Archivo no proporcionado`,
        400,
        'FILE_NOT_PROVIDED',
        `Intento de carga de archivo fallido - No se proporciono ningún archivo (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    const { filename, originalname, mimetype, size, path } = file;

    const existingFile = await prisma.file.findFirst({
      where: {
        originalName: originalname,
      },
    });

    if (existingFile) {
      removeUploadedFile(path);

      throw new AppError(
        `El archivo ya existe`,
        400,
        'FILE_ALREADY_EXISTS',
        `Intento de carga de archivo fallido - El archivo ya existe (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.file.create({
      data: {
        originalName: originalname,
        filename,
        mimeType: mimetype,
        size,
      },
    });

    logger.info(
      `Archivo cargado exitosamente - ${filename} (Cargado por: ${user?.username || 'Unknown'})`,
    );

    res
      .status(201)
      .json({ error: null, message: 'Archivo cargado exitosamente' });
  } catch (error) {
    next(error);
  }
};
