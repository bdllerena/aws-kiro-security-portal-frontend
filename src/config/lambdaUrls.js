// lambdaUrls.js - API URLs configuration
// Automatically uses local backend in development, AWS Lambda in production

// Base URL - Always use Lambda URL for now
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '<your-lambda-url>';

export const LAMBDA_URLS = {
  // Security Report Management Functions
  createRequest: `${BASE_URL}/api/requests`,
  getRequests: `${BASE_URL}/api/requests`,
  updateRequestStatus: `${BASE_URL}/api/requests/{id}/status`,
  addComment: `${BASE_URL}/api/requests/{id}/comments`,
  getRequestStats: `${BASE_URL}/api/requests/stats`,
  
  // Authentication Functions
  getUserRole: `${BASE_URL}/api/auth/user-role`
};

// Helper function to build URL with path parameters
export const buildLambdaUrl = (baseUrl, pathParams = {}) => {
  let url = baseUrl;
  
  // Replace path parameters in the URL
  Object.entries(pathParams).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, encodeURIComponent(value));
  });
  
  return url;
};

// Helper function to add query parameters
export const addQueryParams = (url, params = {}) => {
  const urlObj = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlObj.searchParams.append(key, value);
    }
  });
  return urlObj.toString();
};