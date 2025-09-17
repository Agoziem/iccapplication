import { COOKIE_NAME} from "@/data/constants";
import { AxiosInstance } from "@/data/instance";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export type TokenType = {
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    id: string;
    emailIsVerified: boolean;
    verificationToken?: string;
    expireTime?: string;
  };
};


// / Define the structure of the decoded JWT payload
type JwtPayload = {
  exp: number; // Expiration time (in seconds)
  iat?: number;
  [key: string]: any;
};

export const getToken = (): string | null => {
    const tokenData = Cookies.get(COOKIE_NAME);
    if (!tokenData) return null;

    try {
      const parsed = JSON.parse(tokenData) as TokenType;
      const decoded = jwtDecode<JwtPayload>(parsed.access_token);

      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        // Token has expired, remove it
        Cookies.remove(COOKIE_NAME);
        return null;
      }

      return parsed.access_token;
    } catch (error) {
      console.error("Invalid token cookie:", error);
      Cookies.remove(COOKIE_NAME);
      return null;
    }
  };

// --------------------------------------------------
// get refresh token
// --------------------------------------------------
export const getRefreshToken = (): string | null => {
  const tokenData = Cookies.get(COOKIE_NAME);
  if (!tokenData) return null;

  try {
    const parsed = JSON.parse(tokenData) as TokenType;
    return parsed.refresh_token;
  } catch (error) {
    console.error("Invalid token cookie:", error);
    Cookies.remove(COOKIE_NAME);
    return null;
  }
};

// --------------------------------------------------
// Get user ID from cookies
// --------------------------------------------------
export const getUserId = (): string | null => {
  const tokenData = Cookies.get(COOKIE_NAME);
  if (!tokenData) return null;

  try {
    const parsed = JSON.parse(tokenData) as TokenType;
    return parsed.user.id; // Return the user ID
  } catch (error) {
    console.error("Invalid token cookie:", error);
    return null;
  }
};

// --------------------------------------------------
// Save token to cookies
// --------------------------------------------------
export const saveToken = (data: TokenType) => {
  const { access_token, refresh_token, user } = data;
  const decoded = jwtDecode<{ exp?: number }>(access_token);
  if (!decoded.exp) {
    console.warn("Access token is missing expiration claim (exp).");
    return;
  }
  const expirationDate = new Date(decoded.exp * 1000);
  const tokenData = {
    access_token,
    refresh_token,
    user: {
      email: user.email,
      uid: user.id,
    },
  };

  Cookies.set(COOKIE_NAME, JSON.stringify(tokenData), {
    expires: expirationDate, // use actual expiration
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/", // ensure cookie is sent on all paths
  });
};

// --------------------------------------------------
// Remove token from cookies
// --------------------------------------------------
export const removeToken = () => {
  Cookies.remove(COOKIE_NAME);
};


// --------------------------------------------------
// get user from the database by email
// --------------------------------------------------
export const getUserByEmail = async (email: string) => {
  const response = await AxiosInstance.get(
    `users/user_by_email/${email}`
  );
  return response.data;
};


// --------------------------------------------------
// get token by email
// --------------------------------------------------
export const getTokenByEmail = async (email: string) => {
  const response = await AxiosInstance.get(`users/token/${email}`);
  return response.data;
};
