// PhishingReportForm.jsx - Phishing report submission form
import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import CompanyLogo from '../common/CompanyLogo.jsx';
import SuccessModal from '../common/SuccessModal.jsx';
import ErrorModal from '../common/ErrorModal.jsx';
import { DEPARTMENTS } from '../../config/constants.js';
import { useRequests } from '../../hooks/useRequests.js';

const INCIDENT_TYPES = [
    { value: 'phishing-email', label: '📧 Phishing Email' },
    { value: 'suspicious-website', label: '🌐 Suspicious Website' },
    { value: 'social-engineering', label: '👥 Social Engineering' },
    { value: 'malware', label: '🦠 Malware/Virus' },
    { value: 'data-breach', label: '🔓 Suspected Data Breach' },
    { value: 'identity-theft', label: '🆔 Identity Theft' },
    { value: 'other', label: '❓ Other Security Incident' }
];

const SEVERITY_LEVELS = [
    { value: 'low', label: '🟢 Low - Suspicious but no immediate threat', color: '#10b981' },
    { value: 'medium', label: '🟡 Medium - Potential security risk', color: '#f59e0b' },
    { value: 'high', label: '🔴 High - Active threat or compromise', color: '#ef4444' },
    { value: 'critical', label: '🚨 Critical - Immediate action required', color: '#dc2626' }
];

const PhishingReportForm = () => {
    const { accounts } = useMsal();
    const user = accounts[0];
    const { createRequest } = useRequests(user?.homeAccountId, false);

    const [formData, setFormData] = useState({
        department: '',
        incidentType: '',
        otherIncidentType: '',
        severity: '',
        subject: '',
        description: '',
        senderEmail: '',
        suspiciousUrl: '',
        attachmentNames: '',
        dateOccurred: '',
        timeOccurred: '',
        affectedSystems: '',
        actionsTaken: '',
        additionalContacts: ''
    });

    const [showOtherIncident, setShowOtherIncident] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submittedReportId, setSubmittedReportId] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorDetails, setErrorDetails] = useState(null);

    // Extract user information from Microsoft account
    const getUserInfo = () => {
        if (!user) return { firstName: '', lastName: '', email: '' };

        const name = user.name || '';
        const email = user.username || '';

        const nameParts = name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        return { firstName, lastName, email };
    };

    const userInfo = getUserInfo();

    const handleIncidentTypeChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, incidentType: value }));
        setShowOtherIncident(value === 'other');

        if (value !== 'other') {
            setFormData(prev => ({ ...prev, otherIncidentType: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Phishing report submitted:', formData);

        try {
            // Prepare the request data for phishing reports
            const requestData = {
                userInfo: {
                    email: user?.username || user?.preferred_username,
                    name: user?.name,
                    firstName: user?.given_name,
                    lastName: user?.family_name,
                    department: formData.department
                },
                type: 'phishing-report',
                reason: `${formData.incidentType === 'other' ? formData.otherIncidentType : formData.incidentType} - ${formData.subject}`,
                details: {
                    ...formData,
                    reportType: 'security-incident',
                    submittedAt: new Date().toISOString(),
                    status: 'open'
                },
                formData: formData
            };

            // Submit to backend
            const response = await createRequest(requestData);

            if (response) {
                setSubmittedReportId(response.id || `SEC-${Date.now().toString(36).toUpperCase()}`);
                setShowSuccessModal(true);

                // Reset form after successful submission
                setFormData({
                    department: '',
                    incidentType: '',
                    otherIncidentType: '',
                    severity: '',
                    subject: '',
                    description: '',
                    senderEmail: '',
                    suspiciousUrl: '',
                    attachmentNames: '',
                    dateOccurred: '',
                    timeOccurred: '',
                    affectedSystems: '',
                    actionsTaken: '',
                    additionalContacts: ''
                });
                setShowOtherIncident(false);
            }
        } catch (error) {
            console.error('Failed to submit phishing report:', error);
            setErrorDetails({
                message: error.message,
                status: error.status || 'Unknown',
                details: error.toString()
            });
            setShowErrorModal(true);
        }
    };

    const getSeverityColor = (severity) => {
        const level = SEVERITY_LEVELS.find(s => s.value === severity);
        return level ? level.color : '#6b7280';
    };

    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '32px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e7eb'
            }}>
                <CompanyLogo size="medium" />
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: '#fef2f2',
                    borderRadius: '6px',
                    border: '1px solid #fecaca'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#ef4444'
                    }}></div>
                    <span style={{ fontSize: '14px', color: '#dc2626', fontWeight: '500' }}>
                        Security Report
                    </span>
                </div>
            </div>

            {/* Form Title */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                    margin: '0 0 8px 0',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#1f2937'
                }}>
                    🛡️ Security Incident Report
                </h2>
                <p style={{
                    margin: 0,
                    color: '#6b7280',
                    fontSize: '16px'
                }}>
                    Report phishing attempts, suspicious activities, or security incidents. Your report helps protect our organization.
                </p>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Required Fields Section */}
                <div style={{
                    padding: '20px',
                    background: '#fef2f2',
                    borderRadius: '8px',
                    border: '1px solid #fecaca'
                }}>
                    <h3 style={{
                        margin: '0 0 20px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>⚠️</span>
                        Required Information
                    </h3>

                    {/* User Information */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                Reporter Name *
                            </label>
                            <input
                                type="text"
                                value={`${userInfo.firstName} ${userInfo.lastName}`}
                                readOnly
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#f9fafb',
                                    color: '#6b7280',
                                    cursor: 'not-allowed'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={userInfo.email}
                                readOnly
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box',
                                    backgroundColor: '#f9fafb',
                                    color: '#6b7280',
                                    cursor: 'not-allowed'
                                }}
                            />
                        </div>
                    </div>

                    {/* Department */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Department *
                        </label>
                        <select
                            required
                            value={formData.department}
                            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                background: 'white',
                                color: '#1f2937'
                            }}
                        >
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept.value} value={dept.value}>
                                    {dept.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Incident Type */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Incident Type *
                        </label>
                        <select
                            required
                            value={formData.incidentType}
                            onChange={handleIncidentTypeChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                background: 'white',
                                color: '#1f2937'
                            }}
                        >
                            <option value="">Select Incident Type</option>
                            {INCIDENT_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Other Incident Type Input */}
                    {showOtherIncident && (
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                Specify Other Incident Type *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.otherIncidentType}
                                onChange={(e) => setFormData(prev => ({ ...prev, otherIncidentType: e.target.value }))}
                                maxLength="100"
                                placeholder="Please specify the type of security incident..."
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    )}

                    {/* Severity Level */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Severity Level *
                        </label>
                        <select
                            required
                            value={formData.severity}
                            onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                background: 'white',
                                color: getSeverityColor(formData.severity)
                            }}
                        >
                            <option value="">Select Severity Level</option>
                            {SEVERITY_LEVELS.map(level => (
                                <option key={level.value} value={level.value} style={{ color: level.color }}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subject */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Subject/Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                            maxLength="200"
                            placeholder="Brief description of the incident..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Date Occurred */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Date Occurred *
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.dateOccurred}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateOccurred: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Detailed Description *
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows="4"
                            maxLength="1000"
                            placeholder="Please provide a detailed description of the incident, including what happened, what you observed, and any suspicious behavior..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                resize: 'vertical',
                                minHeight: '100px'
                            }}
                        />
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                            {formData.description.length}/1000 characters
                        </div>
                    </div>
                </div>

                {/* Optional Fields Section */}
                <div style={{
                    padding: '20px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        margin: '0 0 20px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>📝</span>
                        Optional Information
                        <span style={{ fontSize: '14px', fontWeight: '400', color: '#64748b' }}>
                            (Provide if applicable)
                        </span>
                    </h3>

                    {/* Time Occurred */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Time Occurred
                        </label>
                        <input
                            type="time"
                            value={formData.timeOccurred}
                            onChange={(e) => setFormData(prev => ({ ...prev, timeOccurred: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Sender Email (for phishing emails) */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Sender Email Address
                            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '400' }}>
                                {' '}(if applicable)
                            </span>
                        </label>
                        <input
                            type="email"
                            value={formData.senderEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, senderEmail: e.target.value }))}
                            placeholder="suspicious@example.com"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Suspicious URL */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Suspicious URL/Website
                            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '400' }}>
                                {' '}(if applicable)
                            </span>
                        </label>
                        <input
                            type="url"
                            value={formData.suspiciousUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, suspiciousUrl: e.target.value }))}
                            placeholder="https://suspicious-website.com"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Attachment Names */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Attachment Names
                            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '400' }}>
                                {' '}(if any suspicious attachments were received)
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.attachmentNames}
                            onChange={(e) => setFormData(prev => ({ ...prev, attachmentNames: e.target.value }))}
                            placeholder="e.g., invoice.pdf, document.docx"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Affected Systems */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Affected Systems/Applications
                        </label>
                        <input
                            type="text"
                            value={formData.affectedSystems}
                            onChange={(e) => setFormData(prev => ({ ...prev, affectedSystems: e.target.value }))}
                            placeholder="e.g., Email, CRM, Database"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Actions Taken */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Actions Already Taken
                        </label>
                        <textarea
                            value={formData.actionsTaken}
                            onChange={(e) => setFormData(prev => ({ ...prev, actionsTaken: e.target.value }))}
                            rows="3"
                            maxLength="500"
                            placeholder="Describe any actions you've already taken (e.g., deleted email, changed passwords, disconnected from network)..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    {/* Additional Contacts */}
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Additional Contacts
                            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '400' }}>
                                {' '}(others who should be notified)
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.additionalContacts}
                            onChange={(e) => setFormData(prev => ({ ...prev, additionalContacts: e.target.value }))}
                            placeholder="manager@company.com, security@company.com"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div style={{ marginTop: '32px' }}>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                    >
                        🚨 Submit Security Report
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            {showSuccessModal && (
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => {
                        setShowSuccessModal(false);
                    }}
                    title="Security Report Submitted Successfully!"
                    message={`Thank you for your report (ID: ${submittedReportId}). The IT security team will investigate this incident and take appropriate action.`}
                    requestId={submittedReportId}
                    nextSteps={[
                        "The IT security team will investigate your report",
                        "You may be contacted if additional information is needed",
                        "Keep your report ID for reference"
                    ]}
                />
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <ErrorModal
                    isOpen={showErrorModal}
                    onClose={() => setShowErrorModal(false)}
                    title="Submission Failed"
                    message="There was an error submitting your security report. Please try again or contact IT support if the problem persists."
                    details={errorDetails}
                />
            )}
        </div>
    );
};

export default PhishingReportForm;