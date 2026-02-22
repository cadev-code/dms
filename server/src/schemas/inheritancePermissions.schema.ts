import z from 'zod';

export const inheritancePermissionsSchema = z.object({
  folderId: z.coerce
    .number({ invalid_type_error: 'folderId debe debe ser un número' })
    .int('Id debe ser un número entero'),
  groupId: z.coerce
    .number({ invalid_type_error: 'groupId debe debe ser un número' })
    .int('groupId debe ser un número entero'),
});
