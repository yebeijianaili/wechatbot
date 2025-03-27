"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void
}>({
  toast: () => {},
})

export type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { ...props, id }])
    if (props.duration !== Infinity) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, props.duration || 5000)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              "p-4 rounded-md shadow-lg max-w-md transform transition-all duration-300 opacity-100 translate-y-0 bg-background border",
              t.variant === "destructive" ? "border-destructive text-destructive" : "border-border"
            )}
          >
            <div className="font-semibold">{t.title}</div>
            {t.description && <div className="text-sm mt-1 text-muted-foreground">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within a ToastProvider")
  return context
} 