# Admin Login Setup Instructions

## Overview

This document provides setup instructions for the newly implemented admin authentication system for the DriveFitt admin portal.

## Database Setup

### 1. Create Admin Users Table

Run the SQL script to create the admin users table and insert a default admin user:

```bash
# Execute the SQL file in your MySQL database
mysql -u your_username -p your_database_name < create-admin-users-table.sql
```

### 2. Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@drivefitt.com`

## Environment Variables

Ensure the following environment variables are set in your `.env.local` file:

```env
# JWT Secret for token signing
JWT_SECRET=your_jwt_secret_key_here

# Database connection (if not already set)
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

## Features Implemented

### 1. Authentication System

- ✅ JWT-based authentication with 24-hour token expiry
- ✅ Bcrypt password hashing (salt rounds: 10)
- ✅ Secure token storage in localStorage
- ✅ Automatic token verification on page load

### 2. API Endpoints

- ✅ `POST /api/admin-auth/login` - Admin login
- ✅ `POST /api/admin-auth/verify` - Token verification
- ✅ `POST /api/admin-auth/logout` - Admin logout

### 3. UI Components

- ✅ Dark-themed login page matching admin portal design
- ✅ Form validation and error handling
- ✅ Loading states and user feedback
- ✅ Password visibility toggle

### 4. Route Protection

- ✅ Automatic redirect to login for unauthenticated users
- ✅ Persistent authentication across browser sessions
- ✅ Logout functionality with token cleanup

### 5. Integration

- ✅ All admin pages now use real authenticated user data
- ✅ Removed all mock user references
- ✅ Integrated logout functionality in admin header

## How to Use

### 1. Access Admin Portal

1. Navigate to `/admin-portal`
2. You'll be redirected to the login page if not authenticated
3. Enter credentials: `admin` / `admin123`
4. Upon successful login, you'll be redirected to the dashboard

### 2. Session Management

- Sessions persist across browser tabs and page refreshes
- Tokens expire after 24 hours
- Users are automatically logged out on token expiry
- Manual logout available via user dropdown in admin header

### 3. Adding New Admin Users

To add new admin users, insert records into the `admin_users` table:

```sql
INSERT INTO admin_users (username, password, email, name, status) VALUES
('newadmin', '$2b$10$hashedpasswordhere', 'newadmin@drivefitt.com', 'New Admin', 'active');
```

**Note**: Always hash passwords using bcrypt before inserting.

## Security Features

### 1. Password Security

- Passwords are hashed using bcrypt with 10 salt rounds
- Plain text passwords are never stored in the database
- Password comparison is done server-side

### 2. Token Security

- JWT tokens include admin ID, username, email, and name
- Tokens are signed with a secret key
- 24-hour expiration prevents long-term token abuse
- Tokens are verified on every protected route access

### 3. Input Validation

- Username and password are required for login
- Server-side validation prevents empty credentials
- SQL injection protection through parameterized queries

## Troubleshooting

### 1. Login Issues

- **Invalid credentials**: Check username/password combination
- **Database connection**: Verify database is running and accessible
- **Environment variables**: Ensure JWT_SECRET is set

### 2. Token Issues

- **Session expired**: Tokens expire after 24 hours, login again
- **Invalid token**: Clear localStorage and login again
- **Database user inactive**: Check user status in admin_users table

### 3. Development Issues

- **CORS errors**: Ensure API routes are properly configured
- **Build errors**: Check all imports and dependencies
- **TypeScript errors**: Verify all type definitions are correct

## File Structure

```
src/
├── app/api/admin-auth/
│   ├── login/route.ts          # Login API endpoint
│   ├── verify/route.ts         # Token verification endpoint
│   └── logout/route.ts         # Logout API endpoint
├── components/AdminPortal/
│   └── AdminLogin.tsx          # Login UI component
├── hooks/
│   └── useAdminAuth.ts         # Authentication hook
└── lib/
    └── jwtService.ts           # JWT utilities (enhanced)
```

## Next Steps

### 1. Optional Enhancements

- Add password reset functionality
- Implement role-based permissions
- Add session timeout warnings
- Enable two-factor authentication

### 2. Production Considerations

- Use environment-specific JWT secrets
- Implement token blacklisting for enhanced security
- Add rate limiting to login endpoints
- Set up proper logging and monitoring

## Support

For any issues or questions regarding the admin authentication system, refer to the implementation files or contact the development team.
