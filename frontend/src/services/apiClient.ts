export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface FetchOptions extends RequestInit {
  data?: unknown;
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const token = sessionStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge custom headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch {
      // Not JSON
    }
    throw new Error(errorMsg);
  }

  // For responses like 204 No Content
  if (response.status === 204) return null;

  try {
    return await response.json();
  } catch {
    return null; // Empty response body but ok status
  }
}
