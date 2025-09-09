import {
  BookOpen,
  Briefcase,
  Clipboard,
  Code,
  Database,
  FileCode,
  FileText,
  Info,
  Rocket,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../../ui/primitives";
import { CopyTooltip } from "../../../ui/components/CopyTooltip";
import { MobileCopyButton } from "../../../ui/components/MobileCopyButton";
import { useUniversalCopy } from "../../../ui/hooks/useUniversalCopy";
import { useToast } from "../../../ui/hooks/useToast";
import type { DocumentCardProps, DocumentType } from "../types";

const getDocumentIcon = (type?: DocumentType) => {
  switch (type) {
    case "prp":
      return <Rocket className="w-4 h-4" />;
    case "technical":
      return <Code className="w-4 h-4" />;
    case "business":
      return <Briefcase className="w-4 h-4" />;
    case "meeting_notes":
      return <Users className="w-4 h-4" />;
    case "spec":
      return <FileText className="w-4 h-4" />;
    case "design":
      return <Database className="w-4 h-4" />;
    case "api":
      return <FileCode className="w-4 h-4" />;
    case "guide":
      return <BookOpen className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
};

const getTypeColor = (type?: DocumentType) => {
  switch (type) {
    case "prp":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
    case "technical":
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30";
    case "business":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
    case "meeting_notes":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30";
    case "spec":
      return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
    case "design":
      return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30";
    case "api":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
    case "guide":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30";
  }
};

export const DocumentCard = memo(({ document, isActive, projectId, onSelect, onDelete }: DocumentCardProps) => {
  const [showDelete, setShowDelete] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Ref for auto-scroll functionality
  const cardRef = useRef<HTMLDivElement>(null);

  // Universal copy functionality (desktop + mobile)
  const { isCopied: isUrlCopied, handleShiftClick, copyUrl, isMobile, isTouch } = useUniversalCopy({
    getUrlPath: () => `/projects/${projectId}/docs/${document.id}`,
    title: document.title,
    text: `Check out this document: ${document.title}`,
  });

  // Auto-scroll to selected document (for deep URL navigation)
  useEffect(() => {
    if (isActive && cardRef.current) {
      // Delay scroll to allow for component mounting and DOM updates
      const timer = setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleCopyIdClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (e.shiftKey) {
        // Shift+Click: Copy full URL
        handleShiftClick(e);
      } else {
        // Regular click: Copy just the document ID
        try {
          await navigator.clipboard.writeText(document.id);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy document ID:', err);
        }
      }
    },
    [document.id, handleShiftClick],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(document);
    },
    [document, onDelete],
  );

  const handleClick = (e: React.MouseEvent) => {
    handleShiftClick(e);
    if (!e.shiftKey) {
      onSelect(document);
    }
  };

  return (
    <CopyTooltip isCopied={isUrlCopied}>
      {/* biome-ignore lint/a11y/useSemanticElements: Complex card with nested interactive elements - semantic button would break layout */}
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(document);
          }
        }}
        className={`
          relative flex-shrink-0 w-48 p-4 rounded-lg cursor-pointer
          transition-all duration-200 group
          ${
            isActive
              ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 shadow-lg scale-105"
              : "bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
          }
        `}
        onClick={handleClick}
        onMouseEnter={() => setShowDelete(true)}
        onMouseLeave={() => setShowDelete(false)}
      >
      {/* Document Type Badge */}
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2 border ${getTypeColor(
          document.document_type as DocumentType,
        )}`}
      >
        {getDocumentIcon(document.document_type as DocumentType)}
        <span>{document.document_type || "document"}</span>
      </div>

      {/* Title */}
      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">{document.title}</h4>

      {/* Metadata */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {new Date(document.updated_at || document.created_at || Date.now()).toLocaleDateString()}
      </p>

      {/* ID Display Section - Always visible for active, hover for others */}
      <div
        className={`flex items-center justify-between mt-2 ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        } transition-opacity duration-200`}
      >
        <span className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[80px]" title={document.id}>
          {document.id.slice(0, 8)}...
        </span>
        
        <div className="flex items-center gap-1">
          {/* Mobile copy button for document URL */}
          {(isMobile || isTouch) && (
            <MobileCopyButton
              url={copyUrl}
              title={document.title}
              text={`Check out this document: ${document.title}`}
              size="sm"
              showText={false} // Keep compact for document card
            />
          )}
          
          {/* Desktop ID copy button with Shift+Click for URL */}
          {!(isMobile || isTouch) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyIdClick}
              className="p-1 h-auto min-h-0"
              title="Shift-click to copy URL"
              aria-label="Copy Document ID to clipboard"
            >
              {isCopied ? (
                <span className="text-green-500 text-xs">✓</span>
              ) : (
                <Clipboard className="w-3 h-3" aria-hidden="true" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Delete Button */}
      {showDelete && !isActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1 h-auto min-h-0 text-red-600 dark:text-red-400 hover:bg-red-500/20"
          aria-label={`Delete ${document.title}`}
          title="Delete document"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </Button>
      )}
      </div>
    </CopyTooltip>
  );
});

DocumentCard.displayName = "DocumentCard";
