import React, { useEffect, useState } from "react";

export const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const closeTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const icons = {
    success: "✓",
    error: "✕",
    info: "ⓘ",
    warning: "⚠"
  };

  const colors = {
    success: "var(--clr-primary)",
    error: "#e87070",
    info: "var(--clr-accent-2)",
    warning: "#f4a261"
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 20px",
        background: "var(--clr-bg-2)",
        border: `1px solid ${colors[type]}30`,
        borderLeft: `3px solid ${colors[type]}`,
        color: "var(--clr-text)",
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        fontWeight: 300,
        letterSpacing: "0.02em",
        maxWidth: "320px",
        cursor: "pointer",
        boxShadow: "var(--shadow-md)",
        transform: visible ? "translateX(0) scale(1)" : "translateX(120%) scale(0.9)",
        opacity: visible ? 1 : 0,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <span
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: `${colors[type]}20`,
          color: colors[type],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {icons[type]}
      </span>
      {message}
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};