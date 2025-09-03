/**
 * Get the base URL for API requests
 * In development: http://localhost:3000
 * In production: current domain (e.g., https://your-app.vercel.app)
 */
export function getApiBaseUrl(): string {
  // In browser environment
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    console.log('API Base URL (browser):', origin);
    return origin;
  }
  
  // In server environment (SSR)
  if (process.env.VERCEL_URL) {
    const url = `https://${process.env.VERCEL_URL}`;
    console.log('API Base URL (server):', url);
    return url;
  }
  
  // Fallback for development
  const fallback = 'http://localhost:3000';
  console.log('API Base URL (fallback):', fallback);
  return fallback;
}

/**
 * Get full API URL for a given endpoint
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${cleanEndpoint}`;
  console.log('API URL:', fullUrl);
  return fullUrl;
}
