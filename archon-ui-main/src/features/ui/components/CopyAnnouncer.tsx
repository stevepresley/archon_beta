import type React from "react";
import { useEffect, useRef } from "react";

export interface CopyAnnouncerProps {
  message?: string;
  isActive: boolean;
}

/**
 * Accessibility component for announcing copy operations to screen readers
 * Uses ARIA live regions to provide immediate feedback for assistive technology
 */
export const CopyAnnouncer: React.FC<CopyAnnouncerProps> = ({
  message = "Content copied to clipboard",
  isActive,
}) => {
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && announcerRef.current) {
      // Clear and set the message to ensure it's announced
      announcerRef.current.textContent = "";
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = message;
        }
      }, 10);
    }
  }, [isActive, message]);

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {/* Screen reader only - announces copy success */}
    </div>
  );
};