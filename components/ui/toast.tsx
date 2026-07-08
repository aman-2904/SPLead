import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  message,
  type = "info",
  isOpen,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            "fixed bottom-6 right-6 z-50 p-4 rounded-xl border flex items-center gap-3 shadow-lg elegant-glow min-w-[280px]",
            type === "success" && "bg-emerald-600/10 border-emerald-600/30 text-emerald-800",
            type === "error" && "bg-primary/10 border-primary/20 text-primary",
            type === "info" && "bg-secondary-light border-accent/20 text-primary"
          )}
        >
          {type === "success" && <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />}
          {type === "error" && <AlertCircle className="h-4.5 w-4.5 text-primary shrink-0" />}
          {type === "info" && <Info className="h-4.5 w-4.5 text-accent shrink-0" />}
          
          <span className="text-xs font-bold flex-grow text-left leading-snug">{message}</span>
          
          <button onClick={onClose} className="text-primary/50 hover:text-primary shrink-0 cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
