let loaded: Promise<TurnstileApi> | null = null;

function loadScript(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (loaded) return loaded;
  loaded = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error('Turnstile did not initialize'));
    };
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });
  return loaded;
}

export const turnstileLoader = {
  async render(
    el: HTMLElement,
    siteKey: string,
    idempotencyKey: string,
    onVerify: (token: string) => void,
  ): Promise<string> {
    const turnstile = await loadScript();
    return turnstile.render(el, {
      sitekey: siteKey,
      idempotency_key: idempotencyKey,
      callback: onVerify,
      'expired-callback': () => onVerify(''),
      'error-callback': () => onVerify(''),
    });
  },
  reset(id: string): void {
    window.turnstile?.reset(id);
  },
};
