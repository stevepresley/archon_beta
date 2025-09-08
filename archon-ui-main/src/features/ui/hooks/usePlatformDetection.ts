import { useEffect, useState } from "react";

export interface PlatformInfo {
  platform: "ios" | "android" | "desktop";
  isMobile: boolean;
  isTouch: boolean;
  supportsShare: boolean;
  userAgent: string;
}

/**
 * Hook for detecting the user's platform and capabilities
 * Detects iOS, Android, desktop and various device capabilities
 */
export function usePlatformDetection(): PlatformInfo {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(() => {
    // Server-side rendering safe defaults
    if (typeof window === "undefined") {
      return {
        platform: "desktop",
        isMobile: false,
        isTouch: false,
        supportsShare: false,
        userAgent: "",
      };
    }

    return detectPlatform();
  });

  useEffect(() => {
    // Client-side detection after hydration
    if (typeof window !== "undefined") {
      setPlatformInfo(detectPlatform());
    }
  }, []);

  return platformInfo;
}

function detectPlatform(): PlatformInfo {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Platform detection
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isMobile = isIOS || isAndroid;
  
  // Touch detection - check for touch capabilities
  const isTouch = 
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - legacy property
    navigator.msMaxTouchPoints > 0;
  
  // Share API support detection
  const supportsShare = 
    typeof navigator !== "undefined" && 
    "share" in navigator &&
    typeof navigator.share === "function";

  let platform: "ios" | "android" | "desktop";
  if (isIOS) {
    platform = "ios";
  } else if (isAndroid) {
    platform = "android";
  } else {
    platform = "desktop";
  }

  return {
    platform,
    isMobile,
    isTouch,
    supportsShare,
    userAgent: navigator.userAgent,
  };
}