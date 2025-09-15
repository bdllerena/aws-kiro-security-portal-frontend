// validateEnv.js - Environment variable validation
const requiredEnvVars = [
  'VITE_AZURE_CLIENT_ID',
  'VITE_AZURE_TENANT_ID',
  'VITE_API_BASE_URL'
];

const optionalEnvVars = [
  'VITE_BITBUCKET_TOKEN',
  'VITE_BITBUCKET_USERNAME',
  'VITE_REDIRECT_URI'
];

export const validateEnvironment = () => {
  const missing = [];
  
  requiredEnvVars.forEach(varName => {
    if (!import.meta.env[varName]) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
  
  console.log('✅ All required environment variables are set');
  
  // Log optional variables that are set
  const setOptional = optionalEnvVars.filter(varName => import.meta.env[varName]);
  if (setOptional.length > 0) {
    console.log(`✅ Optional variables set: ${setOptional.join(', ')}`);
  }
};

// Auto-validate on import
validateEnvironment();
