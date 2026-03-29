/**
 * Utilities for extracting user-friendly messages from Axios errors.
 */

/**
 * Returns the HTTP status code from an axios error, or 0 for network errors.
 */
export function getErrorStatus(err) {
  return err?.response?.status ?? 0
}

/**
 * Returns true when the error should be shown as a toast (network or 5xx).
 */
export function isGeneralError(err) {
  if (!err?.response) return true  // network / CORS / offline
  return err.response.status >= 500
}

/**
 * Extracts a user-friendly message from an axios error.
 */
export function getApiError(err) {
  if (!err?.response) {
    return 'Network error. Please check your connection and try again.'
  }
  const status = err.response.status
  const msg = err.response?.data?.message
  if (status >= 500) return 'A server error occurred. Please try again later.'
  return msg || 'Something went wrong. Please try again.'
}
