// useBitbucketApi.js - Custom hook for Bitbucket API operations
import { useState } from 'react';
import { BITBUCKET_CONFIG, RATE_LIMIT } from '../config/constants.js';

// Rate limiting utility
const rateLimiter = {
  calls: new Map(),
  isAllowed: (userId) => {
    const now = Date.now();
    const userCalls = rateLimiter.calls.get(userId) || [];
    const recentCalls = userCalls.filter(time => now - time < RATE_LIMIT.WINDOW_MS);
    
    if (recentCalls.length >= RATE_LIMIT.MAX_CALLS) {
      console.warn(`Rate limit exceeded for user: ${userId}`);
      return false;
    }
    
    recentCalls.push(now);
    rateLimiter.calls.set(userId, recentCalls);
    return true;
  }
};

export const useBitbucketApi = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeApiCall = async (endpoint) => {
    if (!rateLimiter.isAllowed(userId)) {
      throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
    }

    const username = BITBUCKET_CONFIG.USERNAME;
    const credentials = btoa(`${username}:${BITBUCKET_CONFIG.TOKEN}`);
    
    const response = await fetch(`${BITBUCKET_CONFIG.API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  const fetchWorkspaces = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test with user endpoint first
      const testResponse = await fetch(`${BITBUCKET_CONFIG.API_BASE}/user`, {
        headers: {
          'Authorization': `Basic ${btoa(`${BITBUCKET_CONFIG.USERNAME}:${BITBUCKET_CONFIG.TOKEN}`)}`,
          'Accept': 'application/json'
        }
      });

      console.log('User API Test:', testResponse.status, testResponse.statusText);

      if (testResponse.ok) {
        const userData = await testResponse.json();
        console.log('User data:', userData);
        
        // Now try workspaces
        const data = await makeApiCall('/workspaces');
        console.log('Workspaces data:', data);
        
        const workspaces = data.values.map(workspace => ({
          uuid: workspace.uuid,
          name: workspace.name,
          slug: workspace.slug
        }));
        
        return workspaces;
      } else {
        throw new Error(`User API failed: ${testResponse.status}`);
      }
    } catch (err) {
      console.error('Failed to fetch Bitbucket workspaces:', err);
      setError(err.message);
      
      // Fallback to mock data for demo
      return [
        { uuid: '{demo}', name: 'Demo Workspace (API Error)', slug: 'demo' }
      ];
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async (workspaceSlug) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await makeApiCall(`/workspaces/${workspaceSlug}/projects`);
      
      const projects = data.values.map(project => ({
        key: project.key,
        name: project.name,
        description: project.description
      }));
      
      return projects;
    } catch (err) {
      console.error('Failed to fetch Bitbucket projects:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchRepositories = async (workspaceSlug, projectKey) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await makeApiCall(`/repositories/${workspaceSlug}?q=project.key="${projectKey}"`);
      
      const repos = data.values.map(repo => ({
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        is_private: repo.is_private
      }));
      
      return repos;
    } catch (err) {
      console.error('Failed to fetch Bitbucket repositories:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchWorkspaces,
    fetchProjects,
    fetchRepositories
  };
};