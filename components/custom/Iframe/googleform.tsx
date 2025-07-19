import React from "react";
import "./iframe.css"

interface GoogleFormProps {
  src: string;
}

const GoogleForm: React.FC<GoogleFormProps> = ({ src }) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <iframe
        src={src}
        width="640"
        height="800"
        style={{ border: "none", width: "100%", maxWidth: "640px" }}
        title="Google Form"
        allowFullScreen
        className="iframescrollbar"
      >
        Loading…
      </iframe>
    </div>
  );
};

export default GoogleForm;
