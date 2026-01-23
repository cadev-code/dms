import z from 'zod';

export const getFilePermissionsSchema = z.object({
  fileId: z.coerce
    .number({ invalid_type_error: 'fileId debe ser un número' })
    .int('fileId debe ser un número entero'),
});

export const addGroupToFileSchema = z.object({
  groupId: z.coerce
    .number({ invalid_type_error: 'groupId debe ser un número' })
    .int('groupId debe ser un número entero'),
  fileId: z.coerce
    .number({ invalid_type_error: 'fileId debe ser un número' })
    .int('fileId debe ser un número entero'),
});

export type AddGroupToFileBody = z.infer<typeof addGroupToFileSchema>;

export const removeGroupToFileSchema = z.object({
  groupId: z.coerce
    .number({ invalid_type_error: 'groupId debe ser un número' })
    .int('groupId debe ser un número entero'),
  fileId: z.coerce
    .number({ invalid_type_error: 'fileId debe ser un número' })
    .int('fileId debe ser un número entero'),
});
