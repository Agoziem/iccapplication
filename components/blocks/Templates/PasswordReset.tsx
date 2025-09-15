import React from 'react'

const PasswordReset = ({resetLink}: {resetLink: string}) => {
  return (
    <p>Click <a href={resetLink}>here</a> to reset your password.</p>
  )
}

export default PasswordReset