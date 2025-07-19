import React from 'react'

interface EmailResponseProps {
  message: string;
}

const EmailResponse: React.FC<EmailResponseProps> = ({message}) => {
  return (
    <p>{message}</p>
  )
}

export default EmailResponse