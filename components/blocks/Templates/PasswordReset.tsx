import React from 'react'

interface PasswordResetProps {
  resetLink: string;
}

const PasswordReset: React.FC<PasswordResetProps> = ({resetLink}) => {
  return (
    <p>Click <a href={resetLink}>here</a> to reset your password.</p>
  )
}

export default PasswordReset