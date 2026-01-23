import z from 'zod';

export const addGroupToFolderSchema = z.object({
  groupId: z.coerce
    .number({ invalid_type_error: 'groupId debe ser un número' })
    .int('groupId debe ser un número entero'),
  folderId: z.coerce
    .number({ invalid_type_error: 'folderId debe ser un número' })
    .int('folderId debe ser un número entero'),
});

export type AddGroupToFolderBody = z.infer<typeof addGroupToFolderSchema>;

export const removeGroupToFolderSchema = z.object({
  groupId: z.coerce
    .number({ invalid_type_error: 'groupId debe ser un número' })
    .int('groupId debe ser un número entero'),
  folderId: z.coerce
    .number({ invalid_type_error: 'folderId debe ser un número' })
    .int('folderId debe ser un número entero'),
});
