import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { URLError, URLErrorType } from "../utils/urlValidation";

/**
 * Hook for handling URL validation errors and fallback navigation
 * Phase 3: Error Handling & Invalid URL Fallbacks
 */
export const useURLErrorHandling = () => {
  const navigate = useNavigate();
  const [currentError, setCurrentError] = useState<URLError | null>(null);

  const handleURLError = useCallback(
    (errorType: URLErrorType, context?: { projectId?: string; taskId?: string; docId?: string }) => {
      let error: URLError;

      switch (errorType) {
        case "malformed_url":
          error = {
            type: errorType,
            message: "Invalid URL format. Redirecting to projects list.",
            redirectTo: "/projects",
          };
          console.error("Invalid URL format detected:", { projectId: context?.projectId, taskId: context?.taskId, docId: context?.docId });
          break;

        case "project_not_found":
          error = {
            type: errorType,
            message: `Project not found. Redirecting to projects list.`,
            redirectTo: "/projects",
          };
          console.error("Project not found:", context?.projectId);
          break;

        case "task_not_found":
          error = {
            type: errorType,
            message: `Task not found in project.`,
            redirectTo: context?.projectId ? `/projects/${context.projectId}` : "/projects",
          };
          console.error("Task not found:", { projectId: context?.projectId, taskId: context?.taskId });
          break;

        case "document_not_found":
          error = {
            type: errorType,
            message: `Document not found in project.`,
            redirectTo: context?.projectId ? `/projects/${context.projectId}/docs` : "/projects",
          };
          console.error("Document not found:", { projectId: context?.projectId, docId: context?.docId });
          break;

        default:
          error = {
            type: "malformed_url",
            message: "Unknown error. Redirecting to projects list.",
            redirectTo: "/projects",
          };
      }

      setCurrentError(error);

      // Navigate to fallback after a brief delay to show the error
      setTimeout(() => {
        if (error.redirectTo) {
          navigate(error.redirectTo, { replace: true });
        }
        setCurrentError(null);
      }, 1500);
    },
    [navigate]
  );

  const clearError = useCallback(() => {
    setCurrentError(null);
  }, []);

  return {
    currentError,
    handleURLError,
    clearError,
  };
};