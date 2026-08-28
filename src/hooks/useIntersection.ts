import { useState, useEffect, useRef } from 'react';

export function useIntersection(rootMargin = '100px') {
  const [isVisible, setIsVisible] = useState(true);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin,
        threshold: 0.05,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return { isVisible, elementRef };
}
