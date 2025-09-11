import React from 'react'

export const metadata = {
    title: "Authentication",
    description:
      "Sign in or sign up to access your account, manage your profile, and more.",
  };

const AuthLayout = ({children}) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default AuthLayout