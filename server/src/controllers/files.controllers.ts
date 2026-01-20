import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma_client';
import { AppError } from '../utils/AppError';
import { removeUploadedFile } from '../helpers/removeUploadedFile';
import { logger } from '../helpers/logger';

import {
  mutateFileParamsSchema,
  RenameFileBody,
  UploadFileBody,
} from '../schemas/files.schema';

const getType = (mimetype: string) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype === 'application/pdf') return 'pdf';
  if (
    mimetype === 'application/msword' ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
    return 'word';
  if (
    mimetype === 'application/vnd.ms-excel' ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
    return 'excel';
  if (
    mimetype === 'application/vnd.ms-powerpoint' ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  )
    return 'powerpoint';
  return 'other';
};

export const uploadFile = async (
  req: Request<object, object, UploadFileBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
      },
    });

    const { documentName, folderId } = req.body;

    const existingFolder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!existingFolder) {
      throw new AppError(
        `La carpeta especificada no existe`,
        400,
        'FOLDER_NOT_FOUND',
        `Intento de carga de archivo fallido - La carpeta especificada no existe - folderId: ${folderId} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    const file = req.file;

    if (!file) {
      throw new AppError(
        `Archivo no proporcionado`,
        400,
        'FILE_NOT_PROVIDED',
        `Intento de carga de archivo fallido - No se proporciono ningún archivo (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    const { filename, mimetype, size, path } = file;

    const existingFile = await prisma.file.findFirst({
      where: {
        documentName: documentName,
        folderId,
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
        documentName,
        fileName: filename,
        type: getType(mimetype),
        size,
        folderId,
      },
    });

    logger.info(
      `Archivo cargado exitosamente - ${filename} (Cargado por: ${user?.username || 'Unknown'})`,
    );

    res
      .status(201)
      .json({ error: null, message: 'Archivo cargado exitosamente' });
  } catch (error) {
    removeUploadedFile(req.file?.path || '');
    next(error);
  }
};

export const getAllFiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
      },
    });

    const files = await prisma.file.findMany();

    logger.info(
      `Recuperación de todos los archivos realizada por el usuario: ${user?.username || 'Unknown'}`,
    );

    res.status(200).json({ error: null, data: files });
  } catch (error) {
    next(error);
  }
};

export const getFilesByType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
      },
    });

    const files = await prisma.file.findMany({
      where: {
        type: req.params.type,
      },
    });

    logger.info(
      `Recuperación de archivos por tipo (${req.params.type}) realizada por el usuario: ${user?.username || 'Unknown'}`,
    );

    res.status(200).json({ error: null, data: files });
  } catch (error) {
    next(error);
  }
};

export const getFilesByFolder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
      },
    });

    const files = await prisma.file.findMany({
      where: {
        folderId: Number(req.params.folderId),
      },
    });

    logger.info(
      `Recuperación de archivos por folder (${req.params.folderId}) realizada por el usuario: ${user?.username || 'Unknown'}`,
    );

    res.status(200).json({ error: null, data: files });
  } catch (error) {
    next(error);
  }
};

export const renameFile = async (
  req: Request<object, object, RenameFileBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const { fileId } = mutateFileParamsSchema.parse(req.params);
    const { documentName } = req.body;

    const existingFile = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!existingFile) {
      throw new AppError(
        `El archivo no existe.`,
        400,
        'FILE_NOT_FOUND',
        `Intento de renombrar archivo fallido - Archivo no encontrado - fileId: ${fileId} (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    const existingFileWithName = await prisma.file.findFirst({
      where: { documentName, folderId: existingFile.folderId },
    });

    if (existingFileWithName) {
      throw new AppError(
        `Ya existe un archivo con el nombre "${documentName}" en esta ubicación.`,
        400,
        'FILE_ALREADY_EXISTS',
        `Intento de renombrar archivo fallido - Nombre de archivo duplicado (Intentado por: ${user?.username || 'Unknown'})`,
      );
    }

    await prisma.file.update({
      where: { id: fileId },
      data: { documentName },
    });

    logger.info(
      `Archivo renombrado exitosamente - ID: ${fileId}, Nombre Anterior: ${existingFile.documentName}, Nuevo nombre: ${documentName} (Renombrado por: ${user?.username || 'Unknown'})`,
    );

    res
      .status(200)
      .json({ error: null, message: 'Archivo renombrado exitosamente' });
  } catch (error) {
    next(error);
  }
};
