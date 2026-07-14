'use strict';

// Point this at your local backend during development,
// then swap to the live Render URL before deploying.
const API_BASE_URL = 'https://focal-api.onrender.com/api';

/**
 * Core request helper. Every API call in this app goes through here,
 * so error handling and JSON parsing only need to be written once.
 */
async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (networkError) {
    // fetch() itself throws only on true network failure (offline,
    // DNS failure, CORS block) — not on 4xx/5xx responses
    throw new Error('Network error: could not reach the server');
  }

  if (!response.ok) {
    // Try to read the backend's structured error message; fall back
    // to the status code alone if the body isn't valid JSON
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      message = errorBody?.error?.message || message;
    } catch {
      // response body wasn't JSON — keep the fallback message
    }
    throw new Error(message);
  }

  // 204 No Content has no body to parse
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

const sessionsApi = {
  list() {
    return apiRequest('/sessions');
  },

  create(session) {
    return apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  },

  update(id, updates) {
    return apiRequest(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  remove(id) {
    return apiRequest(`/sessions/${id}`, {
      method: 'DELETE',
    });
  },
};

const apiStatusEl = document.getElementById('apiStatus');
let hideStatusTimeout = null;

function showApiLoading(message) {
  clearTimeout(hideStatusTimeout);
  apiStatusEl.textContent = message;
  apiStatusEl.className = 'api-status is-visible is-loading';
}

function showApiError(message) {
  clearTimeout(hideStatusTimeout);
  apiStatusEl.textContent = message;
  apiStatusEl.className = 'api-status is-visible is-error';
  hideStatusTimeout = setTimeout(hideApiStatus, 5000);
}

function hideApiStatus() {
  apiStatusEl.classList.remove('is-visible');
}