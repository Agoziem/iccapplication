import { z } from "zod";
import {
  UserminiSchema,
  UserSchema,
  UserRegistrationSchema,
  UserRegistrationResponseSchema,
  UserRegistrationOAuthSchema,
  UserUpdateSchema,
  UserLoginSchema,
  UserLoginResponseSchema,
  GetUserByEmailSchema,
  GetVerificationTokenSchema,
  VerifyEmailSchema,
  VerifyTokenSchema,
  ResetPasswordSchema,
  SuccessResponseSchema,
  ErrorResponseSchema,
  UsersSchema
} from "../schemas/users";

// Extract TypeScript types from Zod schemas
export type UserMini = z.infer<typeof UserminiSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type UserRegistrationResponse = z.infer<typeof UserRegistrationResponseSchema>;
export type UserRegistrationOAuth = z.infer<typeof UserRegistrationOAuthSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserLoginResponse = z.infer<typeof UserLoginResponseSchema>;
export type GetUserByEmail = z.infer<typeof GetUserByEmailSchema>;
export type GetVerificationToken = z.infer<typeof GetVerificationTokenSchema>;
export type VerifyEmail = z.infer<typeof VerifyEmailSchema>;
export type VerifyToken = z.infer<typeof VerifyTokenSchema>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type Users = z.infer<typeof UsersSchema>;

// Additional utility types
export type UserProfile = Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'email' | 'avatar_url' | 'phone' | 'address'>;
export type UserAuth = Pick<User, 'id' | 'username' | 'email' | 'is_superuser' | 'is_staff' | 'is_active'>;
export type UserFormData = Omit<User, 'id' | 'last_login' | 'date_joined' | 'is_superuser' | 'is_staff' | 'is_active'>;