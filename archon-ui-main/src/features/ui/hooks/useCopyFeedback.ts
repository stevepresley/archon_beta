import { useCallback, useState } from "react";
import { useCopyToClipboard } from "./useCopyToClipboard";
import { usePlatformDetection } from "./usePlatformDetection";
import { useToast } from "./useToast";

export interface CopyFeedbackOptions {
  /**
   * Success message for copy operations
   */
  successMessage?: string;
  
  /**
   * Error message for failed copy operations
   */
  errorMessage?: string;
  
  /**
   * Auto-reset delay for feedback states (ms)
   */
  resetDelay?: number;
  
  /**
   * Whether to show toast notifications on mobile
   */
  showMobileToast?: boolean;
  
  /**
   * Whether to announce to screen readers
   */
  announceToScreenReader?: boolean;
  
  /**
   * Callback when copy succeeds
   */
  onCopySuccess?: (text: string) => void;
  
  /**
   * Callback when copy fails
   */
  onCopyError?: (error: Error) => void;
}

export interface CopyFeedbackResult {
  // State
  isCopied: boolean;
  isError: boolean;
  announcementMessage: string;
  
  // Actions
  copyToClipboard: (text: string) => Promise<boolean>;
  reset: () => void;
  
  // Platform info
  isMobile: boolean;
  supportsShare: boolean;
}

/**
 * Comprehensive copy feedback hook with accessibility support
 * Provides visual, audio, and screen reader feedback for copy operations
 */
export function useCopyFeedback(options: CopyFeedbackOptions = {}): CopyFeedbackResult {
  const {
    successMessage = "Copied to clipboard",
    errorMessage = "Failed to copy",
    resetDelay = 2000,
    showMobileToast = true,
    announceToScreenReader = true,
    onCopySuccess,
    onCopyError,
  } = options;

  const [isError, setIsError] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState("");
  
  const { isCopied, copyToClipboard: baseCopy, resetCopied } = useCopyToClipboard(resetDelay);
  const { isMobile, supportsShare } = usePlatformDetection();
  const { showToast } = useToast();

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      setIsError(false);
      setAnnouncementMessage("");
      
      const success = await baseCopy(text);
      
      if (success) {
        // Success feedback
        if (announceToScreenReader) {
          setAnnouncementMessage(successMessage);
        }
        
        if (showMobileToast && isMobile) {
          showToast(successMessage, "success");
        }
        
        onCopySuccess?.(text);
        return true;
      } else {
        throw new Error("Copy operation failed");
      }
    } catch (error) {
      // Error feedback
      setIsError(true);
      
      const err = error instanceof Error ? error : new Error("Unknown copy error");
      
      if (announceToScreenReader) {
        setAnnouncementMessage(`${errorMessage}: ${err.message}`);
      }
      
      if (showMobileToast && isMobile) {
        showToast(`${errorMessage}: ${err.message}`, "error");
      }
      
      onCopyError?.(err);
      
      // Reset error state after delay
      if (resetDelay > 0) {
        setTimeout(() => setIsError(false), resetDelay);
      }
      
      return false;
    }
  }, [
    baseCopy,
    successMessage,
    errorMessage,
    announceToScreenReader,
    showMobileToast,
    isMobile,
    showToast,
    onCopySuccess,
    onCopyError,
    resetDelay,
  ]);

  const reset = useCallback(() => {
    resetCopied();
    setIsError(false);
    setAnnouncementMessage("");
  }, [resetCopied]);

  return {
    // State
    isCopied,
    isError,
    announcementMessage,
    
    // Actions
    copyToClipboard,
    reset,
    
    // Platform info
    isMobile,
    supportsShare,
  };
}