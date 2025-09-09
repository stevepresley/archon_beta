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
      button: showText ? "px-3 py-2 min-h-[32px]" : "w-8 h-8 min-w-[32px] min-h-[32px]",
      icon: "w-3 h-3",
      text: "text-xs",
      gap: "gap-1.5",
    },
    md: {
      button: showText ? "px-4 py-2 min-h-[44px]" : "w-11 h-11 min-w-[44px] min-h-[44px]",
      icon: "w-4 h-4",
      text: "text-sm",
      gap: "gap-2",
    },
    lg: {
      button: showText ? "px-5 py-3 min-h-[48px]" : "w-12 h-12 min-w-[48px] min-h-[48px]",
      icon: "w-5 h-5",
      text: "text-base",
      gap: "gap-2",
    },
  };

  const config = sizeConfig[size];
  
  // Better icon combination for clarity
  const renderIcon = () => {
    if (isSharing) {
      return <div className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", config.icon)} />;
    }
    
    // Always use Link icon for consistency
    return <Link className={config.icon} />;
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isSharing}
      className={cn(
        // Base styling
        "inline-flex items-center justify-center",
        showText ? "rounded-lg" : "rounded-full",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "active:scale-95", // Touch feedback
        
        // Size and touch target
        config.button,
        showText && config.gap,
        
        // Colors and states - neutral styling to match design system
        "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
        
        // Disabled state
        isSharing && "opacity-50 cursor-not-allowed",
        
        // Shadow for mobile
        isMobile && "shadow-lg hover:shadow-xl active:shadow-md",
        
        className
      )}
      title={supportsShare ? `Share ${title}` : `Copy link to ${title}`}
      aria-label={supportsShare ? `Share ${title}` : `Copy link to ${title}`}
    >
      {renderIcon()}
      {showText && (
        <span className={cn("font-medium whitespace-nowrap", config.text)}>
          {supportsShare ? "Share" : "Copy Link"}
        </span>
      )}
    </button>
  );
};