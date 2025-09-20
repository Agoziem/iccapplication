import Link from "next/link";
import React from "react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import { GOOGLE_CLIENT_ID } from "@/data/constants";
import CustomGoogleLogin from "./CustomGoogleLogin";

interface FormWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonlabel: string;
  backButtonHref: string;
  backButtonHrefText: string;
  showSocial?: boolean;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  children,
  headerLabel,
  backButtonlabel,
  backButtonHref,
  backButtonHrefText,
  showSocial = true,
}) => {
  const searchParams = useSearchParams();
  const next = searchParams.get("redirect") || DEFAULT_LOGIN_REDIRECT;
  return (
    <div>
      <div>
        <h4>{headerLabel}</h4>
        <div className="my-3">
          {backButtonlabel}{" "}
          <Link href={backButtonHref} className="text-secondary">
            {backButtonHrefText}
          </Link>
        </div>

        {/* Social icons */}
        {showSocial && (
          <div>
            {GOOGLE_CLIENT_ID && (
              <div className="mb-4">
                <CustomGoogleLogin redirectPath={next}>
                  <div
                    className="d-flex align-items-center justify-content-center me-0 me-md-3 p-2 px-3 mb-4 mb-md-0"
                    style={{
                      border: "1.2px solid #98889573",
                      borderRadius: "5px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    <FcGoogle className="h5 mb-0 me-2" />
                    {backButtonHrefText === "Sign up" ? "Sign in with Google" : "Sign up with Google"}
                  </div>
                </CustomGoogleLogin>
              </div>
            )}
          </div>
        )}

        {/* The Line */}
        <div className="d-flex justify-content-center">
          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "#98889573",
              marginTop: "10px",
            }}
          ></div>
          <div
            style={{
              color: "var(--bgDarkerColor)",
              padding: "0 10px",
              fontSize: "14px",
            }}
          >
            OR
          </div>
          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "#98889573",
              marginTop: "10px",
            }}
          ></div>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default FormWrapper;
