import { z } from 'zod';

export const getGroupMembersSchema = z.object({
  groupId: z.coerce
    .number({ invalid_type_error: 'groupId debe ser un número' })
    .int('groupId debe ser un número entero'),
});

export const addUserToGroupSchema = z.object({
  userId: z.coerce
    .number({ invalid_type_error: 'userId debe ser un número' })
    .int('userId debe ser un número entero'),
  groupId: z.coerce
    .number({ invalid_type_error: 'groupId debe ser un número' })
    .int('groupId debe ser un número entero'),
});

export type AddUserToGroupBody = z.infer<typeof addUserToGroupSchema>;

export const removeUserFromGroupSchema = z.object({
  userId: z.coerce
    .number({ invalid_type_error: 'userId debe ser un número' })
    .int('userId debe ser un número entero'),
  groupId: z.coerce
    .number({ invalid_type_error: 'groupId debe ser un número' })
    .int('groupId debe ser un número entero'),
});
