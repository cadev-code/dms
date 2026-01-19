import z from 'zod';

export const createFolderSchema = z.object({
  folderName: z.string().min(1, 'Nombre de carpeta es obligatorio'),
  parentId: z.number().nullable(),
});

export type CreateFolderBody = z.infer<typeof createFolderSchema>;

export const renameFolderParamsSchema = z.object({
  folderId: z.coerce
    .number({ invalid_type_error: 'Id debe debe ser un número' })
    .int('Id debe ser un número entero'),
});

export const renameFolderSchema = z.object({
  folderName: z.string().min(1, 'Nombre de carpeta es obligatorio'),
});

export type RenameFolderBody = z.infer<typeof renameFolderSchema>;
