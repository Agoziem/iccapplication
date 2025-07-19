import React, { ReactNode } from "react";

type AlertType = "info" | "success" | "warning" | "danger";

interface AlertProps {
  type: AlertType;
  children: ReactNode;
  className?: string;
}

const Alert = ({ type, children, className = "" }: AlertProps) => {
  const getAlertConfig = (alertType: AlertType) => {
    const configs = {
      info: { icon: "info-fill", alertClass: "alert-primary" },
      success: { icon: "check-circle-fill", alertClass: "alert-success" },
      warning: { icon: "exclamation-triangle-fill", alertClass: "alert-warning" },
      danger: { icon: "exclamation-triangle-fill", alertClass: "alert-danger" },
    };
    return configs[alertType];
  };

  const config = getAlertConfig(type);

  return (
    <div
      className={`alert ${config.alertClass} d-flex align-items-center ${className}`}
      role="alert"
    >
      <i className={`bi bi-${config.icon} me-3`} style={{ fontSize: "24px" }}></i>
      <div>{children}</div>
    </div>
  );
};

export default Alert;
