// App.jsx - Security Incident Portal with authentication
import React, { useState, useEffect } from 'react';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { msalInstance } from './config/msalConfig.js';
import { useUserRole } from './hooks/useUserRole.js';
import LoginScreen from './components/auth/LoginScreen.jsx';
import PhishingReportForm from './components/forms/PhishingReportForm.jsx';
import SecurityDashboard from './components/admin/SecurityDashboard.jsx';
import CompanyLogo from './components/common/CompanyLogo.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

function MainApplication() {
  const { accounts, instance } = useMsal();
  const user = accounts[0];
  const { userRole, loading: roleLoading, isITTeam } = useUserRole(user);
  const [activeTab, setActiveTab] = useState('security-report');

  const handleLogout = () => {
    instance.clearCache();
    window.location.reload();
  };

  if (roleLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f3f6fc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <CompanyLogo size="medium" />
          <LoadingSpinner message="Setting up your workspace..." />
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'security-report':
        return <PhishingReportForm onNavigateToTab={setActiveTab} />;
      case 'security-dashboard':
        return isITTeam() ? (
          <SecurityDashboard 
            userId={user?.homeAccountId} 
            userEmail={user?.username} 
            userName={user?.name} 
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <h3>Access Denied</h3>
            <p>You need admin privileges to access the Security Dashboard.</p>
          </div>
        );
      default:
        return <PhishingReportForm onNavigateToTab={setActiveTab} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f6fc",
      padding: "32px"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          padding: '20px 32px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <CompanyLogo size="small" />
            <div>
              <h1 style={{
                margin: '0 0 4px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                🛡️ Security Incident Portal
              </h1>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Report and manage security incidents
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* User Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              background: '#f3f4f6',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p style={{
                  margin: '0 0 2px 0',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {user?.name || 'User'}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  {userRole === 'admin' ? '👑 Admin' : userRole === 'it-support' ? '🛠️ IT Support' : '👤 User'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#dc2626'}
              onMouseLeave={(e) => e.target.style.background = '#ef4444'}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #e5e7eb',
          marginBottom: '24px',
          background: 'white',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setActiveTab('security-report')}
            style={{
              flex: 1,
              padding: '16px 24px',
              border: 'none',
              background: activeTab === 'security-report' ? '#ef4444' : 'transparent',
              color: activeTab === 'security-report' ? 'white' : '#6b7280',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '18px' }}>🛡️</span>
            Report Security Incident
          </button>
          
          {userRole === 'admin' && (
            <button
              onClick={() => setActiveTab('security-dashboard')}
              style={{
                flex: 1,
                padding: '16px 24px',
                border: 'none',
                background: activeTab === 'security-dashboard' ? '#ef4444' : 'transparent',
                color: activeTab === 'security-dashboard' ? 'white' : '#6b7280',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '18px' }}>🚨</span>
              Security Dashboard
            </button>
          )}
        </div>

        {/* Main Content */}
        <div style={{
          background: 'white',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          minHeight: '500px'
        }}>
          <div style={{ padding: '32px' }}>
            {renderTabContent()}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          padding: '16px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            Security Incident Portal • {userRole === 'admin' ? 'Admin Access' : 'User Access'}
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '12px', 
            color: '#9ca3af',
            fontFamily: 'monospace'
          }}>
            v2025.09.10-19:30 • Build: {import.meta.env.MODE}
          </p>
        </div>
      </div>
    </div>
  );
}

function SecurityPortal() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize();
        
        // Handle redirect promise
        const response = await msalInstance.handleRedirectPromise();
        if (response) {
          console.log('Login successful:', response);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('MSAL initialization error:', error);
        setIsInitialized(true); // Still set to true to show the app
      }
    };

    initializeMsal();
  }, []);

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f3f6fc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <CompanyLogo size="medium" />
          <LoadingSpinner message="Initializing authentication..." />
        </div>
      </div>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate>
        <MainApplication />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoginScreen />
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}

export default function App() {
  return <SecurityPortal />;
}