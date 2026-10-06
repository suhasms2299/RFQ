import React, { useEffect, useState } from 'react';

export default function ValidityCountdown({ value }: { value: string }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((tick) => tick + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const remaining = new Date(value).getTime() - Date.now();
  if (remaining <= 0) return <>Expired</>;
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return <>{days > 0 ? `${days}d ` : ''}{hours}h {minutes}m {String(seconds).padStart(2, '0')}s</>;
}