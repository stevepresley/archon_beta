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
  console.log('[COPY-DEBUG] Starting copy process for:', text.substring(0, 50) + '...');
  
  // Modern clipboard API (preferred for HTTPS contexts)
  if (navigator.clipboard && window.isSecureContext) {
    console.log('[COPY-DEBUG] Using modern clipboard API');
    try {
      await navigator.clipboard.writeText(text);
      console.log('[COPY-DEBUG] Modern clipboard API succeeded');
      return true;
    } catch (err) {
      console.log('[COPY-DEBUG] Modern clipboard API failed, trying fallback:', err);
      // Only use fallback if modern API fails
      const fallbackResult = copyTextUsingInput(text);
      console.log('[COPY-DEBUG] Fallback result:', fallbackResult);
      return fallbackResult;
    }
  }
  
  // Fallback using temporary input element (works on mobile)
  console.log('[COPY-DEBUG] No modern clipboard API, using fallback');
  const fallbackResult = copyTextUsingInput(text);
  console.log('[COPY-DEBUG] Fallback result:', fallbackResult);
  return fallbackResult;
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
  
  let textToCopy: string;
  let copied: 'id' | 'url';
  
  if (isShiftClick) {
    textToCopy = constructDeepLinkUrl(type, projectId, itemId, currentView);
    copied = 'url';
  } else {
    textToCopy = itemId || projectId;
    copied = 'id';
  }
  
  const success = await copyToClipboardWithFallback(textToCopy);
  
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