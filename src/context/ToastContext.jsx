import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, "success", dur),
    error: (msg, dur) => addToast(msg, "error", dur),
    info: (msg, dur) => addToast(msg, "info", dur),
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div style={{
      position: "fixed",
      bottom: "32px",
      right: "32px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 400);
    }, toast.duration);
    return () => { cancelAnimationFrame(show); clearTimeout(timer); };
  }, []);

  const icons = {
    success: "✓",
    error: "✕",
    info: "i",
  };

  const colors = {
    success: "var(--clr-primary)",
    error: "#e87070",
    info: "var(--clr-accent-2)",
  };

  return (
    <div
      onClick={() => onRemove(toast.id)}
      style={{
        pointerEvents: "all",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 20px",
        background: "var(--clr-bg-2)",
        border: `1px solid ${colors[toast.type]}30`,
        borderLeft: `3px solid ${colors[toast.type]}`,
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
        userSelect: "none",
      }}
    >
      <span style={{
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        background: `${colors[toast.type]}20`,
        color: colors[toast.type],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: 700,
        flexShrink: 0,
      }}>
        {icons[toast.type]}
      </span>
      {toast.message}
    </div>
  );
};

export const useToast = () => useContext(ToastContext);