import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useCopyToClipboard } from "./useCopyToClipboard";

export interface ShiftClickCopyOptions {
  /**
   * Generate the URL path for this item
   */
  getUrlPath: () => string;
  
  /**
   * Optional callback when copy succeeds
   */
  onCopySuccess?: (url: string) => void;
  
  /**
   * Optional callback when copy fails
   */
  onCopyError?: (error: Error) => void;
}

export interface ShiftClickCopyResult {
  isCopied: boolean;
  handleShiftClick: (e: React.MouseEvent) => void;
  resetCopied: () => void;
}

/**
 * Hook for handling Shift+Click copy functionality on deep linkable components
 * Generates full URLs and copies them to clipboard when Shift+Click is detected
 */
export function useShiftClickCopy(options: ShiftClickCopyOptions): ShiftClickCopyResult {
  const { getUrlPath, onCopySuccess, onCopyError } = options;
  const location = useLocation();
  const { isCopied, copyToClipboard, resetCopied } = useCopyToClipboard();

  const handleShiftClick = useCallback(async (e: React.MouseEvent) => {
    // Only handle Shift+Click events
    if (!e.shiftKey) {
      return;
    }

    // Prevent default click behavior
    e.preventDefault();
    e.stopPropagation();

    try {
      // Generate the full URL
      const urlPath = getUrlPath();
      const fullUrl = `${window.location.origin}${urlPath}`;
      
      // Copy to clipboard
      const success = await copyToClipboard(fullUrl);
      
      if (success) {
        onCopySuccess?.(fullUrl);
      } else {
        throw new Error("Failed to copy URL to clipboard");
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      onCopyError?.(err);
      console.error("Shift+Click copy failed:", err);
    }
  }, [getUrlPath, copyToClipboard, onCopySuccess, onCopyError]);

  return {
    isCopied,
    handleShiftClick,
    resetCopied,
  };
}