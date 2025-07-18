import React, { ReactNode, FC } from 'react'
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Authentication",
    description:
      "Sign in or sign up to access your account, manage your profile, and more.",
  };

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({children}) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default AuthLayout