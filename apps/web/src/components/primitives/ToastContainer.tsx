import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Toast } from '../../hooks/useToast';
import { semantic } from '../../theme/tokens';

const typeStyles: Record<Toast['type'], { bg: string; border: string; text: string }> = {
  success: { bg: semantic.successSoft, border: semantic.success, text: semantic.successMuted },
  error: { bg: semantic.errorSoft, border: semantic.error, text: semantic.error },
  info: { bg: semantic.infoSoft, border: semantic.info, text: semantic.info },
};

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2"
      aria-live="polite"
      role="status"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = typeStyles[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-center gap-3 border px-4 py-2.5 shadow-md"
              style={{
                backgroundColor: style.bg,
                borderColor: style.border,
                minWidth: 260,
                maxWidth: 400,
              }}
            >
              <span className="aw-body-sm flex-1" style={{ color: style.text }}>
                {toast.message}
              </span>
              {toast.onUndo && (
                <button
                  onClick={() => {
                    toast.onUndo?.();
                    onDismiss(toast.id);
                  }}
                  className="aw-micro aw-focus-ring border px-2 py-0.5 transition-colors hover:bg-[var(--color-aw-haze)]"
                  style={{ borderColor: style.border, color: style.text }}
                >
                  UNDO
                </button>
              )}
              <button
                onClick={() => onDismiss(toast.id)}
                className="aw-focus-ring shrink-0 transition-opacity hover:opacity-70"
              >
                <X className="h-3 w-3" style={{ color: style.text }} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
