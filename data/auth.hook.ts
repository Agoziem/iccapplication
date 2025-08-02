import { Axiosinstance } from "./instance";
import {
  LoginUserType,
  LogoutType,
  RegisterUserType,
  VerifyTokenType,
} from "@/schemas/auth";
import { LoginUserResponse, TokenResponse } from "@/types/auth";

// create user
export const RegisterUser = async (
  userData: RegisterUserType
): Promise<TokenResponse> => {
  const response = await Axiosinstance.post("auth/register", userData);
  return response.data;
};

// login user
export const LoginUser = async (
  credentials: LoginUserType
): Promise<LoginUserResponse> => {
  const response = await Axiosinstance.post("/auth/login_email", credentials);
  return response.data;
};

// logout user
export const LogoutUser = async (data: LogoutType) => {
  const response = await Axiosinstance.post("auth/logout", data);
  return response.data;
};

// reset email verification token
export const requestVerificationToken = async (
  email: string
): Promise<TokenResponse> => {
  const response = await Axiosinstance.post("auth/email-verification/request", { email });
  return response.data;
};

// verify email token
export const VerifyEmailToken = async (
  data: VerifyTokenType
): Promise<LoginUserResponse> => {
  const response = await Axiosinstance.post(
    "auth/email-verification/verify",
    data
  );
  return response.data;
};

// request password reset token
export const requestPasswordResetToken = async (
  email: string
): Promise<TokenResponse> => {
  const response = await Axiosinstance.post("auth/password-reset/request", { email });
  return response.data;
};


// reset password using token
export const ResetPassword = async (
  data: { token: string; newpassword: string }
): Promise<LoginUserResponse> => {
  const response = await Axiosinstance.post("auth/password-reset/reset", data);
  return response.data;
};
