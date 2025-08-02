import { z } from "zod";

// Utility for optional strings
const optionalStr = z.string().nullable().optional();

export const RegisterUserSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  password: z.string(),
  organization_id: z.number().optional(),
});

export type RegisterUserType = z.infer<typeof RegisterUserSchema>;

export const RegisterUserOAuthSchema = z.object({
  name: z.string(),
  email: z.string(),
  email_verified: z.boolean().default(true),
  given_name: optionalStr,
  family_name: optionalStr,
});

export type RegisterUserOAuthType = z.infer<typeof RegisterUserOAuthSchema>;

export const LoginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type LoginUserType = z.infer<typeof LoginUserSchema>;


export const LogoutSchema = z.object({
  refresh: z.string(),
});

export type LogoutType = z.infer<typeof LogoutSchema>;


// -------------------------------------------------------------
// token schema
// -------------------------------------------------------------
export const VerifyTokenSchema = z.object({
  token: z.string(),
});

export type VerifyTokenType = z.infer<typeof VerifyTokenSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string(),
});

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

export const GetVerificationTokenSchema = z.object({
  email: z.string(),
});

export type GetVerificationTokenType = z.infer<typeof GetVerificationTokenSchema>;


export const VerifyEmailSchema = z.object({
  token: z.string(),
});
export type VerifyEmailType = z.infer<typeof VerifyEmailSchema>;

export const GetUserByEmailSchema = z.object({
  email: z.string(),
});

export type GetUserByEmailType = z.infer<typeof GetUserByEmailSchema>;
