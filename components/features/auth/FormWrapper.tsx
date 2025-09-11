import Link from "next/link";
import React from "react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
// import { SiFacebook } from "react-icons/si";
import { FaGithub } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";

const FormWrapper = ({
  children,
  headerLabel,
  backButtonlabel,
  backButtonHref,
  backButtonHrefText,
  showSocial = true,
}) => {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || DEFAULT_LOGIN_REDIRECT;
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
          <div className="d-md-flex justify-content-center mb-4">
            <div
              className="d-flex align-items-center me-0 me-md-3 p-2 px-3 mb-4 mb-md-0"
              style={{
                border: "1.2px solid #98889573",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => {
                signIn("google", {
                  callbackUrl: next,
                });
              }}
            >
              <FcGoogle className="h5 mb-0 me-2" />

              {backButtonHrefText === "Sign up" ? "Sign in" : "Sign up"}
            </div>

            <div
              className="d-flex align-items-center me-0  p-2 px-3"
              style={{
                border: "1.2px solid #98889573",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => {
                signIn("github", {
                  callbackUrl: next,
                });
              }}
            >
              <FaGithub
                className="h5 mb-0 me-2"
                style={{
                  cursor: "pointer",
                  color: "#000000",
                }}
              />

              {backButtonHrefText === "Sign up" ? "Sign in" : "Sign up"}
            </div>
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
