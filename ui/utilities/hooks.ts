import { useState, useEffect, useRef, useCallback } from "react";

export function useDebounce<V>(value: V, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return function() {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function useThrottle<V>(value: V, delay: number = 500) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());
  useEffect(() => {
    const handler = setTimeout(function() {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return function() {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return throttledValue;
}
