"use client";

import { useEffect, useRef } from "react";

/**
 * Attach to a sentinel element at the bottom of the list.
 * Calls `onIntersect` when the element enters the viewport.
 */
export function useIntersectionObserver(
  onIntersect: () => void,
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onIntersect();
    }, { threshold: 0.1, ...options });

    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect, options]);

  return ref;
}
