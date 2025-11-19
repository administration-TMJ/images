// Dynamic backend URL configuration
// Works with any domain: preview, custom domain, localhost, etc.

export const getBackendUrl = () => {
  // If REACT_APP_BACKEND_URL is set, use it (for development or specific override)
  const envBackendUrl = process.env.REACT_APP_BACKEND_URL;
  
  if (envBackendUrl && envBackendUrl.trim() !== '') {
    return envBackendUrl;
  }
  
  // Otherwise, use the same origin as the frontend (works for any domain)
  return window.location.origin;
};

export const BACKEND_URL = getBackendUrl();
export const API = `${BACKEND_URL}/api`;
