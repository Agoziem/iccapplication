import React from "react";

interface VerificationEmailProps {
  confirmLink: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({ confirmLink }) => {
  return (
    <p>
      Click <a href={confirmLink}>here</a> to verify your email.
    </p>
  );
};

export default VerificationEmail;
