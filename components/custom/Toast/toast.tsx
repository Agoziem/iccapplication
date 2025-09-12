import React from "react";

interface ToastProps {
  title: string;
  time?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  autoClose?: boolean;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const Toast: React.FC<ToastProps> = ({ 
  title,
  time,
  message,
  type = 'success',
  position = 'bottom-right',
  autoClose = true,
  duration = 5000,
  className = "",
  style = {},
  onClose,
  showCloseButton = true
}) => {
  const getPositionClasses = (): string => {
    switch (position) {
      case 'top-right':
        return 'position-fixed top-0 end-0 p-3';
      case 'top-left':
        return 'position-fixed top-0 start-0 p-3';
      case 'bottom-left':
        return 'position-fixed bottom-0 start-0 p-3';
      case 'top-center':
        return 'position-fixed top-0 start-50 translate-middle-x p-3';
      case 'bottom-center':
        return 'position-fixed bottom-0 start-50 translate-middle-x p-3';
      default:
        return 'position-fixed bottom-0 end-0 p-3';
    }
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: 'bi-x-circle-fill',
          iconColor: 'text-danger',
          titleColor: 'text-danger'
        };
      case 'warning':
        return {
          icon: 'bi-exclamation-triangle-fill',
          iconColor: 'text-warning',
          titleColor: 'text-warning'
        };
      case 'info':
        return {
          icon: 'bi-info-circle-fill',
          iconColor: 'text-info',
          titleColor: 'text-info'
        };
      default:
        return {
          icon: 'bi-check-circle-fill',
          iconColor: 'text-success',
          titleColor: 'text-success'
        };
    }
  };

  const typeConfig = getTypeConfig();

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };
  return (
    <div 
      className={`toast-container ${getPositionClasses()} ${className}`}
      style={style}
    >
      <div
        id="liveToast"
        className="toast fade show"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        data-bs-autohide={autoClose}
        data-bs-delay={duration}
      >
        <div 
          className="toast-header" 
          style={{
            backgroundColor: "var(--bgLightColor)",
            borderBottom: "1px solid var(--bgDarkColor)"
          }}
        >
          <i className={`${typeConfig.icon} mb-0 ${typeConfig.iconColor} me-2`} />
          <strong className={`${typeConfig.titleColor} me-auto`}>
            {title}
          </strong>
          {time && <small className="text-muted">{time}</small>}
          {showCloseButton && (
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={handleClose}
            />
          )}
        </div>
        <div 
          className="toast-body text-primary" 
          style={{
            backgroundColor: "var(--bgLightColor)",
            borderColor: "var(--bgDarkColor)"
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default Toast;
