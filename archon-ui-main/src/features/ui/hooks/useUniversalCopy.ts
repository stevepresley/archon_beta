import { useCallback } from "react";
import { useCopyFeedback } from "./useCopyFeedback";
import { usePlatformDetection } from "./usePlatformDetection";
import { useShiftClickCopy } from "./useShiftClickCopy";

export interface UniversalCopyOptions {
  /**
   * Generate the URL path for this item
   */
  getUrlPath: () => string;
  
  /**
   * Title for sharing (mobile)
   */
  title?: string;
  
  /**
   * Additional text for sharing (mobile)
   */
  text?: string;
  
  /**
   * Optional callback when copy succeeds
   */
  onCopySuccess?: (url: string) => void;
  
  /**
   * Optional callback when copy fails
   */
  onCopyError?: (error: Error) => void;
}

export interface UniversalCopyResult {
  // Desktop Shift+Click functionality
  isCopied: boolean;
  handleShiftClick: (e: React.MouseEvent) => void;
  resetCopied: () => void;
  
  // Mobile copy functionality
  copyUrl: string;
  copyToClipboard: (url: string) => Promise<boolean>;
  
  // Enhanced feedback
  isError: boolean;
  announcementMessage: string;
  reset: () => void;
  
  // Platform info
  platform: "ios" | "android" | "desktop";
  isMobile: boolean;
  isTouch: boolean;
  supportsShare: boolean;
}

/**
 * Universal copy hook that provides both desktop Shift+Click and mobile copy functionality
 * Combines platform detection with appropriate copy methods
 */
export function useUniversalCopy(options: UniversalCopyOptions): UniversalCopyResult {
  const { getUrlPath, title, text, onCopySuccess, onCopyError } = options;
  const platformInfo = usePlatformDetection();
  const copyFeedback = useCopyFeedback({
    successMessage: `${title ? `${title} ` : ""}link copied to clipboard`,
    onCopySuccess,
    onCopyError,
  });
  
  // Desktop Shift+Click functionality
  const shiftClickCopy = useShiftClickCopy({
    getUrlPath,
    onCopySuccess,
    onCopyError,
  });

  // Generate the full URL for mobile copy
  const copyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}${getUrlPath()}`;

  return {
    // Desktop functionality
    isCopied: shiftClickCopy.isCopied,
    handleShiftClick: shiftClickCopy.handleShiftClick,
    resetCopied: shiftClickCopy.resetCopied,
    
    // Mobile functionality
    copyUrl,
    copyToClipboard: copyFeedback.copyToClipboard,
    
    // Enhanced feedback
    isError: copyFeedback.isError,
    announcementMessage: copyFeedback.announcementMessage,
    reset: copyFeedback.reset,
    
    // Platform info
    platform: platformInfo.platform,
    isMobile: platformInfo.isMobile,
    isTouch: platformInfo.isTouch,
    supportsShare: platformInfo.supportsShare,
  };
}