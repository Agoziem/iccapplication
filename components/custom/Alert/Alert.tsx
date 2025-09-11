import React from "react";


/**
 * @param {{ type: string; children: React.ReactNode; className?: string }} param0
 */
const Alert = ({ type, children, className="" }) => {
  let icon = "";
  let alertType = "";

  if (type === "info") {
    icon = "info-fill";
    alertType = "alert-primary";
  } else if (type === "success") {
    icon = "check-circle-fill";
    alertType = "alert-success";
  } else if (type === "warning") {
    icon = "exclamation-triangle-fill";
    alertType = "alert-warning";
  } else if (type === "danger") {
    icon = "exclamation-triangle-fill";
    alertType = "alert-danger";
  }

  return (
    <>
      <div
        className={`alert ${alertType} d-flex align-items-center ${className}`}
        role="alert"
      >
        <i className={`bi bi-${icon} me-3`} style={{ fontSize: "24px" }}></i>
        <div>{children}</div>
      </div>
    </>
  );
};

export default Alert;
