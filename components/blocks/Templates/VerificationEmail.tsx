import React from "react";

const VerificationEmail = ({confirmLink}) => {
  return (
    <p>
      Click <a href={confirmLink}>here</a> to verify your email.
    </p>
  );
};

export default VerificationEmail;
