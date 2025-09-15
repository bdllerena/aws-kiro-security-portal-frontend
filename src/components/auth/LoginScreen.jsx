// LoginScreen.jsx - Login screen component
import React from 'react';
import CompanyLogo from '../common/CompanyLogo.jsx';
import MicrosoftLoginButton from './MicrosoftLoginButton.jsx';

const LoginScreen = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #f3f6fc 0%, #e8f2ff 100%)",
      padding: "32px"
    }}>
      <CompanyLogo size="large" />
      <div style={{
        background: "white",
        padding: "56px",
        borderRadius: "16px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        textAlign: "center",
        maxWidth: "480px",
        width: "100%",
        border: "1px solid rgba(255, 255, 255, 0.8)"
      }}>
        <h2 style={{
          margin: "0 0 20px 0",
          fontSize: "28px",
          fontWeight: "700",
          color: "#1f2937",
          letterSpacing: "-0.025em"
        }}>
          🛡️ Security Incident Portal
        </h2>
        <p style={{
          margin: "0 0 40px 0",
          color: "#6b7280",
          fontSize: "16px",
          lineHeight: "1.6",
          maxWidth: "400px"
        }}>
          Please sign in with your Microsoft account to report security incidents and access the portal.
        </p>
        <div style={{
          display: "flex",
          justifyContent: "center"
        }}>
          <MicrosoftLoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;