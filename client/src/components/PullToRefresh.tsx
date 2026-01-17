import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
}

export function PullToRefresh({ onRefresh, children, disabled = false }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAtTop = useRef(true);

  const PULL_THRESHOLD = 80; // Distance needed to trigger refresh
  const MAX_PULL = 120; // Maximum pull distance

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      isAtTop.current = container.scrollTop === 0;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    if (isAtTop.current) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing || !isAtTop.current) return;

    const currentTouch = e.touches[0].clientY;
    const distance = currentTouch - touchStart;

    if (distance > 0) {
      // Apply resistance curve like iOS
      const resistance = Math.min(distance * 0.5, MAX_PULL);
      setPullDistance(resistance);

      // Prevent default scroll when pulling down
      if (distance > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing) return;

    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }

    setTouchStart(0);
  };

  const getRotation = () => {
    if (isRefreshing) return 'rotate-360';
    return `rotate-${Math.min(Math.floor((pullDistance / PULL_THRESHOLD) * 360), 360)}`;
  };

  const getOpacity = () => {
    return Math.min(pullDistance / PULL_THRESHOLD, 1);
  };

  const getScale = () => {
    return Math.min(0.5 + (pullDistance / PULL_THRESHOLD) * 0.5, 1);
  };

  return (
    <div className="relative h-full overflow-hidden">
      {/* Pull to Refresh Indicator */}
      <div
        className="absolute left-0 right-0 top-0 flex items-center justify-center pointer-events-none z-50"
        style={{
          transform: `translateY(${Math.min(pullDistance - 40, 40)}px)`,
          opacity: getOpacity(),
          transition: isRefreshing || pullDistance === 0 ? 'all 0.3s ease-[cubic-bezier(0.4,0.0,0.2,1)]' : 'none',
        }}
      >
        <div
          className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-full p-3 shadow-2xl"
          style={{
            transform: `scale(${getScale()})`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <RefreshCw
            className={`w-5 h-5 text-primary transition-all duration-300 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: isRefreshing ? 'rotate(0deg)' : `rotate(${(pullDistance / PULL_THRESHOLD) * 360}deg)`,
              filter: pullDistance >= PULL_THRESHOLD ? 'drop-shadow(0 0 8px rgba(var(--primary), 0.5))' : 'none',
            }}
          />
        </div>
      </div>

      {/* Content Container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${isRefreshing ? PULL_THRESHOLD : pullDistance}px)`,
          transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-[cubic-bezier(0.4,0.0,0.2,1)]' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
