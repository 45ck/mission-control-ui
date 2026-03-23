import { useState, useCallback, useRef, useEffect } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  /** If provided, shows an undo button and calls this on click */
  onUndo?: () => void;
}

let nextId = 0;

export function useToast(duration = 4000) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, type: Toast['type'] = 'info', onUndo?: () => void) => {
      const id = `toast-${++nextId}`;
      const toast: Toast = { id, message, type, onUndo };
      setToasts((prev) => [...prev, toast]);

      const timer = setTimeout(() => {
        timers.current.delete(id);
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
      timers.current.set(id, timer);

      return id;
    },
    [duration],
  );

  return { toasts, show, dismiss } as const;
}
