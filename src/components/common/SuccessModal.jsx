// SuccessModal.jsx - Professional success modal for form submissions
import React from 'react';

const SuccessModal = ({ isOpen, onClose, title, message, requestId, onViewRequests, nextSteps, hideNextSteps }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        animation: 'modalSlideIn 0.3s ease-out'
      }}>
        {/* Success Icon */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'checkmarkBounce 0.6s ease-out'
          }}>
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          textAlign: 'center'
        }}>
          {title || 'Request Submitted Successfully!'}
        </h2>

        {/* Message */}
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          color: '#6b7280',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          {message || 'Your access request has been submitted and is now being reviewed by the IT team.'}
        </p>

        {/* Request ID */}
        {requestId && (
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{
                  margin: '0 0 4px 0',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Request ID:
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontFamily: 'monospace'
                }}>
                  {requestId}
                </p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(requestId)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#6b7280',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.color = '#6b7280';
                }}
                title="Copy Request ID"
              >
                📋 Copy
              </button>
            </div>
          </div>
        )}

        {/* Next Steps - Only show if not hidden */}
        {!hideNextSteps && (
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e40af'
            }}>
              What happens next?
            </h4>
            <ul style={{
              margin: 0,
              paddingLeft: '16px',
              fontSize: '14px',
              color: '#1e40af',
              lineHeight: '1.5'
            }}>
              {nextSteps ? (
                nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))
              ) : (
                <>
                  <li>The IT security team will investigate your report</li>
                  <li>You'll receive updates via email if needed</li>
                  <li>Keep your request ID for reference</li>
                </>
              )}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          {onViewRequests && (
            <button
              onClick={onViewRequests}
              style={{
                padding: '12px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              View My Requests
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '12px 20px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
          >
            Close
          </button>
        </div>

        {/* Animations - Using regular style tag */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes modalSlideIn {
              from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            @keyframes checkmarkBounce {
              0% {
                transform: scale(0);
              }
              50% {
                transform: scale(1.2);
              }
              100% {
                transform: scale(1);
              }
            }
          `
        }} />
      </div>
    </div>
  );
};

export default SuccessModal;