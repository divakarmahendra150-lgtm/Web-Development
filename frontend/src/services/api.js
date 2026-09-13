/**
 * STRICT REQUIREMENT:
 * All API communication MUST use native fetch().
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://web-development-25k4.onrender.com/';

export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new Error('Network error. Please check your connection.');
  }

  // Handle 401 Unauthorized / Token Expiry
  if (response.status === 401 && !options._retry && localStorage.getItem('refresh_token')) {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      const refreshRes = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        localStorage.setItem('access_token', refreshData.access);
        if (refreshData.refresh) {
          localStorage.setItem('refresh_token', refreshData.refresh);
        }
        
        // Retry the original request with new token
        headers['Authorization'] = `Bearer ${refreshData.access}`;
        return request(endpoint, { ...options, headers, _retry: true });
      } else {
        // Refresh token failed, clear auth and dispatch event
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.dispatchEvent(new Event('auth:unauthorized'));
        throw new Error('Session expired. Please log in again.');
      }
    } catch (refreshErr) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.dispatchEvent(new Event('auth:unauthorized'));
      throw refreshErr;
    }
  }

  // 204 No Content
  if (response.status === 204) {
    return null;
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred.';
    if (typeof data === 'object' && data !== null) {
      if (data.error) errorMessage = data.error;
      else if (data.detail) errorMessage = data.detail;
      else {
        // Collect first validation error message
        const firstKey = Object.keys(data)[0];
        if (firstKey) {
          const val = data[firstKey];
          errorMessage = Array.isArray(val) ? val[0] : String(val);
        }
      }
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};
