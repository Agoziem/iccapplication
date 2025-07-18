import React from "react";

const Toast = ({ title,time,message}) => {
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" >
      <div
        id="liveToast"
        className="toast fade hide"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        
      >
        <div className="toast-header" style={{backgroundColor:"var(--bgLightColor)",borderBottom:"1px solid var(--bgDarkColor)"}}>
        <i className="bi bi-check-circle-fill mb-0 text-success me-2"></i>
          <strong className="text-success me-auto">{title}</strong>
          <small>{time}</small>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body text-primary" style={{backgroundColor: "var(--bgLightColor)",borderColor:"var(--bgDarkColor)"}}>{message}</div>
      </div>
    </div>
  );
};

export default Toast;
