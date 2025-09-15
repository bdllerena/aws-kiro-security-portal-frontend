// roles.js - Role-based access control configuration
export const USER_ROLES = {
  USER: 'user',
  IT_SUPPORT: 'it-support',
  ADMIN: 'admin'
};

export const PERMISSIONS = {
  // Request permissions
  REQUEST_CREATE: 'request:create',
  REQUEST_VIEW_OWN: 'request:view-own',
  REQUEST_VIEW_ALL: 'request:view-all',
  REQUEST_APPROVE: 'request:approve',
  REQUEST_ASSIGN: 'request:assign',
  REQUEST_DELETE: 'request:delete',

  // Notification permissions
  NOTIFICATION_SEND: 'notification:send',

  // Admin permissions
  USER_MANAGE: 'user:manage',
  ANALYTICS_VIEW: 'analytics:view'
};

// Define IT Support permissions first
const IT_SUPPORT_PERMISSIONS = [
  PERMISSIONS.REQUEST_CREATE,
  PERMISSIONS.REQUEST_VIEW_OWN,
  PERMISSIONS.REQUEST_VIEW_ALL,
  PERMISSIONS.REQUEST_APPROVE,
  PERMISSIONS.REQUEST_ASSIGN,
  PERMISSIONS.NOTIFICATION_SEND,
  PERMISSIONS.ANALYTICS_VIEW
];

export const ROLE_PERMISSIONS = {
  [USER_ROLES.USER]: [
    PERMISSIONS.REQUEST_CREATE,
    PERMISSIONS.REQUEST_VIEW_OWN
  ],
  [USER_ROLES.IT_SUPPORT]: IT_SUPPORT_PERMISSIONS,
  [USER_ROLES.ADMIN]: [
    ...IT_SUPPORT_PERMISSIONS,
    PERMISSIONS.REQUEST_DELETE,
    PERMISSIONS.USER_MANAGE
  ]
};

// Note: User roles and permissions are now determined dynamically by the backend API
// No more hardcoded email lists - all role assignment happens via database

export const REQUEST_STATUS = {
  PENDING: 'pending',
  IN_REVIEW: 'in-review',
  APPROVED: 'approved',
  DENIED: 'denied',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const REQUEST_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const REQUEST_TYPES = {
  BITBUCKET_ACCESS: 'bitbucket-access',
  BITBUCKET_CREATE: 'bitbucket-create',
  DATABASE_ACCESS: 'database-access',
  LICENSE: 'license',
  OTHER: 'other'
};