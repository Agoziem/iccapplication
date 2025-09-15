"use client";
import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useRegisterUserOAuth } from '@/data/hooks/user.hooks';
import { UserRegistrationOAuth } from '@/types/users';
import { saveToken } from '@/utils/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import Alert from '@/components/custom/Alert/Alert';

// Google JWT payload interface
interface GoogleJWTPayload {
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

interface GoogleOAuthProps {
  clientId: string;
  redirectPath?: string;
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  buttonText?: "signin_with" | "signup_with" | "continue_with" | "signin";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  shape?: "rectangular" | "pill" | "circle" | "square";
  type?: "standard" | "icon";
  className?: string;
}

const GoogleOAuth: React.FC<GoogleOAuthProps> = ({
  clientId,
  redirectPath = DEFAULT_LOGIN_REDIRECT,
  onSuccess,
  onError,
  buttonText = "signin_with",
  theme = "outline",
  size = "large",
  shape = "rectangular",
  type = "standard",
  className = "",
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: "success" | "danger" | "info" | "warning";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const { mutateAsync: registerUserOAuth } = useRegisterUserOAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      const errorMsg = "No credential received from Google";
      console.error(errorMsg);
      setAlert({
        show: true,
        message: errorMsg,
        type: "danger",
      });
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      // Decode the JWT token from Google
      const decoded = jwtDecode<GoogleJWTPayload>(credentialResponse.credential);
      console.log('Google user data:', decoded);

      // Prepare user data for your backend
      const userData: UserRegistrationOAuth = {
        name: decoded.name,
        email: decoded.email,
        email_verified: decoded.email_verified,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
      };

      // Register user with your backend using OAuth
      const result = await registerUserOAuth({
        provider: 'google',
        userData,
      });

      // Save tokens and handle success
      if (result.access_token) {
        saveToken(result);
        
        setAlert({
          show: true,
          message: "Successfully signed in with Google!",
          type: "success",
        });

        // Call success callback if provided
        onSuccess?.(decoded);

        // Redirect after short delay
        setTimeout(() => {
          router.push(redirectPath);
        }, 1500);
      } else {
        throw new Error("No access token received from server");
      }
    } catch (error: any) {
      console.error('Google OAuth Error:', error);
      
      let errorMessage = "Google sign-in failed. Please try again.";
      
      // Handle specific error cases
      if (error.message?.includes('user already exists')) {
        errorMessage = "An account with this email already exists. Please sign in normally.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAlert({
        show: true,
        message: errorMessage,
        type: "danger",
      });

      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      
      // Hide alert after 5 seconds
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "success" });
      }, 5000);
    }
  };

  const handleGoogleError = () => {
    const errorMsg = "Google sign-in was cancelled or failed";
    console.error(errorMsg);
    
    setAlert({
      show: true,
      message: errorMsg,
      type: "warning",
    });

    onError?.(errorMsg);

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "success" });
    }, 3000);
  };

  return (
    <div className={`google-oauth-container ${className}`}>
      <GoogleOAuthProvider clientId={clientId}>
        <div className="d-flex flex-column align-items-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text={buttonText}
            theme={theme}
            size={size}
            shape={shape}
            type={type}
            width="300"
            locale="en"
          />
          
          {isLoading && (
            <div className="mt-2 text-center">
              <small className="text-muted">Signing in with Google...</small>
            </div>
          )}

          {alert.show && (
            <div className="mt-3 w-100">
              <Alert type={alert.type}>{alert.message}</Alert>
            </div>
          )}
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleOAuth;
