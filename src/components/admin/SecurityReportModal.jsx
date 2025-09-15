// SecurityReportModal.jsx - Modal for viewing and managing security report details
import React, { useState, useEffect } from 'react';

const SEVERITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444', 
  critical: '#dc2626'
};

const STATUS_OPTIONS = [
  { value: 'open', label: '🔴 Open', color: '#ef4444' },
  { value: 'in-progress', label: '🟡 In Progress', color: '#f59e0b' },
  { value: 'resolved', label: '✅ Resolved', color: '#10b981' },
  { value: 'closed', label: '⚫ Closed', color: '#6b7280' }
];

const SecurityReportModal = ({ report, isOpen, onClose, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState(report.status);
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentReport, setCurrentReport] = useState(report);

  // Update local state when report prop changes
  useEffect(() => {
    console.log('🔄 SecurityReportModal: report prop changed:', report);
    console.log('📝 New comments:', report?.comments);
    setCurrentReport(report);
    setNewStatus(report.status);
    setNotes(''); // Clear notes after update
  }, [report]);

  // Debug logging
  console.log('🔍 SecurityReportModal rendering with report:', currentReport);
  console.log('📝 Comments in current report:', currentReport?.comments);

  if (!isOpen) return null;

  const handleStatusUpdate = async () => {
    if (newStatus === currentReport.status && !notes.trim()) {
      onClose();
      return;
    }

    setIsUpdating(true);
    try {
      console.log('🔄 Updating status:', { reportId: currentReport.id, newStatus, notes });
      await onStatusUpdate(currentReport.id, newStatus, notes);
      console.log('✅ Status updated successfully');
      // Don't close immediately, let the parent component handle it
    } catch (error) {
      console.error('❌ Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getSeverityBadge = (severity) => {
    if (!severity) return null;
    
    const color = SEVERITY_COLORS[severity] || '#6b7280';
    const labels = {
      low: '🟢 Low Priority',
      medium: '🟡 Medium Priority',
      high: '🔴 High Priority',
      critical: '🚨 Critical Priority'
    };
    
    return (
      <span style={{
        padding: '6px 12px',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: color
      }}>
        {labels[severity]}
      </span>
    );
  };

  const getIncidentTypeIcon = (incidentType) => {
    const icons = {
      'phishing-email': '📧',
      'suspicious-website': '🌐',
      'social-engineering': '👥',
      'malware': '🦠',
      'data-breach': '🔓',
      'identity-theft': '🆔',
      'other': '❓'
    };
    return icons[incidentType] || '🛡️';
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'Not specified';
    
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (timeString) {
      return `${formattedDate} at ${timeString}`;
    }
    
    return formattedDate;
  };

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
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '28px' }}>
                {getIncidentTypeIcon(report.formData?.incidentType || report.type || report.details?.incidentType)}
              </span>
              Security Report Details
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontSize: '14px',
                color: '#6b7280',
                fontFamily: 'monospace',
                background: '#f3f4f6',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                ID: {report.id}
              </span>
              {getSeverityBadge(report.formData?.severity || report.severity || report.details?.severity)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          
          {/* Basic Information */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              📋 Report Information
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Incident Type
                </label>
                <div style={{ marginTop: '4px', fontSize: '16px', color: '#1f2937' }}>
                  {getIncidentTypeIcon(report.formData?.incidentType || report.type || report.details?.incidentType)} {' '}
                  {(report.formData?.incidentType || report.type || report.details?.incidentType) === 'other' 
                    ? (report.formData?.otherIncidentType || report.details?.otherIncidentType) 
                    : (report.formData?.incidentType || report.type || report.details?.incidentType)?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  }
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Date & Time Occurred
                </label>
                <div style={{ marginTop: '4px', fontSize: '16px', color: '#1f2937' }}>
                  {formatDateTime(
                    report.formData?.dateOccurred || report.details?.dateOccurred, 
                    report.formData?.timeOccurred || report.details?.timeOccurred
                  )}
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Reported By
                </label>
                <div style={{ marginTop: '4px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>
                    {report.userInfo?.name || 'Unknown'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {report.userInfo?.email}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {report.userInfo?.department}
                  </div>
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Report Submitted
                </label>
                <div style={{ marginTop: '4px', fontSize: '16px', color: '#1f2937' }}>
                  {new Date(report.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Subject/Title
              </label>
              <div style={{
                marginTop: '4px',
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#1f2937'
              }}>
                {report.formData?.subject || report.details?.subject || report.reason}
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Detailed Description
              </label>
              <div style={{
                marginTop: '4px',
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '6px',
                fontSize: '16px',
                color: '#1f2937',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5'
              }}>
                {report.formData?.description || report.details?.description || 'No description provided'}
              </div>
            </div>
          </div>

          {/* Technical Details */}
          {((report.formData?.senderEmail || report.details?.senderEmail) || 
            (report.formData?.suspiciousUrl || report.details?.suspiciousUrl) || 
            (report.formData?.attachmentNames || report.details?.attachmentNames)) && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                🔍 Technical Details
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px'
              }}>
                {(report.formData?.senderEmail || report.details?.senderEmail) && (
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Sender Email
                    </label>
                    <div style={{
                      marginTop: '4px',
                      padding: '8px 12px',
                      background: '#fef2f2',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#dc2626',
                      fontFamily: 'monospace'
                    }}>
                      {report.formData?.senderEmail || report.details?.senderEmail}
                    </div>
                  </div>
                )}
                
                {(report.formData?.suspiciousUrl || report.details?.suspiciousUrl) && (
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Suspicious URL
                    </label>
                    <div style={{
                      marginTop: '4px',
                      padding: '8px 12px',
                      background: '#fef2f2',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#dc2626',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all'
                    }}>
                      {report.formData?.suspiciousUrl || report.details?.suspiciousUrl}
                    </div>
                  </div>
                )}
                
                {(report.formData?.attachmentNames || report.details?.attachmentNames) && (
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Suspicious Attachments
                    </label>
                    <div style={{
                      marginTop: '4px',
                      padding: '8px 12px',
                      background: '#fef2f2',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#dc2626'
                    }}>
                      {report.formData?.attachmentNames || report.details?.attachmentNames}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {((report.formData?.affectedSystems || report.details?.affectedSystems) || 
            (report.formData?.actionsTaken || report.details?.actionsTaken) || 
            (report.formData?.additionalContacts || report.details?.additionalContacts)) && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                ℹ️ Additional Information
              </h3>
              
              {(report.formData?.affectedSystems || report.details?.affectedSystems) && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Affected Systems/Applications
                  </label>
                  <div style={{
                    marginTop: '4px',
                    padding: '8px 12px',
                    background: '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#1f2937'
                  }}>
                    {report.formData?.affectedSystems || report.details?.affectedSystems}
                  </div>
                </div>
              )}
              
              {(report.formData?.actionsTaken || report.details?.actionsTaken) && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Actions Already Taken
                  </label>
                  <div style={{
                    marginTop: '4px',
                    padding: '12px',
                    background: '#f0fdf4',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#1f2937',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {report.formData?.actionsTaken || report.details?.actionsTaken}
                  </div>
                </div>
              )}
              
              {(report.formData?.additionalContacts || report.details?.additionalContacts) && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Additional Contacts to Notify
                  </label>
                  <div style={{
                    marginTop: '4px',
                    padding: '8px 12px',
                    background: '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#1f2937'
                  }}>
                    {report.formData?.additionalContacts || report.details?.additionalContacts}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Investigation Notes / Comments */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              📝 Investigation Notes
            </h3>
            
            <div style={{
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {currentReport.comments && currentReport.comments.length > 0 ? (
                currentReport.comments.map((comment, index) => (
                  <div 
                    key={comment.id || index}
                    style={{
                      padding: '16px',
                      borderBottom: index < currentReport.comments.length - 1 ? '1px solid #e2e8f0' : 'none'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>
                        {comment.userName || comment.user || 'IT Admin'}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : 
                         comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Unknown date'}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#374151',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {comment.message || comment.text || comment.content || 'No message'}
                    </div>
                    {comment.isInternal && (
                      <div style={{
                        marginTop: '4px',
                        fontSize: '12px',
                        color: '#dc2626',
                        fontStyle: 'italic'
                      }}>
                        Internal Note
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{
                  padding: '32px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📝</div>
                  <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                    No Investigation Notes
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    Add notes below to track investigation progress and findings.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Management */}
          <div style={{
            padding: '20px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              🔄 Status Management
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Update Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                Investigation Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                placeholder="Add notes about investigation progress, findings, or actions taken..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                style={{
                  padding: '8px 16px',
                  background: isUpdating ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: isUpdating ? 'not-allowed' : 'pointer'
                }}
              >
                {isUpdating ? 'Updating...' : 'Update Report'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityReportModal;