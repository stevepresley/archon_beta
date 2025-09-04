/**
 * Unified API Configuration
 * 
 * This module provides centralized configuration for API endpoints
 * and handles different environments (development, Docker, production)
 */

// Get the API URL from environment or construct it
export function getApiUrl(): string {
  // For relative URLs in production (goes through proxy)
  if (import.meta.env.PROD) {
    return '';
  }

  // Always construct from current window location for development
  // This ensures remote access works properly regardless of VITE_API_URL
  const protocol = window.location.protocol;
  const host = window.location.hostname;
  // Use configured port or default to 8181
  const port = import.meta.env.VITE_ARCHON_SERVER_PORT || '8181';
  
  console.log(`[Archon] Constructing API URL: ${protocol}//${host}:${port}`);
  
  return `${protocol}//${host}:${port}`;
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

// Lazy-evaluated exports to avoid calling getApiUrl/getWebSocketUrl at module load time
let _apiFullUrl: string | null = null;
let _wsUrl: string | null = null;

export const getApiFullUrl = (): string => {
  if (_apiFullUrl === null) {
    _apiFullUrl = getApiUrl();
  }
  return _apiFullUrl;
};

export const getWsUrl = (): string => {
  if (_wsUrl === null) {
    _wsUrl = getWebSocketUrl();
  }
  return _wsUrl;
};

// Legacy exports for backward compatibility (lazy-evaluated)
export const API_FULL_URL = getApiFullUrl();
export const WS_URL = getWsUrl();
