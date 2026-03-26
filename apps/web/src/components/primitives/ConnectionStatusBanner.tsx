import { useState, useEffect, useRef } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { semantic } from '../../theme/tokens';

interface ConnectionStatusBannerProps {
  isOnline: boolean;
  wasOffline: boolean;
}

export function ConnectionStatusBanner({ isOnline, wasOffline }: ConnectionStatusBannerProps) {
  const [showRestored, setShowRestored] = useState(false);
  const prevOnlineRef = useRef(isOnline);

  useEffect(() => {
    if (isOnline && !prevOnlineRef.current) {
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3000);
      return () => clearTimeout(timer);
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline]);

  if (!isOnline) {
    return (
      <div
        role="alert"
        className="flex items-center gap-2 border px-3 py-2 text-sm"
        style={{
          backgroundColor: semantic.warningSoft,
          borderColor: semantic.warning,
          color: semantic.warning,
        }}
      >
        <WifiOff size={14} />
        <span>You are offline. Some features may be unavailable.</span>
      </div>
    );
  }

  if (showRestored && wasOffline) {
    return (
      <div
        role="status"
        className="flex items-center gap-2 border px-3 py-2 text-sm"
        style={{
          backgroundColor: semantic.successSoft,
          borderColor: semantic.success,
          color: semantic.success,
        }}
      >
        <Wifi size={14} />
        <span>Connection restored.</span>
      </div>
    );
  }

  return null;
}
