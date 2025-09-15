// MicrosoftLoginButton.jsx - Microsoft authentication button
import React from 'react';
import { useMsal } from '@azure/msal-react';

const MicrosoftLoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect({
      scopes: [
        "openid", 
        "email", 
        "profile", 
        "User.Read",
        "People.Read"
      ],
    });
  };

  return (
    <button 
      onClick={handleLogin} 
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        background: "#fff",
        color: "#444",
        fontWeight: "600",
        fontFamily: "Segoe UI, Arial, sans-serif",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px 32px",
        fontSize: "16px",
        cursor: "pointer",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        transition: "all 0.2s ease-in-out",
        minWidth: "280px",
        outline: "none",
        position: "relative",
        overflow: "hidden"
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-1px)";
        e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
      }}
    >
      <span style={{
        width: 24, 
        height: 24, 
        borderRadius: 4, 
        background: "#fff",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        border: "1px solid #e1e1e1"
      }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
          alt="Microsoft Logo"
          width={20}
          height={20}
        />
      </span>
      Sign in with Microsoft
    </button>
  );
};

export default MicrosoftLoginButton;