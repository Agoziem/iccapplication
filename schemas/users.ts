import { z } from 'zod'
/**
 * User Mini Schema (AuthUserMini from API)
 * Minimal user information for referencing in other schemas
 */
export const UserminiSchema = z.object({
  id: z.number(),
  username: z.string().min(1).max(150).regex(/^[\w.@+-]+$/),
  img: z.string().optional(),
});

/**
 * Main User Schema (AuthUser from API)
 * Complete user profile with all available fields from Django REST API
 */
export const UserSchema = z.object({
  id: z.number().optional(),
  avatar: z.string().url().optional(),
  avatar_url: z.string().optional(),
  avatar_name: z.string().optional(),
  last_login: z.coerce.date().optional(),
  is_superuser: z.boolean().optional(),
  username: z.string().min(1).max(150).regex(/^[\w.@+-]+$/),
  first_name: z.string().max(150).optional(),
  last_name: z.string().max(150).optional(),
  email: z.string().email().max(254),
  is_staff: z.boolean().optional(),
  is_active: z.boolean().optional(),
  date_joined: z.coerce.date().optional(),
  isOauth: z.boolean().optional(),
  Oauthprovider: z.string().max(100).optional(),
  emailIsVerified: z.boolean().optional(),
  twofactorIsEnabled: z.boolean().optional(),
  verificationToken: z.string().max(100).optional(),
  expiryTime: z.coerce.date().optional(),
  address: z.string().max(100).optional(),
  Sex: z.string().max(10).optional(),
  phone: z.string().max(15).optional(),
});

/**
 * Register User Schema (RegisterUser from API)
 */
export const UserRegistrationSchema = z.object({
  firstname: z.string().min(1).max(150),
  lastname: z.string().min(1).max(150),
  email: z.string().email().min(1),
  password: z.string().min(1),
  organization_id: z.number().optional(),
});

/**
 * Register User Response Schema (RegisterUserResponse from API)
 */
export const UserRegistrationResponseSchema = z.object({
  token: z.string().min(1),
  user: UserSchema,
});

/**
 * Register User OAuth Schema (RegisterUserOauth from API)
 */
export const UserRegistrationOAuthSchema = z.object({
  name: z.string().min(1).max(150),
  email: z.string().email().min(1),
  email_verified: z.boolean().default(true).optional(),
  given_name: z.string().min(1).max(150).optional(),
  family_name: z.string().min(1).max(150).optional(),
});

/**
 * Update User Schema (UpdateUser from API)
 */
export const UserUpdateSchema = z.object({
  first_name: z.string().min(1).max(150).optional(),
  last_name: z.string().min(1).max(150).optional(),
  email: z.string().email().min(1).optional(),
  phone: z.string().min(1).max(20).optional(),
  address: z.string().min(1).max(255).optional(),
  avatar: z.string().url().optional(),
});

/**
 * Verify User Schema (VerifyUser from API)
 */
export const UserLoginSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

/**
 * Verify User Response Schema (VerifyUserResponse from API)
 */
export const UserLoginResponseSchema = z.object({
  token: z.string().min(1),
  user: UserSchema,
});

/**
 * Get User By Email Schema (GetUserByEmail from API)
 */
export const GetUserByEmailSchema = z.object({
  email: z.string().email().min(1),
});

/**
 * Get Verification Token Schema (GetVerificationToken from API)
 */
export const GetVerificationTokenSchema = z.object({
  email: z.string().email().min(1),
});

/**
 * Verify Email Schema (VerifyEmail from API)
 */
export const VerifyEmailSchema = z.object({
  token: z.string().min(1),
});

/**
 * Verify Token Schema (VerifyToken from API)
 */
export const VerifyTokenSchema = z.object({
  token: z.string().min(1),
});

/**
 * Reset Password Schema (ResetPassword from API)
 */
export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(1),
});

/**
 * Success Response Schema (SuccessResponse from API)
 */
export const SuccessResponseSchema = z.object({
  message: z.string().min(1),
});

/**
 * Error Response Schema (ErrorResponse from API)
 */
export const ErrorResponseSchema = z.object({
  error: z.string().min(1),
});

/**
 * Array of Users Schema
 */
export const UsersSchema = z.array(UserSchema);
