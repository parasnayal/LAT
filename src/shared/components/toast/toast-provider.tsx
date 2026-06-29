"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import styles from "./toast.module.scss";

type ToastVariant = "success" | "error";

type Toast = {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.viewport} aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <section className={`${styles.toast} ${styles[toast.variant]}`} key={toast.id}>
            <p className={styles.title}>{toast.title}</p>
            {toast.message ? <p className={styles.message}>{toast.message}</p> : null}
          </section>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
