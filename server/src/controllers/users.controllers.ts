import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma_client';
import { logger } from '../helpers/logger';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    const users = await prisma.user.findMany();

    const formattedUsers = users.map((user) => ({
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      role: user.role,
    }));

    logger.info(
      `Todos los usuarios obtenidos exitosamente (Solicitado por: ${user?.username || 'Unknown'})`,
    );

    res.status(200).json({ error: null, data: formattedUsers });
  } catch (error) {
    next(error);
  }
};
