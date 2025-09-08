/**
 * UUID validation and URL parameter handling utilities
 * Phase 3: Error Handling & Invalid URL Fallbacks
 */

// UUID v4 regex pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid UUID v4 format
 */
export const isValidUUID = (value: string | undefined): boolean => {
  if (!value || typeof value !== 'string') return false;
  return UUID_PATTERN.test(value);
};

/**
 * Validates URL parameters for projects routing
 */
export interface URLValidationResult {
  isValid: boolean;
  errors: string[];
  projectId?: string;
  taskId?: string;
  docId?: string;
}

export const validateURLParams = (params: {
  projectId?: string;
  taskId?: string;
  docId?: string;
}): URLValidationResult => {
  const errors: string[] = [];
  
  // Project ID is always required for deep links
  if (params.projectId && !isValidUUID(params.projectId)) {
    errors.push('Invalid project ID format');
  }
  
  // Task ID validation (optional)
  if (params.taskId && !isValidUUID(params.taskId)) {
    errors.push('Invalid task ID format');
  }
  
  // Document ID validation (optional)
  if (params.docId && !isValidUUID(params.docId)) {
    errors.push('Invalid document ID format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    projectId: params.projectId,
    taskId: params.taskId,
    docId: params.docId,
  };
};

/**
 * Error types for URL validation failures
 */
export enum URLErrorType {
  MALFORMED_URL = 'malformed_url',
  PROJECT_NOT_FOUND = 'project_not_found',
  TASK_NOT_FOUND = 'task_not_found',
  DOCUMENT_NOT_FOUND = 'document_not_found',
}

export interface URLError {
  type: URLErrorType;
  message: string;
  redirectTo?: string;
}