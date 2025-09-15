// SecurityDashboard.jsx - Dashboard for managing phishing and security reports
import React, { useState, useEffect } from 'react';
import { useRequests } from '../../hooks/useRequests.js';
import { useMobile } from '../../hooks/useMediaQuery.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import SecurityReportModal from './SecurityReportModal.jsx';

const SEVERITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b', 
  high: '#ef4444',
  critical: '#dc2626'
};

const STATUS_COLORS = {
  open: '#ef4444',
  'in-progress': '#f59e0b',
  resolved: '#10b981',
  closed: '#6b7280'
};

const SecurityDashboard = ({ userId, userEmail, userName }) => {
  const { requests, loading, error, updateRequestStatus } = useRequests(userId, true);
  const isMobile = useMobile();
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, severity-desc

  // Filter security reports only
  const securityReports = requests.filter(request => 
    request.type === 'phishing-report' || 
    (request.details && request.details.reportType === 'security-incident')
  );

  // Apply filters
  const filteredReports = securityReports.filter(report => {
    const reportSeverity = report.formData?.severity || report.severity || report.details?.severity;
    const reportSubject = report.formData?.subject || report.details?.subject || report.reason;
    
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || reportSeverity === filterSeverity;
    const matchesSearch = searchTerm === '' || 
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.userInfo && report.userInfo.name && 
       report.userInfo.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reportSubject && reportSubject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  // Sort reports based on selected sort option
  const sortedReports = filteredReports.sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'date-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'severity-desc':
        const aSeverity = severityOrder[a.formData?.severity || a.severity || a.details?.severity] || 0;
        const bSeverity = severityOrder[b.formData?.severity || b.severity || b.details?.severity] || 0;
        if (aSeverity !== bSeverity) {
          return bSeverity - aSeverity;
        }
        // If same severity, sort by date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleColumnSort = (column) => {
    switch (column) {
      case 'date':
        setSortBy(sortBy === 'date-desc' ? 'date-asc' : 'date-desc');
        break;
      case 'severity':
        setSortBy('severity-desc');
        break;
      default:
        break;
    }
  };

  const getSortIcon = (column) => {
    if (column === 'date') {
      if (sortBy === 'date-desc') return ' ↓';
      if (sortBy === 'date-asc') return ' ↑';
    } else if (column === 'severity' && sortBy === 'severity-desc') {
      return ' ↓';
    }
    return '';
  };

  const handleStatusUpdate = async (reportId, newStatus, notes = '') => {
    try {
      console.log('🔄 Dashboard updating status:', { reportId, newStatus, notes });
      const updatedRequest = await updateRequestStatus(reportId, newStatus, notes);
      console.log('✅ Dashboard status updated, received data:', updatedRequest);
      console.log('📝 Comments in updated request:', updatedRequest?.comments);
      
      // Update the selected report with the new data
      if (updatedRequest) {
        console.log('🔄 Updating selectedReport with new data including comments');
        setSelectedReport(updatedRequest);
        // Modal should automatically update due to useEffect in SecurityReportModal
      } else {
        setShowReportModal(false);
      }
    } catch (error) {
      console.error('❌ Dashboard failed to update report status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const exportToCSV = () => {
    console.log('📊 Exporting', filteredReports.length, 'reports to CSV');
    
    try {
      // Define CSV headers
      const headers = [
        'Report ID',
        'Status',
        'Severity',
        'Incident Type',
        'Subject',
        'Description',
        'Reporter Name',
        'Reporter Email',
        'Reporter Department',
        'Date Occurred',
        'Time Occurred',
        'Date Submitted',
        'Sender Email',
        'Suspicious URL',
        'Attachment Names',
        'Affected Systems',
        'Actions Taken',
        'Additional Contacts',
        'Investigation Notes',
        'Last Updated'
      ];

      // Convert reports to CSV rows
      const csvRows = filteredReports.map(report => {
        // Combine all investigation notes/comments
        const investigationNotes = report.comments 
          ? report.comments.map(comment => 
              `[${new Date(comment.timestamp).toLocaleString()}] ${comment.userName || 'Admin'}: ${comment.message}`
            ).join(' | ')
          : '';

        return [
          report.id || '',
          report.status || '',
          (report.formData?.severity || report.severity || report.details?.severity || '').toUpperCase(),
          (report.formData?.incidentType || report.type || report.details?.incidentType || '').replace('-', ' '),
          report.formData?.subject || report.details?.subject || report.reason || '',
          (report.formData?.description || report.details?.description || '').replace(/\n/g, ' '),
          report.userInfo?.name || '',
          report.userInfo?.email || '',
          report.userInfo?.department || '',
          report.formData?.dateOccurred || report.details?.dateOccurred || '',
          report.formData?.timeOccurred || report.details?.timeOccurred || '',
          new Date(report.createdAt).toLocaleString(),
          report.formData?.senderEmail || report.details?.senderEmail || '',
          report.formData?.suspiciousUrl || report.details?.suspiciousUrl || '',
          report.formData?.attachmentNames || report.details?.attachmentNames || '',
          report.formData?.affectedSystems || report.details?.affectedSystems || '',
          (report.formData?.actionsTaken || report.details?.actionsTaken || '').replace(/\n/g, ' '),
          report.formData?.additionalContacts || report.details?.additionalContacts || '',
          investigationNotes.replace(/\n/g, ' '),
          new Date(report.updatedAt || report.createdAt).toLocaleString()
        ];
      });

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => 
          row.map(field => 
            // Escape commas and quotes in CSV fields
            `"${String(field).replace(/"/g, '""')}"`
          ).join(',')
        )
      ].join('\n');

      // Create and download file with improved browser compatibility
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Generate filename with current date and filter info
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const filterInfo = [];
      
      if (filterStatus !== 'all') filterInfo.push(`status-${filterStatus}`);
      if (filterSeverity !== 'all') filterInfo.push(`severity-${filterSeverity}`);
      if (searchTerm) filterInfo.push(`search-${searchTerm.replace(/[^a-zA-Z0-9]/g, '')}`);
      
      const filterSuffix = filterInfo.length > 0 ? `_${filterInfo.join('_')}` : '';
      const filename = `company-security-reports_${dateStr}${filterSuffix}.csv`;

      // Try modern approach first (for modern browsers)
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // IE/Edge support
        window.navigator.msSaveOrOpenBlob(blob, filename);
        console.log('✅ CSV exported successfully (IE/Edge):', filename);
      } else {
        // Modern browsers
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
        
        console.log('✅ CSV exported successfully:', filename);
      }
    } catch (error) {
      console.error('❌ Failed to export CSV:', error);
      alert('Failed to export CSV. Please try again or contact IT support.');
    }
  };

  const getStatusBadge = (status) => {
    const color = STATUS_COLORS[status] || '#6b7280';
    const labels = {
      open: '🔴 Open',
      'in-progress': '🟡 In Progress', 
      resolved: '✅ Resolved',
      closed: '⚫ Closed'
    };
    
    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: color,
        whiteSpace: 'nowrap',
        minWidth: 'fit-content',
        textAlign: 'center'
      }}>
        {labels[status] || status}
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    if (!severity) return null;
    
    const color = SEVERITY_COLORS[severity] || '#6b7280';
    const labels = {
      low: '🟢 Low',
      medium: '🟡 Medium',
      high: '🔴 High', 
      critical: '🚨 Critical'
    };
    
    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600',
        color: 'white',
        backgroundColor: color,
        whiteSpace: 'nowrap',
        minWidth: 'fit-content',
        textAlign: 'center'
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

  // Statistics
  const stats = {
    total: securityReports.length,
    open: securityReports.filter(r => r.status === 'open').length,
    inProgress: securityReports.filter(r => r.status === 'in-progress').length,
    resolved: securityReports.filter(r => r.status === 'resolved').length,
    critical: securityReports.filter(r => (r.formData?.severity === 'critical' || r.severity === 'critical')).length,
    high: securityReports.filter(r => (r.formData?.severity === 'high' || r.severity === 'high')).length
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <LoadingSpinner message="Loading security reports..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        color: '#dc2626'
      }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Error Loading Reports</h3>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '16px',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '24px',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          🛡️ Security Dashboard
        </h2>
        <p style={{
          margin: 0,
          color: '#6b7280',
          fontSize: '16px'
        }}>
          Monitor and manage phishing reports and security incidents
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Total Reports</div>
        </div>
        
        <div style={{
          padding: '20px',
          background: '#fef2f2',
          borderRadius: '8px',
          border: '1px solid #fecaca'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>
            {stats.open}
          </div>
          <div style={{ fontSize: '14px', color: '#991b1b' }}>Open Cases</div>
        </div>
        
        <div style={{
          padding: '20px',
          background: '#fffbeb',
          borderRadius: '8px',
          border: '1px solid #fed7aa'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#d97706' }}>
            {stats.inProgress}
          </div>
          <div style={{ fontSize: '14px', color: '#92400e' }}>In Progress</div>
        </div>
        
        <div style={{
          padding: '20px',
          background: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #bbf7d0'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>
            {stats.resolved}
          </div>
          <div style={{ fontSize: '14px', color: '#047857' }}>Resolved</div>
        </div>
        
        <div style={{
          padding: '20px',
          background: '#fef2f2',
          borderRadius: '8px',
          border: '2px solid #dc2626'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>
            {stats.critical + stats.high}
          </div>
          <div style={{ fontSize: '14px', color: '#991b1b' }}>High Priority</div>
        </div>
      </div>


      {/* Filters and Export */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          flexWrap: 'wrap', 
          alignItems: 'center',
          flex: '1'
        }}>
        <input
          type="text"
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '200px',
            flex: '1',
            maxWidth: '300px',
            outline: 'none',
            transition: 'border-color 0.2s',
            ':focus': {
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
            }
          }}
        />
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '140px',
            background: 'white',
            color: '#1f2937',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="all" style={{ color: '#1f2937' }}>All Statuses</option>
          <option value="open" style={{ color: '#1f2937' }}>Open</option>
          <option value="in-progress" style={{ color: '#1f2937' }}>In Progress</option>
          <option value="resolved" style={{ color: '#1f2937' }}>Resolved</option>
          <option value="closed" style={{ color: '#1f2937' }}>Closed</option>
        </select>
        
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '140px',
            background: 'white',
            color: '#1f2937',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="all" style={{ color: '#1f2937' }}>All Severities</option>
          <option value="critical" style={{ color: '#1f2937' }}>Critical</option>
          <option value="high" style={{ color: '#1f2937' }}>High</option>
          <option value="medium" style={{ color: '#1f2937' }}>Medium</option>
          <option value="low" style={{ color: '#1f2937' }}>Low</option>
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '160px',
            background: 'white',
            color: '#1f2937',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="date-desc" style={{ color: '#1f2937' }}>📅 Newest First</option>
          <option value="date-asc" style={{ color: '#1f2937' }}>📅 Oldest First</option>
          <option value="severity-desc" style={{ color: '#1f2937' }}>⚠️ By Severity</option>
        </select>
        </div>
        
        {/* Export Button */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          flexShrink: 0
        }}>
          <button
            onClick={() => {
              console.log('🔍 Export button clicked!');
              exportToCSV();
            }}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
              minWidth: 'fit-content'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)';
            }}
          >
            <span>📊</span>
            Export CSV ({filteredReports.length} reports)
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        {/* Sort Info */}
        <div style={{
          padding: '12px 16px',
          background: '#f8fafc',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '13px',
          color: '#6b7280',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            Showing {sortedReports.length} of {securityReports.length} reports • 
            Sorted by {
              sortBy === 'date-desc' ? 'Date (Newest First)' :
              sortBy === 'date-asc' ? 'Date (Oldest First)' :
              sortBy === 'severity-desc' ? 'Severity (High to Low)' : 'Date'
            }
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af' }}>
            Click column headers to sort
          </div>
        </div>
        
        {sortedReports.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
            <h3 style={{ margin: '0 0 8px 0' }}>No Security Reports Found</h3>
            <p style={{ margin: 0 }}>
              {securityReports.length === 0 
                ? "No security reports have been submitted yet."
                : "No reports match your current filters."
              }
            </p>
          </div>
        ) : (
          <div style={{
            overflowX: 'auto',
            fontSize: isMobile ? '12px' : '14px'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              tableLayout: 'fixed', // Fixed layout for better control
              minWidth: '800px' // Ensure table doesn't get too cramped on small screens
            }}>
              <thead>
                <tr style={{ 
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: '#374151',
                    fontSize: '13px',
                    width: '12%',
                    whiteSpace: 'nowrap'
                  }}>
                    Report ID
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: '#374151',
                    fontSize: '13px',
                    width: '15%',
                    whiteSpace: 'nowrap'
                  }}>
                    Type
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: '#374151',
                    fontSize: '13px',
                    width: '25%'
                  }}>
                    Subject
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: '#374151',
                    fontSize: '13px',
                    width: '18%'
                  }}>
                    Reporter
                  </th>
                  <th 
                    onClick={() => handleColumnSort('severity')}
                    style={{ 
                      padding: '12px 8px', 
                      textAlign: 'left', 
                      fontWeight: '600', 
                      color: '#374151',
                      fontSize: '13px',
                      width: '10%',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Severity{getSortIcon('severity')}
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    color: '#374151',
                    fontSize: '13px',
                    width: '8%',
                    whiteSpace: 'nowrap'
                  }}>
                    Status
                  </th>
                  <th 
                    onClick={() => handleColumnSort('date')}
                    style={{ 
                      padding: '12px 8px', 
                      textAlign: 'left', 
                      fontWeight: '600', 
                      color: '#374151',
                      fontSize: '13px',
                      width: '8%',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Date{getSortIcon('date')}
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    color: '#374151',
                    fontSize: '13px',
                    width: '4%',
                    whiteSpace: 'nowrap'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedReports.map((report, index) => (
                  <tr 
                    key={report.id} 
                    style={{ 
                      borderTop: index > 0 ? '1px solid #e5e7eb' : 'none',
                      backgroundColor: (report.formData?.severity || report.severity) === 'critical' ? '#fef2f2' : 
                                     (report.formData?.severity || report.severity) === 'high' ? '#fef7ed' : 'white',
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      const currentBg = (report.formData?.severity || report.severity) === 'critical' ? '#fef2f2' : 
                                       (report.formData?.severity || report.severity) === 'high' ? '#fef7ed' : 'white';
                      e.currentTarget.style.backgroundColor = currentBg === 'white' ? '#f8fafc' : 
                                                            currentBg === '#fef7ed' ? '#fed7aa' : '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                      const originalBg = (report.formData?.severity || report.severity) === 'critical' ? '#fef2f2' : 
                                        (report.formData?.severity || report.severity) === 'high' ? '#fef7ed' : 'white';
                      e.currentTarget.style.backgroundColor = originalBg;
                    }}
                  >
                    <td style={{ padding: '12px 8px', fontSize: '12px', fontFamily: 'monospace', color: '#1f2937' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {report.id}
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '12px', color: '#1f2937' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '14px' }}>
                          {getIncidentTypeIcon(report.formData?.incidentType || report.type)}
                        </span>
                        <span style={{ 
                          textTransform: 'capitalize', 
                          color: '#1f2937', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {(report.formData?.incidentType || report.type)?.replace('-', ' ') || 'Security'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '12px', color: '#1f2937' }}>
                      <div style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap'
                      }} title={report.formData?.subject || report.details?.subject || report.reason}>
                        {report.formData?.subject || report.details?.subject || report.reason}
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '12px', color: '#1f2937' }}>
                      <div>
                        <div style={{ 
                          fontWeight: '500', 
                          color: '#1f2937', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {report.userInfo?.name || 'Unknown'}
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          color: '#6b7280', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {report.userInfo?.email}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      {getSeverityBadge(report.formData?.severity || report.severity || report.details?.severity)}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      {getStatusBadge(report.status)}
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleViewReport(report)}
                        style={{
                          padding: '4px 8px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                          outline: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#2563eb';
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#3b82f6';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      {showReportModal && selectedReport && (
        <SecurityReportModal
          report={selectedReport}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default SecurityDashboard;