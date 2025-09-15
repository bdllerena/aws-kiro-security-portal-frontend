// CompanyLogo.jsx - Reusable company logo component
import React from 'react';

const CompanyLogo = ({ size = 'large' }) => {
  const sizes = {
    small: { width: '60px', height: '60px' },
    medium: { width: '90px', height: '90px' },
    large: { width: '120px', height: '120px' }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: size === 'large' ? '40px' : '20px'
    }}>
      <div
        style={{
          ...sizes[size],
          backgroundColor: '#2563eb',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: size === 'small' ? '12px' : size === 'medium' ? '14px' : '18px',
          fontWeight: 'bold'
        }}
      >
        Company.Net
      </div>
    </div>
  );
};

export default CompanyLogo;