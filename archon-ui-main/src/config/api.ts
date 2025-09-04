/**
 * Unified API Configuration
 * 
 * This module provides centralized configuration for API endpoints
 * and handles different environments (development, Docker, production)
 */

// Get the API URL from environment or construct it
export function getApiUrl(): string {
  // For relative URLs in production (goes through proxy)
  if (import.meta.env.PROD) return '';

  // SSR/test: avoid touching window; allow explicit override
  if (typeof window === 'undefined') {
    const envUrl = (import.meta.env as any).VITE_API_URL || '';
    if (envUrl) console.log('[Archon] getApiUrl(): non-browser env → VITE_API_URL =', envUrl);
    return envUrl;
  }

  // Browser (dev): construct from current location
  const protocol = window.location.protocol;
  const host = window.location.hostname;
  const port = import.meta.env.VITE_ARCHON_SERVER_PORT || '8181';
  const url = `${protocol}//${host}:${port}`;
  console.log('[Archon] getApiUrl(): browser dev →', url);
  return url;
}

// Get the base path for API endpoints
export function getApiBasePath(): string {
  const apiUrl = getApiUrl();
  
  // If using relative URLs (empty string), just return /api
  if (!apiUrl) {
    return '/api';
  }
  
  // Otherwise, append /api to the base URL
  return `${apiUrl}/api`;
}

// Get WebSocket URL for real-time connections
export function getWebSocketUrl(): string {
  const apiUrl = getApiUrl();
  
  // If using relative URLs, construct from current location
  if (!apiUrl) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}`;
  }
  
  // Convert http/https to ws/wss
  return apiUrl.replace(/^http/, 'ws');
}

// Export commonly used values
export const API_BASE_URL = '/api';  // Always use relative URL for API calls
export const API_FULL_URL = getApiUrl();
export const WS_URL = getWebSocketUrl();
