import { useCallback, useState } from "react";

export interface CopyToClipboardResult {
  isCopied: boolean;
  copyToClipboard: (text: string) => Promise<boolean>;
  resetCopied: () => void;
}

/**
 * Hook for copying text to clipboard with feedback state
 * Includes fallback for browsers without Clipboard API support
 */
export function useCopyToClipboard(resetDelay = 2000): CopyToClipboardResult {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      // Modern Clipboard API (preferred)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        
        if (resetDelay > 0) {
          setTimeout(() => setIsCopied(false), resetDelay);
        }
        
        return true;
      }
      
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      textArea.style.opacity = "0";
      
      document.body.prepend(textArea);
      textArea.select();
      
      const success = document.execCommand("copy");
      textArea.remove();
      
      if (success) {
        setIsCopied(true);
        
        if (resetDelay > 0) {
          setTimeout(() => setIsCopied(false), resetDelay);
        }
      }
      
      return success;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  }, [resetDelay]);

  const resetCopied = useCallback(() => {
    setIsCopied(false);
  }, []);

  return {
    isCopied,
    copyToClipboard,
    resetCopied,
  };
}