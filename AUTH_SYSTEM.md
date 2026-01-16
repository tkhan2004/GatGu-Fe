# Authentication System Documentation

## Overview
Professional authentication system with token management, auto-refresh, and protected routes.

## Features

### 1. Token Management
- **Access Token**: Short-lived token for API requests
- **Refresh Token**: Long-lived token to get new access tokens
- **Auto Refresh**: Automatically refreshes expired access tokens
- **Persistent Storage**: Tokens stored in localStorage

### 2. Protected Routes
Routes that require authentication:
- `/driver-dashboard` - Driver dashboard
- `/monitoring` - Real-time monitoring
- `/vehicle-setup` - Vehicle configuration

### 3. Auto Token Refresh
- When API returns 401, automatically tries to refresh token
- If refresh succeeds, retries the original request
- If refresh fails, redirects to login

### 4. User Data Persistence
- User data cached in localStorage
- Fast initial load from cache
- Background verification of token validity

## Usage

### Login Flow
```javascript
const { login } = useAuth();

const handleLogin = async () => {
  const result = await login(username, password);
  if (result.success) {
    // Redirect to dashboard
    navigate('/driver-dashboard');
  } else {
    // Show error
    showError(result.error);
  }
};
```

### Check Authentication
```javascript
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log('User:', user);
}
```

### Logout
```javascript
const { logout } = useAuth();

const handleLogout = () => {
  logout(); // Clears tokens and redirects to login
};
```

### Protected Component
```javascript
import ProtectedRoute from './components/auth/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## API Service Methods

### Authentication
- `login(username, password)` - Login and store tokens
- `logout()` - Clear all tokens
- `getCurrentUser()` - Get current user data
- `isAuthenticated()` - Check if user is logged in

### Token Management
- `getAccessToken()` - Get access token
- `getRefreshToken()` - Get refresh token
- `refreshAccessToken()` - Refresh access token
- `removeTokens()` - Clear all tokens

### User Data
- `getStoredUser()` - Get cached user data
- `setStoredUser(user)` - Cache user data
- `updateUser(userData)` - Update user profile

## Security Features

1. **Token Expiry Handling**: Auto-refresh on 401
2. **Secure Storage**: Tokens in localStorage (consider httpOnly cookies for production)
3. **Session Validation**: Background token verification
4. **Auto Logout**: On refresh failure
5. **Protected Routes**: Redirect to login if not authenticated

## Backend Requirements

Your backend should support:

```python
# Login endpoint
POST /users/token
Body: username, password (form-urlencoded)
Response: { access_token, refresh_token }

# Refresh endpoint (if supported)
POST /users/refresh
Body: { refresh_token }
Response: { access_token, refresh_token }

# Current user endpoint
GET /users/me
Headers: Authorization: Bearer {access_token}
Response: { id, email, name, ... }
```

## Migration Notes

If your backend doesn't support refresh tokens yet:
- System will work with access tokens only
- Users will need to re-login when token expires
- To add refresh token support, implement `/users/refresh` endpoint

## Best Practices

1. **Token Lifetime**:
   - Access token: 15-30 minutes
   - Refresh token: 7-30 days

2. **Security**:
   - Use HTTPS in production
   - Consider httpOnly cookies for tokens
   - Implement CSRF protection

3. **User Experience**:
   - Show loading states during auth check
   - Preserve redirect location after login
   - Clear error messages

## Troubleshooting

### User gets logged out frequently
- Check access token expiration time
- Verify refresh token endpoint works
- Check network connectivity

### Infinite redirect loop
- Check ProtectedRoute logic
- Verify token storage
- Check initial auth state

### Token not persisting
- Check localStorage availability
- Verify token storage logic
- Check browser privacy settings
