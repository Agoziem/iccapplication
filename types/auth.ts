import { User } from "./users";

export interface LoginUserResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface ErrorResponse {
  error: string;
}


export interface SuccessResponse {
  message: string;
}

export interface TokenResponse {
  token: string;
}