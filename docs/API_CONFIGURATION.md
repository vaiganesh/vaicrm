# API Configuration Guide

This document explains how to configure the API base URL and connection settings for the AZAM TV Portal application.

## Overview

The application now supports configurable API base URLs, allowing you to connect to different backend servers based on your deployment environment or development needs.

## Configuration Methods

### 1. Environment Variables (Recommended)

Create a `.env` file in the project root with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=/api
VITE_API_TIMEOUT=30000
VITE_API_RETRIES=3
```

### 2. Runtime Configuration Panel

Access the API Configuration panel through:
1. Click the user profile dropdown in the top-right corner
2. Select "API Configuration"
3. Configure settings and test connections in real-time

### 3. Programmatic Configuration

```typescript
import { setApiConfig, setEnvironment } from '@/lib/config';

// Set custom configuration
setApiConfig({
  baseUrl: 'https://api.example.com/api',
  timeout: 30000,
  retries: 3
});

// Or use environment presets
setEnvironment('production');
```

## Configuration Options

### Base URL Examples

| Environment | Base URL | Description |
|-------------|----------|-------------|
| **Development** | `/api` | Relative path, uses same origin |
| **Local Backend** | `http://localhost:5000/api` | Local Express server |
| **Docker** | `http://backend:5000/api` | Docker container network |
| **Staging** | `https://staging-api.azamtv.com/api` | Staging server |
| **Production** | `https://api.azamtv.com/api` | Production server |

### Parameters

- **baseUrl**: The root URL for all API requests
- **timeout**: Request timeout in milliseconds (default: 30000)
- **retries**: Number of retry attempts for failed requests (default: 3)

## Environment Presets

The application includes predefined configurations for common environments:

```typescript
const API_CONFIGS = {
  development: {
    baseUrl: '/api',
    timeout: 30000,
    retries: 3
  },
  local: {
    baseUrl: 'http://localhost:5000/api',
    timeout: 30000,
    retries: 3
  },
  staging: {
    baseUrl: 'https://staging-api.azamtv.com/api',
    timeout: 30000,
    retries: 3
  },
  production: {
    baseUrl: 'https://api.azamtv.com/api',
    timeout: 20000,
    retries: 2
  }
};
```

## Testing Connections

The API Configuration panel includes a "Test Connection" feature that:
- Attempts to connect to the configured API endpoint
- Shows connection status (Success/Failed)
- Displays error messages for troubleshooting
- Respects the configured timeout settings

## Backend Compatibility

### Expected Endpoints

The backend should provide these standard endpoints:

- `GET /api/health` - Health check endpoint
- `POST /api/auth/login` - Authentication
- `GET /api/dashboard/stats` - Dashboard statistics
- All other API endpoints as defined in the application

### CORS Configuration

Ensure your backend allows requests from your frontend domain:

```javascript
// Express.js example
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true
}));
```

## Deployment Scenarios

### 1. Same-Origin Deployment
```env
VITE_API_BASE_URL=/api
```
Frontend and backend served from the same domain.

### 2. Separate Backend Server
```env
VITE_API_BASE_URL=https://api.azamtv.com/api
```
Backend hosted on a different domain or subdomain.

### 3. Docker Compose
```env
VITE_API_BASE_URL=http://backend:5000/api
```
Using Docker container networking.

### 4. Development with Local Backend
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Frontend on Vite dev server, backend on local Express server.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from frontend origin
2. **Connection Refused**: Check if backend server is running
3. **404 Errors**: Verify API base URL matches backend routing
4. **Timeout Errors**: Increase timeout value or check network connectivity

### Error Messages

- `Failed to connect: TypeError: Failed to fetch` - Network/CORS issue
- `Server responded with status: 404` - Incorrect API base URL
- `Connection timeout` - Backend not responding within timeout period

### Debug Steps

1. Use the "Test Connection" feature in the API Configuration panel
2. Check browser developer tools Network tab
3. Verify backend server logs
4. Test API endpoints directly with curl or Postman

## Migration from Fixed URLs

If migrating from hardcoded API URLs:

1. All existing API calls will continue to work
2. The system automatically uses the configured base URL
3. No code changes required for existing functionality
4. Simply configure the new base URL through environment variables or the UI

## Best Practices

1. **Use Environment Variables**: Set API configuration through `.env` files
2. **Test Connections**: Always test API connectivity after configuration changes
3. **Monitor Performance**: Adjust timeout and retry settings based on network conditions
4. **Security**: Use HTTPS for production API endpoints
5. **Fallback**: Have a backup API endpoint configured for redundancy

## API Client Architecture

The application uses a centralized API client system:

```typescript
// All API clients inherit from BaseApiClient
class BaseApiClient {
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || getApiConfig().baseUrl;
  }
  
  private async request(method, endpoint, data, params) {
    const fullUrl = buildApiUrl(endpoint, this.baseUrl);
    // ... rest of implementation
  }
}

// Specialized API clients
export const authApi = new AuthApiClient();
export const dashboardApi = new DashboardApiClient();
export const agentApi = new AgentApiClient();
// ... etc
```

This ensures all API requests use the configured base URL consistently across the application.