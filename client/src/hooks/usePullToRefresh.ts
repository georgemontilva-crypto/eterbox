import { useEffect, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
}: UsePullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Only enable on mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if scrolled to top
      if (container.scrollTop > 0) return;
      
      startY = e.touches[0].clientY;
      touchStartY.current = startY;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || isRefreshing) return;
      
      currentY = e.touches[0].clientY;
      const distance = currentY - startY;

      // Only allow pull down when at top
      if (distance > 0 && container.scrollTop === 0) {
        // Prevent default scroll behavior
        e.preventDefault();
        
        // Apply resistance to make it feel natural
        const resistedDistance = distance / resistance;
        setPullDistance(Math.min(resistedDistance, threshold * 1.5));
      }
    };

    const handleTouchEnd = async () => {
      if (!isDragging) return;
      isDragging = false;

      const distance = pullDistance * resistance;

      if (distance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        setPullDistance(threshold / resistance);

        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        // Animate back to 0
        setPullDistance(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, threshold, resistance, isRefreshing, pullDistance]);

  return {
    containerRef,
    isRefreshing,
    pullDistance,
  };
}
