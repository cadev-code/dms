import z from 'zod';

export const createUserSchema = z.object({
  fullname: z.string().min(8),
  username: z.string().min(3),
  role: z.enum(['SUPER_ADMIN', 'CONTENT_ADMIN', 'USER']),
  password: z.string().min(8),
});

export type CreateUserBody = z.infer<typeof createUserSchema>;
