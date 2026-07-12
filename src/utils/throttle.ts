/**
 * Prevents scroll handler from firing too frequently.
 * Critical for performance in large lists.
 */
export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
) {
  let last = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
}
