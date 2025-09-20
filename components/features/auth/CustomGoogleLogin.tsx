"use client";
import React, { useState } from "react";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useRegisterUserOAuth } from "@/data/hooks/user.hooks";
import { UserRegistrationOAuth } from "@/types/users";
import { saveToken } from "@/utils/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import Alert from "@/components/custom/Alert/Alert";
import { FcGoogle } from "react-icons/fc";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale?: string;
}

interface CustomGoogleLoginProps {
  redirectPath?: string;
  onSuccess?: (user: GoogleUser) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const CustomGoogleLogin: React.FC<CustomGoogleLoginProps> = ({
  redirectPath = DEFAULT_LOGIN_REDIRECT,
  onSuccess,
  onError,
  buttonText = "Continue with Google",
  className = "",
  disabled = false,
  children,
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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);

      try {
        // Fetch user info from Google using the access token
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
        );

        if (!userInfoResponse.ok) {
          throw new Error("Failed to fetch user info from Google");
        }

        const googleUser: GoogleUser = await userInfoResponse.json();

        // Prepare user data for your backend
        const userData: UserRegistrationOAuth = {
          name: googleUser.name,
          email: googleUser.email,
          email_verified: googleUser.verified_email,
          given_name: googleUser.given_name,
          family_name: googleUser.family_name,
        };

        // Register user with your backend using OAuth
        const result = await registerUserOAuth({
          provider: "google",
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
          onSuccess?.(googleUser);

          // Redirect after short delay
          setTimeout(() => {
            router.push(redirectPath || DEFAULT_LOGIN_REDIRECT);
          }, 1500);
        } else {
          throw new Error("No access token received from server");
        }
      } catch (error: any) {
        console.error("Google OAuth Error:", error);

        let errorMessage = "Google sign-in failed. Please try again.";

        // Handle specific error cases
        if (error.message?.includes("user already exists")) {
          errorMessage =
            "An account with this email already exists. Please sign in normally.";
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
    },
    onError: (errorResponse) => {
      console.error("Google Login Error:", errorResponse);
      const errorMsg =
        errorResponse.error_description || "Google sign-in failed";

      setAlert({
        show: true,
        message: errorMsg,
        type: "danger",
      });

      onError?.(errorMsg);

      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "success" });
      }, 3000);
    },
    onNonOAuthError: (nonOAuthError) => {
      console.error("Google Non-OAuth Error:", nonOAuthError);
      let errorMsg = "An error occurred during sign-in";

      switch (nonOAuthError.type) {
        case "popup_failed_to_open":
          errorMsg =
            "Failed to open Google sign-in popup. Please allow popups and try again.";
          break;
        case "popup_closed":
          errorMsg = "Sign-in was cancelled. Please try again.";
          break;
        default:
          errorMsg = "An unexpected error occurred during sign-in";
      }

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
    },
    scope: "openid profile email",
    flow: "implicit", // Use implicit flow for client-side handling
  });

  const handleClick = () => {
    if (!disabled && !isLoading) {
      googleLogin();
    }
  };

  return (
    <div className={`custom-google-login ${className}`}>
      {children ? (
        <div
          onClick={handleClick}
          style={{ cursor: disabled || isLoading ? "not-allowed" : "pointer" }}
        >
          {children}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || isLoading}
          className="d-flex align-items-center me-0 me-md-3 p-2 px-3 mb-4 mb-md-0"
          style={{
            border: "1.2px solid #98889573",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {!isLoading ? (
            <>
              <FcGoogle className="h5 mb-0 me-2" />
              <span className="text-dark fw-medium">{buttonText}</span>
            </>
          ) : (
            <>
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="text-dark">Signing in...</span>
            </>
          )}
        </button>
      )}

      {alert.show && (
        <div className="mt-3">
          <Alert type={alert.type}>{alert.message}</Alert>
        </div>
      )}
    </div>
  );
};

export default CustomGoogleLogin;
