// useRequests.js - Hook for managing access requests
import { useState, useEffect } from 'react';
import { REQUEST_STATUS, REQUEST_TYPES } from '../config/roles.js';
import { LAMBDA_URLS } from '../config/lambdaUrls.js';

// Generate unique request ID
const generateRequestId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `REQ-${timestamp}-${randomStr}`.toUpperCase();
};

// Note: Mock data generation removed - now using real Lambda API

export const useRequests = (userId, isITTeam = false) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRequests();
  }, [userId, isITTeam]);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Make real API call to Lambda function
      const url = isITTeam ? `${LAMBDA_URLS.getRequests}?all=true` : `${LAMBDA_URLS.getRequests}?userId=${userId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error('Failed to load requests:', err);
      setError(err.message);
      
      // Set empty array instead of mock data (real backend behavior)
      console.warn('API call failed, showing empty results');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData) => {
    try {
      // Make real API call to create request
      const response = await fetch(LAMBDA_URLS.createRequest, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          userInfo: requestData.userInfo,
          formData: requestData.formData,
          type: requestData.type,
          details: requestData.details,
          reason: requestData.reason,
          priority: requestData.priority || 'normal'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const newRequest = data.request;
      
      // Update local state
      setRequests(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (err) {
      console.error('Failed to create request:', err);
      throw err;
    }
  };

  const updateRequestStatus = async (requestId, status, comment = null, isInternal = false) => {
    try {
      // Build URL with request ID
      const url = LAMBDA_URLS.updateRequestStatus.replace('{id}', requestId);
      
      // Make real API call to update request status
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          notes: comment,
          isInternal,
          updatedBy: userId
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📨 Received response from API:', data);
      const updatedRequest = data.request;
      console.log('🔍 Updated request object:', updatedRequest);
      console.log('📝 Comments in updated request:', updatedRequest?.comments);
      
      // Update local state
      setRequests(prev => prev.map(request => 
        request.id === requestId ? updatedRequest : request
      ));
      
      return updatedRequest;
    } catch (err) {
      console.error('Failed to update request status:', err);
      throw err;
    }
  };

  const addComment = async (requestId, comment, isInternal = false) => {
    try {
      // Build URL with request ID
      const url = LAMBDA_URLS.addComment.replace('{id}', requestId);
      
      // Make real API call to add comment
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: comment,
          userId: userId,
          isInternal
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const updatedRequest = data.request;
      
      // Update local state
      setRequests(prev => prev.map(request => 
        request.id === requestId ? updatedRequest : request
      ));
      
      return true;
    } catch (err) {
      console.error('Failed to add comment:', err);
      throw err;
    }
  };

  const getMyRequests = () => {
    return requests.filter(request => request.userId === userId);
  };

  const getPendingRequests = () => {
    return requests.filter(request => request.status === REQUEST_STATUS.PENDING);
  };

  const getRequestsByStatus = (status) => {
    return requests.filter(request => request.status === status);
  };

  const getSecurityReports = () => {
    return requests.filter(request => request.isSecurityIncident);
  };

  const getAccessRequests = () => {
    return requests.filter(request => !request.isSecurityIncident);
  };

  const getOpenSecurityReports = () => {
    return requests.filter(request => request.isSecurityIncident && request.status === 'open');
  };

  const getCriticalReports = () => {
    return requests.filter(request => request.priority === 'critical' || request.priority === 'urgent');
  };

  const getRequestStats = async (userEmail = null) => {
    try {
      // Make real API call to get request stats
      const url = userEmail ? `${LAMBDA_URLS.getRequestStats}?userEmail=${encodeURIComponent(userEmail)}` : LAMBDA_URLS.getRequestStats;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.statistics;
    } catch (err) {
      console.error('Failed to get request stats:', err);
      
      // Fallback to local calculation if API fails
      const securityIncidents = requests.filter(r => r.isSecurityIncident);
      const accessRequests = requests.filter(r => !r.isSecurityIncident);
      
      const stats = {
        total: requests.length,
        securityIncidents: securityIncidents.length,
        accessRequests: accessRequests.length,
        statusCounts: {
          // Security incident statuses
          open: requests.filter(r => r.status === 'open').length,
          'in-progress': requests.filter(r => r.status === 'in-progress').length,
          resolved: requests.filter(r => r.status === 'resolved').length,
          closed: requests.filter(r => r.status === 'closed').length,
          // Access request statuses
          pending: requests.filter(r => r.status === REQUEST_STATUS.PENDING).length,
          inReview: requests.filter(r => r.status === REQUEST_STATUS.IN_REVIEW).length,
          approved: requests.filter(r => r.status === REQUEST_STATUS.APPROVED).length,
          denied: requests.filter(r => r.status === REQUEST_STATUS.DENIED).length,
          completed: requests.filter(r => r.status === REQUEST_STATUS.COMPLETED).length,
          cancelled: requests.filter(r => r.status === REQUEST_STATUS.CANCELLED).length
        },
        priorityCounts: {
          low: requests.filter(r => r.priority === 'low').length,
          medium: requests.filter(r => r.priority === 'medium').length,
          high: requests.filter(r => r.priority === 'high').length,
          critical: requests.filter(r => r.priority === 'critical').length,
          normal: requests.filter(r => r.priority === 'normal').length,
          urgent: requests.filter(r => r.priority === 'urgent').length
        }
      };
      
      return stats;
    }
  };

  return {
    requests,
    loading,
    error,
    createRequest,
    updateRequestStatus,
    addComment,
    getMyRequests,
    getPendingRequests,
    getRequestsByStatus,
    getSecurityReports,
    getAccessRequests,
    getOpenSecurityReports,
    getCriticalReports,
    getRequestStats,
    refreshRequests: loadRequests
  };
};