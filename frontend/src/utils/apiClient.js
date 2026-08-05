import { auth } from '../firebase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Centralized API client with:
 * 1. Automatic Bearer token attachment
 * 2. AbortController timeout (default 15s)
 * 3. Stale-token 403 retry (force refresh + single retry)
 * 4. Standardized error objects
 */
export async function apiRequest(path, options = {}, retried = false) {
  const user = auth.currentUser;
  if (!user) {
    throw { code: 'AUTH_REQUIRED', message: 'You must be logged in to perform this action.' };
  }

  const timeout = options.timeout || DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const token = await user.getIdToken(retried); // force refresh on retry

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Stale token retry: if 403 and we haven't retried yet
    if (response.status === 403 && !retried) {
      console.warn('[apiClient] 403 received, forcing token refresh and retrying...');
      return apiRequest(path, options, true);
    }

    const data = await response.json();

    if (!response.ok) {
      throw {
        code: data?.error?.code || `HTTP_${response.status}`,
        message: data?.error?.message || data?.detail || 'An unexpected server error occurred.',
        status: response.status,
        referenceId: data?.error?.reference_id || null
      };
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // AbortController timeout
    if (error.name === 'AbortError') {
      throw {
        code: 'TIMEOUT',
        message: 'The server is taking too long to respond. Please try again.',
        status: 408
      };
    }

    // Network failure (fetch itself throws TypeError)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw {
        code: 'NETWORK_ERROR',
        message: `Browser fetch error: ${error.message} - API_BASE: ${API_BASE}`,
        status: 0
      };
    }

    // Re-throw structured errors from above
    if (error.code) throw error;

    // Unknown errors
    throw {
      code: 'UNKNOWN',
      message: error.message || 'An unexpected error occurred.',
      status: 500
    };
  }
}
