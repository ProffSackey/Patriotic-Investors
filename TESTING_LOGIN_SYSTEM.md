# Testing Guide for Role-Based Login System

## Overview
The system now supports role-based login for three staff roles:
- **account-manager**: Can manage accounts and view analytics
- **customer-service**: Can handle support tickets and complaints
- **executive**: Full system access, can manage admins and view reports

## Prerequisites
1. Ensure your Supabase database is set up with the admins table
2. Ensure the DEVELOPER_TOKEN is set in `.env.local` (default: `RaProSDAv205rR!`)

## Step 1: Create Admin Accounts (Developer Only)

### Create an Account Manager Account
```bash
curl -X POST http://localhost:3000/api/admin/create-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RaProSDAv205rR!" \
  -d '{
    "username": "john_manager",
    "email": "manager@patrioticinvestors.com",
    "password": "SecurePassword123!",
    "role": "account-manager"
  }'
```

### Create a Customer Service Account
```bash
curl -X POST http://localhost:3000/api/admin/create-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RaProSDAv205rR!" \
  -d '{
    "username": "jane_support",
    "email": "support@patrioticinvestors.com",
    "password": "SecurePassword123!",
    "role": "customer-service"
  }'
```

### Create an Executive Account
```bash
curl -X POST http://localhost:3000/api/admin/create-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RaProSDAv205rR!" \
  -d '{
    "username": "alex_exec",
    "email": "executive@patrioticinvestors.com",
    "password": "SecurePassword123!",
    "role": "executive"
  }'
```

## Step 2: Login with Created Accounts

### Login as Account Manager
1. Go to `http://localhost:3000/login`
2. Enter: `manager@patrioticinvestors.com` / `SecurePassword123!`
3. Should redirect to `/admin/account-manager`

### Login as Customer Service
1. Go to `http://localhost:3000/login`
2. Enter: `support@patrioticinvestors.com` / `SecurePassword123!`
3. Should redirect to `/admin/customer-service`

### Login as Executive
1. Go to `http://localhost:3000/login`
2. Enter: `executive@patrioticinvestors.com` / `SecurePassword123!`
3. Should redirect to `/admin/executives`

## Step 3: Verify Role-Based Access Control

### Test Account Manager Access
- Account manager can access `/admin/account-manager` ✓
- Account manager trying to access `/admin/customer-service` should redirect to login ✗
- Account manager trying to access `/admin/executives` should redirect to login ✗

### Test Customer Service Access
- Customer service can access `/admin/customer-service` ✓
- Customer service trying to access `/admin/account-manager` should redirect to login ✗
- Customer service trying to access `/admin/executives` should redirect to login ✗

### Test Executive Access
- Executive can access `/admin/executives` ✓
- Executive trying to access `/admin/account-manager` should redirect to login ✗
- Executive trying to access `/admin/customer-service` should redirect to login ✗

## Features Implemented

### 1. **Authentication**
- Login endpoint checks the `admins` table
- Admin users are authenticated and receive a session cookie
- Session data is stored in browser's localStorage

### 2. **Role-Based Authorization**
- Each role has specific permissions:
  - **account-manager**: manage-accounts, view-analytics, manage-registrations
  - **customer-service**: support-users, handle-complaints, view-tickets
  - **executive**: full-access, manage-admins, view-reports, manage-fees

### 3. **Protected Routes**
- Middleware (`middleware.ts`) protects all `/admin/*` routes
- Users without proper authentication are redirected to login
- Users with wrong role are redirected to login

### 4. **Dashboard Redirects**
- Upon login, users are automatically redirected to their role-specific dashboard:
  - Account managers → `/admin/account-manager`
  - Customer service → `/admin/customer-service`
  - Executives → `/admin/executives`

### 5. **Logout Functionality**
- Each dashboard has a logout button
- Logout clears localStorage and redirects to login

## Files Modified

1. **middleware.ts** - NEW - Protects admin routes and enforces role-based access
2. **app/login/page.tsx** - Updated to handle role-based redirects
3. **app/admin/account-manager/page.tsx** - Added auth check and role verification
4. **app/admin/customer-service/page.tsx** - Added auth check and role verification
5. **app/admin/executives/page.tsx** - Added auth check and role verification

## API Endpoints

### Create Admin Account (Developer Only)
- **URL**: `/api/admin/create-account`
- **Method**: POST
- **Headers**: `Authorization: Bearer <DEVELOPER_TOKEN>`
- **Body**: `{ username, email, password, role }`
- **Response**: Created admin object with permissions

### Login
- **URL**: `/api/login`
- **Method**: POST
- **Body**: `{ email, password }`
- **Response**: Admin/User object with session cookie

## Security Notes

⚠️ **Important**: The current implementation has some security considerations:
1. Passwords are stored in plain text (should be hashed)
2. Session is stored in localStorage (vulnerable to XSS)
3. Consider implementing:
   - bcrypt for password hashing
   - JWT tokens for secure sessions
   - HTTPS only cookies
   - CSRF protection
