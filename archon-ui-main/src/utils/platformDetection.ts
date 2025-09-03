/**
 * Platform detection utilities for handling device-specific behavior
 */

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

export const isMobile = (): boolean => {
  return isIOS() || isAndroid() || window.innerWidth <= 768;
};

export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const needsCopyLinkButton = (): boolean => {
  // Show separate Copy Link button on mobile platforms where clipboard API may be limited
  return isIOS() || isAndroid();
};