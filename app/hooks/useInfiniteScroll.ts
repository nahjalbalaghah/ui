import { useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  isLoading: boolean;
  loadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isLoading,
  loadMore,
  threshold = 300
}: UseInfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadMore();
      }
    }, {
      rootMargin: `${threshold}px`,
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasNextPage, loadMore, threshold]);

  return { lastElementRef };
};
