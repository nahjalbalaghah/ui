import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseTextReference } from '@/app/utils/text-reference';

interface UseTextRefHighlightOptions {
  onHighlight?: (refNumber: string) => void;
}

/**
 * Hook to handle text reference highlighting on detail pages
 * Extracts the highlightRef from URL params and provides utilities for highlighting
 */
export function useTextRefHighlight(options?: UseTextRefHighlightOptions) {
  const searchParams = useSearchParams();
  const [highlightRef, setHighlightRef] = useState<string | null>(null);
  const [isHighlighting, setIsHighlighting] = useState(false);

  // Extract highlight ref from URL
  useEffect(() => {
    const ref = searchParams?.get('highlightRef');
    if (ref) {
      setHighlightRef(ref);
      // Parse to validate
      const parsed = parseTextReference(ref);
      if (parsed && options?.onHighlight) {
        // Call after component mounts to ensure DOM is ready
        const timer = setTimeout(() => {
          options.onHighlight!(ref);
          setIsHighlighting(true);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, options]);

  const scrollToAndHighlight = useCallback((refNumber: string) => {
    // Find element with data-text-ref attribute
    const element = document.querySelector(`[data-text-ref="${refNumber}"]`);
    if (element) {
      // Scroll into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Add highlight animation
      element.classList.add('highlight-text-ref');

      // Remove highlight after animation
      const timeout = setTimeout(() => {
        element.classList.remove('highlight-text-ref');
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, []);

  const clearHighlight = useCallback(() => {
    setHighlightRef(null);
    setIsHighlighting(false);

    // Remove all highlights
    document.querySelectorAll('[data-text-ref].highlight-text-ref').forEach((el) => {
      el.classList.remove('highlight-text-ref');
    });
  }, []);

  return {
    highlightRef,
    isHighlighting,
    scrollToAndHighlight,
    clearHighlight,
  };
}
