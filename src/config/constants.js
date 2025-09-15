// constants.js - Application constants
export const BITBUCKET_CONFIG = {
  TOKEN: import.meta.env.VITE_BITBUCKET_TOKEN || 'your-bitbucket-token-here',
  USERNAME: import.meta.env.VITE_BITBUCKET_USERNAME || 'your-username',
  API_BASE: 'https://api.bitbucket.org/2.0'
};

export const ALLOWED_DOMAINS = ['company.net', 'company.com'];

export const LICENSE_OPTIONS = [
  { value: 'cursor', label: 'Cursor License' },
  { value: 'lucidchart', label: 'Lucidchart License' },
  { value: 'postman', label: 'Postman License' },
  { value: 'gamma', label: 'Gamma License' },
  { value: 'bitbucket', label: 'Access Bitbucket Repository' },
  { value: 'bitbucket-create', label: 'Create Bitbucket Repository' },
  { value: 'database', label: 'Access Database' },
  { value: 'metabase', label: 'Access Metabase' },
  { value: 'aws', label: 'Access AWS' },
  { value: 'aws-reset', label: 'AWS Password Reset' },
  { value: 'onboarding', label: 'User Onboarding' },
  { value: 'offboarding', label: 'User Offboarding' },
  { value: 'other', label: 'Other' }
];

export const DEPARTMENTS = [
  { value: 'it', label: 'IT' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'product', label: 'Product' },
  { value: 'operations', label: 'Operations' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'other', label: 'Other' }
];

export const RATE_LIMIT = {
  MAX_CALLS: 10,
  WINDOW_MS: 60000 // 1 minute
};