import { useEffect, useRef } from 'react';
import { turnstileLoader } from '../lib/turnstileLoader';

export interface TurnstileVerification {
  token: string;
  idempotencyKey: string;
}

interface TurnstileWidgetProps {
  onVerification: (value: TurnstileVerification) => void;
  resetKey?: number;
}

export function TurnstileWidget({ onVerification, resetKey = 0 }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const callbackRef = useRef(onVerification);
  callbackRef.current = onVerification;

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!siteKey) return;

    let cancelled = false;
    const idempotencyKey = crypto.randomUUID();

    void turnstileLoader
      .render(containerRef.current!, siteKey, idempotencyKey, (token) => {
        if (!cancelled) callbackRef.current({ token, idempotencyKey });
      })
      .then((id) => {
        widgetIdRef.current = id;
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current) turnstileLoader.reset(widgetIdRef.current);
    };
  }, [resetKey]);

  return <div ref={containerRef} className="mt-4 flex justify-center" />;
}
