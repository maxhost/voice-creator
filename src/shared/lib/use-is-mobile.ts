'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user is on a mobile/touch device
 * Uses touch capability detection for reliability
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check for touch capability (more reliable than user agent)
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      // Also check screen width as a fallback
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(hasTouchScreen || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
