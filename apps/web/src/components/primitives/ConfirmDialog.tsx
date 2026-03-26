import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { aw, semantic, transitions } from '../../theme/tokens';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    // Focus the confirm button when dialog opens
    setTimeout(() => confirmRef.current?.focus(), 50);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  const isDanger = variant === 'danger';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={onCancel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <motion.div
            className="w-full max-w-[400px] border p-6"
            style={{ borderColor: aw.lineDark, backgroundColor: aw.paperTop }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
          >
            <h2 id="confirm-dialog-title" className="aw-section" style={{ color: aw.textStrong }}>
              {title}
            </h2>
            <p className="aw-body mt-2" style={{ color: aw.text }}>
              {description}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <motion.button
                className="aw-focus-ring aw-section-sm border px-4 py-1.5 transition-colors hover:bg-[var(--color-aw-haze)]"
                style={{ borderColor: aw.lineDark, color: aw.text }}
                whileTap={{ scale: 0.96 }}
                transition={transitions.fast}
                onClick={onCancel}
              >
                {cancelLabel}
              </motion.button>
              <motion.button
                ref={confirmRef}
                className="aw-focus-ring aw-section-sm px-4 py-1.5 transition-opacity"
                style={{
                  backgroundColor: isDanger ? semantic.error : aw.plateDark,
                  color: aw.inverse,
                }}
                whileTap={{ scale: 0.96 }}
                transition={transitions.fast}
                onClick={onConfirm}
              >
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
