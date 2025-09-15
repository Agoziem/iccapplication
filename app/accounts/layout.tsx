import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Authentication",
    description:
      "Sign in or sign up to access your account, manage your profile, and more.",
  };

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default AuthLayout