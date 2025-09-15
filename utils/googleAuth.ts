import { jwtDecode } from 'jwt-decode';
import { UserRegistrationOAuth } from '@/types/users';

// Google JWT payload interface
export interface GoogleJWTPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale?: string;
  iat: number;
  exp: number;
}

// Google user info from API interface
export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale?: string;
}

/**
 * Decode Google JWT credential and extract user data
 * Used with GoogleLogin component's credential response
 */
export const decodeGoogleCredential = (credential: string): GoogleJWTPayload => {
  try {
    return jwtDecode<GoogleJWTPayload>(credential);
  } catch (error) {
    console.error('Failed to decode Google credential:', error);
    throw new Error('Invalid Google credential');
  }
};

/**
 * Fetch Google user info using access token
 * Used with useGoogleLogin implicit flow
 */
export const fetchGoogleUserInfo = async (accessToken: string): Promise<GoogleUserInfo> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }

    const userInfo: GoogleUserInfo = await response.json();
    return userInfo;
  } catch (error) {
    console.error('Failed to fetch Google user info:', error);
    throw new Error('Failed to fetch user information from Google');
  }
};

/**
 * Convert Google JWT payload to UserRegistrationOAuth format
 */
export const convertGoogleJWTToUserData = (googleData: GoogleJWTPayload): UserRegistrationOAuth => {
  return {
    name: googleData.name,
    email: googleData.email,
    email_verified: googleData.email_verified,
    given_name: googleData.given_name,
    family_name: googleData.family_name,
  };
};

/**
 * Convert Google user info to UserRegistrationOAuth format
 */
export const convertGoogleUserInfoToUserData = (googleData: GoogleUserInfo): UserRegistrationOAuth => {
  return {
    name: googleData.name,
    email: googleData.email,
    email_verified: googleData.verified_email,
    given_name: googleData.given_name,
    family_name: googleData.family_name,
  };
};

/**
 * Validate Google user data before sending to backend
 */
export const validateGoogleUserData = (userData: UserRegistrationOAuth): boolean => {
  return !!(
    userData.name &&
    userData.email &&
    userData.email.includes('@') &&
    typeof userData.email_verified === 'boolean'
  );
};

/**
 * Handle Google OAuth errors and provide user-friendly messages
 */
export const handleGoogleOAuthError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.error) {
    switch (error.error) {
      case 'popup_blocked_by_browser':
        return 'Please allow popups for this site and try again.';
      case 'access_denied':
        return 'Access was denied. Please try again.';
      case 'invalid_client':
        return 'Google authentication is not properly configured.';
      case 'unauthorized_client':
        return 'This application is not authorized to use Google sign-in.';
      default:
        return error.error_description || 'Google sign-in failed. Please try again.';
    }
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred during Google sign-in.';
};

/**
 * Check if Google Client ID is configured
 */
export const isGoogleOAuthConfigured = (): boolean => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return !!(clientId && clientId.length > 0 && clientId !== 'your_google_client_id_here');
};

/**
 * Get Google OAuth configuration
 */
export const getGoogleOAuthConfig = () => {
  return {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    isConfigured: isGoogleOAuthConfigured(),
  };
};
