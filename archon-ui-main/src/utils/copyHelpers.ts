/**
 * Enhanced copy utilities with deep link URL construction and mobile compatibility
 */

import { useToast } from '../contexts/ToastContext';

export type CopyButtonType = 'project' | 'task' | 'document';

/**
 * Construct deep link URLs for different content types
 */
export const constructDeepLinkUrl = (
  type: CopyButtonType,
  projectId: string,
  itemId?: string,
  currentView?: 'table' | 'board'
): string => {
  const origin = window.location.origin;
  
  switch (type) {
    case 'project':
      return `${origin}/projects/${projectId}`;
    case 'task':
      const view = currentView ? `?view=${currentView}` : '';
      return `${origin}/projects/${projectId}/tasks/${itemId}${view}`;
    case 'document':
      return `${origin}/projects/${projectId}/docs/${itemId}`;
    default:
      return `${origin}/projects/${projectId}`;
  }
};

/**
 * iOS/Android compatible clipboard copy with fallback
 */
export const copyToClipboardWithFallback = async (text: string): Promise<boolean> => {
  // Modern clipboard API (preferred for HTTPS contexts)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Only use fallback if modern API fails
      return copyTextUsingInput(text);
    }
  }
  
  // Fallback using temporary input element (works on mobile)
  return copyTextUsingInput(text);
};

/**
 * Fallback copy method using temporary input element
 */
const copyTextUsingInput = (text: string): boolean => {
  const input = document.createElement('input');
  input.value = text;
  input.style.position = 'fixed';
  input.style.opacity = '0';
  input.style.pointerEvents = 'none';
  input.style.zIndex = '-1';
  
  document.body.appendChild(input);
  
  input.focus();
  input.select();
  input.setSelectionRange(0, text.length);
  
  const success = document.execCommand('copy');
  document.body.removeChild(input);
  
  return success;
};

/**
 * Enhanced copy click handler with shift-click support
 */
export const handleCopyClick = async (
  event: React.MouseEvent,
  type: CopyButtonType,
  projectId: string,
  itemId?: string,
  currentView?: 'table' | 'board'
): Promise<{ success: boolean; copied: 'id' | 'url'; text: string }> => {
  const isShiftClick = event.shiftKey;
  
  console.log('[COPY-DEBUG] handleCopyClick called with:', { type, projectId, itemId, isShiftClick });
  
  let textToCopy: string;
  let copied: 'id' | 'url';
  
  if (isShiftClick) {
    textToCopy = constructDeepLinkUrl(type, projectId, itemId, currentView);
    copied = 'url';
  } else {
    textToCopy = itemId || projectId;
    copied = 'id';
  }
  
  console.log('[COPY-DEBUG] About to copy:', textToCopy, 'Type:', copied);
  
  const success = await copyToClipboardWithFallback(textToCopy);
  
  console.log('[COPY-DEBUG] Copy operation result:', success);
  
  return { success, copied, text: textToCopy };
};

/**
 * Copy full URL (for dedicated Copy Link buttons)
 */
export const copyUrlToClipboard = async (
  type: CopyButtonType,
  projectId: string,
  itemId?: string,
  currentView?: 'table' | 'board'
): Promise<{ success: boolean; text: string }> => {
  const textToCopy = constructDeepLinkUrl(type, projectId, itemId, currentView);
  const success = await copyToClipboardWithFallback(textToCopy);
  
  return { success, text: textToCopy };
};