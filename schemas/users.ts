import { z } from 'zod';

const optionalStr = z.string().nullable().optional();

export const UpdateUserSchema = z.object({
  first_name: optionalStr,
  last_name: optionalStr,
  email: optionalStr,
  phone: optionalStr,
  Sex: optionalStr,
  address: optionalStr,
  avatar: optionalStr,
});

export type UserUpdateType = z.infer<typeof UpdateUserSchema>;