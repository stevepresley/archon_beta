import { Copy, Link, Share } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { cn } from "../primitives/styles";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { usePlatformDetection } from "../hooks/usePlatformDetection";
import { useToast } from "../hooks/useToast";

export interface MobileCopyButtonProps {
  url: string;
  title?: string;
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

/**
 * Mobile-optimized copy button with native Share API support
 * Uses native sharing when available, falls back to clipboard copy
 */
export const MobileCopyButton: React.FC<MobileCopyButtonProps> = ({
  url,
  title = "Share",
  text,
  className,
  size = "md",
  showText = false,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const { supportsShare, isMobile } = usePlatformDetection();
  const { copyToClipboard } = useCopyToClipboard(0); // No auto-reset for mobile
  const { showToast } = useToast();

  const handleShare = useCallback(async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      if (supportsShare) {
        // Use native Share API
        await navigator.share({
          title,
          text,
          url,
        });
        
        // Show success toast for native sharing
        showToast("Shared successfully!", "success");
      } else {
        // Fallback to clipboard copy
        const success = await copyToClipboard(url);
        if (success) {
          showToast("Link copied to clipboard!", "success");
        } else {
          showToast("Failed to copy link", "error");
        }
      }
    } catch (error) {
      // Handle native share cancellation or errors
      if (error instanceof Error && error.name === "AbortError") {
        // User cancelled sharing - no error toast needed
        return;
      }
      
      // Try fallback to clipboard on share error
      try {
        const success = await copyToClipboard(url);
        if (success) {
          showToast("Link copied to clipboard!", "success");
        } else {
          showToast("Failed to copy link", "error");
        }
      } catch (fallbackError) {
        console.error("Share and copy both failed:", error, fallbackError);
        showToast("Failed to share or copy link", "error");
      }
    } finally {
      setIsSharing(false);
    }
  }, [url, title, text, supportsShare, copyToClipboard, showToast, isSharing]);

  // Size configurations
  const sizeConfig = {
    sm: {
      button: "w-8 h-8 min-w-[32px] min-h-[32px]", // Still meets 44px touch target with padding
      icon: "w-3 h-3",
      text: "text-xs",
    },
    md: {
      button: "w-11 h-11 min-w-[44px] min-h-[44px]", // 44px touch target
      icon: "w-4 h-4",
      text: "text-sm",
    },
    lg: {
      button: "w-12 h-12 min-w-[48px] min-h-[48px]", // Larger touch target
      icon: "w-5 h-5",
      text: "text-base",
    },
  };

  const config = sizeConfig[size];
  const icon = supportsShare ? <Share className={config.icon} /> : <Copy className={config.icon} />;

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isSharing}
      className={cn(
        // Base styling
        "inline-flex items-center justify-center rounded-full",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "active:scale-95", // Touch feedback
        
        // Size and touch target
        config.button,
        
        // Colors and states
        isMobile
          ? "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
        
        // Disabled state
        isSharing && "opacity-50 cursor-not-allowed",
        
        // Shadow for mobile
        isMobile && "shadow-lg hover:shadow-xl active:shadow-md",
        
        className
      )}
      title={supportsShare ? `Share ${title}` : `Copy ${title} link`}
      aria-label={supportsShare ? `Share ${title}` : `Copy ${title} link to clipboard`}
    >
      {isSharing ? (
        <div className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", config.icon)} />
      ) : (
        icon
      )}
    </button>
  );
};