import type React from "react";
import { useState } from "react";
import { cn } from "../primitives/styles";

export interface CopyTooltipProps {
  children: React.ReactNode;
  isCopied?: boolean;
  showTooltip?: boolean;
  className?: string;
}

/**
 * Tooltip component that shows copy instructions and feedback
 * Shows "Shift+Click to copy URL" on hover, "Copied!" when copy succeeds
 */
export const CopyTooltip: React.FC<CopyTooltipProps> = ({
  children,
  isCopied = false,
  showTooltip = true,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const shouldShowTooltip = showTooltip && (isHovered || isCopied);
  const tooltipText = isCopied ? "Copied!" : "Shift+Click to copy URL";

  return (
    <div 
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {shouldShowTooltip && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs font-medium text-white rounded-md shadow-lg pointer-events-none",
            "transition-all duration-200 ease-out",
            "whitespace-nowrap",
            // Position above the element by default
            "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
            // Styling based on copy state
            isCopied
              ? "bg-green-600 dark:bg-green-500"
              : "bg-gray-900 dark:bg-gray-700",
            // Animation
            shouldShowTooltip 
              ? "opacity-100 scale-100 translate-y-0" 
              : "opacity-0 scale-95 translate-y-1"
          )}
          role="tooltip"
          aria-label={tooltipText}
        >
          {tooltipText}
          
          {/* Tooltip arrow */}
          <div
            className={cn(
              "absolute top-full left-1/2 transform -translate-x-1/2",
              "border-l-4 border-r-4 border-t-4 border-transparent",
              isCopied
                ? "border-t-green-600 dark:border-t-green-500"
                : "border-t-gray-900 dark:border-t-gray-700"
            )}
          />
        </div>
      )}
    </div>
  );
};