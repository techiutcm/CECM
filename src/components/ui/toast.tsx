"use client";

import { cn } from "@/lib/utils";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastVariant = "default" | "success" | "error";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (input: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((input: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...input, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md",
              item.variant === "success" && "border-emerald-200 bg-emerald-50/95",
              item.variant === "error" && "border-red-200 bg-red-50/95",
              item.variant === "default" && "border-white/70 bg-white/95",
            )}
          >
            <p className="font-montserrat text-sm font-semibold text-[#083148]">{item.title}</p>
            {item.description && (
              <p className="font-montserrat mt-1 text-sm text-[#083148]/70">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }
  return context;
}
