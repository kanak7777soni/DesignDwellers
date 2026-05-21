export function scheduleIdleTask(callback: () => void, timeout = 1200) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const idleWindow = window as Window & {
    requestIdleCallback?: (handler: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

  if (idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback) {
    const handle = idleWindow.requestIdleCallback(callback, { timeout });
    return () => idleWindow.cancelIdleCallback?.(handle);
  }

  const handle = window.setTimeout(callback, Math.min(timeout, 250));
  return () => window.clearTimeout(handle);
}
