// useUserRole.js - Hook for managing user roles and permissions
import { useState, useEffect } from 'react';
import { USER_ROLES, ROLE_PERMISSIONS } from '../config/roles.js';
import { LAMBDA_URLS } from '../config/lambdaUrls.js';

export const useUserRole = (user) => {
  const [userRole, setUserRole] = useState(USER_ROLES.USER);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      determineUserRole(user);
    }
  }, [user]);

  const determineUserRole = async (user) => {
    setLoading(true);
    
    try {
      // Try multiple fields to get the user's email
      const email = (
        user.username?.toLowerCase() || 
        user.mail?.toLowerCase() || 
        user.userPrincipalName?.toLowerCase() || 
        user.preferredUsername?.toLowerCase() ||
        ''
      );
      
      console.log('Full user object:', user);
      console.log('Extracted email for role check:', email);
      
      // Call the Lambda function to get user role
      try {
        // Make GET request with email as query parameter (matching Lambda implementation)
        const url = new URL(LAMBDA_URLS.getUserRole);
        url.searchParams.append('email', email);
        
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // API returns data.user.role, not data.role
          const role = data.user?.role || data.role || USER_ROLES.USER;
          
          setUserRole(role);
          setPermissions(ROLE_PERMISSIONS[role] || []);
          
          console.log(`User role determined via API: ${role} for ${email}`);
          console.log('Full API response:', data);
        } else {
          console.error('Lambda API call failed with status:', response.status);
          console.error('Response text:', await response.text());
          
          // Set default user role if API fails
          setUserRole(USER_ROLES.USER);
          setPermissions(ROLE_PERMISSIONS[USER_ROLES.USER] || []);
        }
      } catch (apiError) {
        console.error('Lambda API call failed:', apiError.message);
        console.error('Full error:', apiError);
        
        // Set default user role if API fails
        setUserRole(USER_ROLES.USER);
        setPermissions(ROLE_PERMISSIONS[USER_ROLES.USER] || []);
      }
      
    } catch (error) {
      console.error('Error determining user role:', error);
      
      // Default to user role
      setUserRole(USER_ROLES.USER);
      setPermissions(ROLE_PERMISSIONS[USER_ROLES.USER] || []);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasRole = (role) => {
    return userRole === role;
  };

  const isITTeam = () => {
    return userRole === USER_ROLES.IT_SUPPORT || userRole === USER_ROLES.ADMIN;
  };

  const isAdmin = () => {
    return userRole === USER_ROLES.ADMIN;
  };

  return {
    userRole,
    permissions,
    loading,
    hasPermission,
    hasRole,
    isITTeam,
    isAdmin
  };
};