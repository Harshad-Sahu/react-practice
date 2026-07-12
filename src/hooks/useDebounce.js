import { useEffect, useState } from "react";

/**
 * Custom hook that delays updating a value until the user has stopped typing.
 * This is useful for search inputs so we do not fire network requests on every keystroke.
 *
 * @param {unknown} value - The current value we want to debounce.
 * @param {number} delay - Delay in milliseconds before the debounced value updates.
 * @returns {unknown} The debounced value.
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
