# Company Security Portal - Frontend

A modern React-based frontend for the Company Security Portal, providing an intuitive interface for security incident reporting and management.

## 🚀 Features

- **Incident Reporting**: User-friendly forms for reporting various security incidents
- **Admin Dashboard**: Comprehensive dashboard for security team management
- **Microsoft Azure AD Integration**: Secure single sign-on authentication
- **Real-time Updates**: Live status updates for reported incidents
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Export Capabilities**: CSV export functionality for security reports

## 🛠️ Technology Stack

- **React 19** - Frontend framework
- **Vite** - Build tool and development server
- **Azure MSAL** - Microsoft Authentication Library
- **Modern CSS** - Responsive styling without external frameworks

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Azure AD application configured

## ⚙️ Installation

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd company-security-portal-frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
cp env.example .env
```

Edit the `.env` file with your actual values:
```env
# Azure AD Configuration
VITE_AZURE_CLIENT_ID=your-azure-client-id-here
VITE_AZURE_TENANT_ID=your-azure-tenant-id-here

# API Configuration
VITE_API_GATEWAY_URL=your-api-gateway-url-here
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```
This creates a `dist/` folder with optimized production files.

### Preview Production Build
```bash
npm run preview
```
Preview the production build locally.

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── admin/          # Admin dashboard components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (Logo, Modals, etc.)
│   ├── forms/          # Form components
│   └── user/           # User-specific components
├── config/             # Configuration files
│   ├── api.js          # API configuration
│   ├── constants.js    # Application constants
│   ├── msalConfig.js   # Azure AD configuration
│   └── roles.js        # User role definitions
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

## 🔧 Configuration

### Azure AD Setup
1. Register an application in Azure AD
2. Configure redirect URIs for your domain
3. Add the Client ID and Tenant ID to your `.env` file

### API Integration
The frontend communicates with the backend Lambda API. Make sure to:
1. Set the correct API Gateway URL in your environment variables
2. Ensure CORS is properly configured on the backend
3. Configure proper authentication headers

## 🚀 Deployment

### Static Hosting (Recommended)
After building, deploy the `dist/` folder to any static hosting service:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your Git repository
- **AWS S3 + CloudFront**: Upload to S3 bucket
- **GitHub Pages**: Use GitHub Actions for deployment

### Environment-Specific Builds
Create different `.env` files for different environments:
- `.env.development`
- `.env.staging`
- `.env.production`

## 🔒 Security Considerations

- All sensitive configuration is stored in environment variables
- Azure AD handles authentication and authorization
- API communications use HTTPS
- Input validation on all forms
- XSS protection through React's built-in sanitization

## 🐛 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Verify Azure AD configuration
   - Check redirect URIs match your domain
   - Ensure Client ID and Tenant ID are correct

2. **API calls failing**
   - Verify API Gateway URL is correct
   - Check CORS configuration on backend
   - Ensure authentication tokens are being sent

3. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check for TypeScript errors if using TypeScript

## 📝 Development Guidelines

- Use functional components with hooks
- Follow React best practices
- Implement proper error handling
- Add loading states for async operations
- Use meaningful component and variable names
- Comment complex logic

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For technical support or questions, contact your IT administrator at admin@company.net.

## 📄 License

This project is proprietary software. All rights reserved.
