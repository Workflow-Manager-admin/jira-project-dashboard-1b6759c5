// API service for Jira Dashboard frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://vscode-internal-60-beta.beta01.cloud.kavia.ai:3001';

class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// PUBLIC_INTERFACE
/**
 * Makes HTTP requests to the backend API with error handling
 */
const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP error ${response.status}`,
        response.status,
        data.error_code
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new ApiError('Unable to connect to server. Please check your connection.', 0, 'NETWORK_ERROR');
    }
    
    throw new ApiError(error.message || 'An unexpected error occurred', 0, 'UNKNOWN_ERROR');
  }
};

// PUBLIC_INTERFACE
/**
 * Authenticates user with Jira credentials
 */
export const authenticateUser = async (credentials) => {
  return makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// PUBLIC_INTERFACE
/**
 * Fetches all projects for authenticated user
 */
export const fetchUserProjects = async (credentials) => {
  return makeRequest('/api/projects', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// PUBLIC_INTERFACE
/**
 * Fetches detailed information for a specific project
 */
export const fetchProjectDetails = async (projectKey, credentials) => {
  return makeRequest(`/api/projects/${projectKey}`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// PUBLIC_INTERFACE
/**
 * Tests API connectivity
 */
export const testConnection = async () => {
  return makeRequest('/');
};

export { ApiError };
