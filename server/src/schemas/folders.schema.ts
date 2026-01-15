import z from 'zod';

export const createFolderSchema = z.object({
  folderName: z.string().min(1, 'Nombre de carpeta es obligatorio'),
  parentId: z.number().nullable(),
});

export type CreateFolderBody = z.infer<typeof createFolderSchema>;
