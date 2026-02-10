# Supabase Session Storage & Green UI Implementation

## Overview
Complete migration from client-side localStorage to server-side Supabase sessions for both user and admin authentication. All blue UI elements changed to green.

---

## Part 1: Database Changes

### New Tables Created

#### 1. `user_sessions` Table
Stores user session tokens with expiration tracking.

```sql
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX user_sessions_user_id_idx ON user_sessions(user_id);
CREATE INDEX user_sessions_token_idx ON user_sessions(session_token);
```

**Purpose:** Stores session tokens for registered users after login/registration.
**Session Lifetime:** 7 days

#### 2. `admin_sessions` Table
Stores admin session tokens with expiration tracking.

```sql
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX admin_sessions_admin_id_idx ON admin_sessions(admin_id);
CREATE INDEX admin_sessions_token_idx ON admin_sessions(session_token);
```

**Purpose:** Stores session tokens for admin users after login.
**Session Lifetime:** 7 days

### Row-Level Security (RLS) Policies

```sql
-- User sessions RLS
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (user_id = auth.uid());

-- Admin sessions RLS (requires service role)
CREATE POLICY "Allow service role to manage admin sessions" ON admin_sessions
  USING (auth.role() = 'service_role');
```

---

## Part 2: Session Utility Refactoring

### Updated `lib/session.ts`

**New Session Functions:**

#### User Sessions
```typescript
// Create a new user session (called after registration/email verification)
createUserSession(userId: string): Promise<string | null>

// Validate user session token and fetch user data
validateUserSession(sessionToken: string): Promise<User | null>

// Get current authenticated user
getCurrentUser(): Promise<User | null>

// Check if user is authenticated
isUserAuthenticated(): boolean

// Check if user is verified
isUserVerified(): Promise<boolean>
```

#### Admin Sessions
```typescript
// Create a new admin session (called after admin login)
createAdminSession(adminId: string): Promise<string | null>

// Validate admin session token and fetch admin data
validateAdminSession(sessionToken: string): Promise<Admin | null>

// Get current authenticated admin
getCurrentAdmin(): Promise<Admin | null>

// Check if admin is authenticated
isAdminAuthenticated(): boolean
```

#### Session Management
```typescript
// Get session token from localStorage (only token, not user data)
getSessionToken(): string | null

// Get session type ("user" or "admin")
getSessionType(): "user" | "admin" | null

// Clear all session data
clearSession(): void
```

#### Database Queries
```typescript
// Fetch user from Supabase database
getUserFromDatabase(userId: string): Promise<User | null>

// Fetch admin from Supabase database
getAdminFromDatabase(adminId: string): Promise<Admin | null>
```

**What Changed:**
- Session tokens (not user data) are stored in localStorage
- Token validation includes expiration checking
- Expired sessions are automatically cleaned up from database
- User/admin data is always fetched fresh from Supabase
- Single source of truth is the database

---

## Part 3: File Updates

### 3.1 Authentication Pages

#### `app/register/page.tsx`
**Changes:**
- Removed: Multiple localStorage setItem calls
- Added: Import `createUserSession`
- After successful registration: Call `createUserSession(userId)`

**Flow:**
```
Register Form → Register API → User Created in DB
                                    ↓
                           createUserSession()
                                    ↓
                           Session created in Supabase
                                    ↓
                           Token stored in localStorage
```

#### `app/login/page.tsx`
**Changes:**
- Removed: localStorage.setItem("adminUser") and localStorage.setItem("user")
- Added: Imports for `createAdminSession` and `createUserSession`
- After successful login: Call appropriate `createXSession(id)`

**Admin Flow:**
```
Login Form → Login API → Admin Found
                           ↓
                    createAdminSession()
                           ↓
                    Session in admin_sessions table
                           ↓
                    Token in localStorage
                           ↓
                    Redirect to admin dashboard
```

**User Flow:**
```
Login Form → Login API → User Found
                           ↓
                    createUserSession()
                           ↓
                    Session in user_sessions table
                           ↓
                    Token in localStorage
                           ↓
                    Redirect to /member
```

#### `app/verify-email/page.tsx`
**Changes:**
- Removed: Multiple localStorage setItem calls
- Added: Import `createUserSession`
- After email verification: Call `createUserSession(userId)`

**Flow:**
```
Verification Link → Verify API → User verified=true
                                        ↓
                              createUserSession()
                                        ↓
                              Session created
                                        ↓
                              Redirect to /member
```

### 3.2 Protected Pages

#### `app/member/page.tsx`
**Changes:**
- Removed: localStorage.getItem() calls for user data
- Added: Imports for `getSessionToken`, `getSessionType`, `validateUserSession`, `clearSession`
- On load: Validates session token and fetches user from Supabase

**Flow:**
```
Page Load → getSessionToken()
              ↓
          validateUserSession(token)
              ↓
          Fetch user from Supabase
              ↓
          Display user data
```

#### `app/admin/account-manager/page.tsx`
#### `app/admin/customer-service/page.tsx`
#### `app/admin/executives/page.tsx`

**Changes (all three files):**
- Removed: localStorage.getItem("adminUser") and JSON.parse()
- Added: Imports for session validation functions
- On load: Validates session token and fetches admin from Supabase
- Verify role matches admin page requirements

**Flow:**
```
Page Load → getSessionToken()
              ↓
         getSessionType() === "admin"
              ↓
         validateAdminSession(token)
              ↓
         Verify role (account-manager/customer-service/executive)
              ↓
         Display admin dashboard
```

### 3.3 Components

#### `app/components/Navbar.tsx`
**Changes:**
- Removed: localStorage.getItem("adminUser") and JSON.parse()
- Added: Imports for session validation functions
- Changed admin interface field names: `firstName` → `first_name`, `lastName` → `last_name`
- On load: Validates admin session if exists
- Display admin name from validated session

---

## Part 4: Color Theme Changes

### Blue → Green Conversion

| Element | Old Class | New Class | Files |
|---------|-----------|-----------|-------|
| Text | `text-blue-600` | `text-green-600` | member, executives |
| Background | `bg-blue-50` | `bg-green-50` | member |
| Border | `border-blue-200` | `border-green-200` | member |
| Button | `bg-blue-600 hover:bg-blue-700` | `bg-green-600 hover:bg-green-700` | All pages with buttons |
| Spinner | `border-blue-200 border-t-blue-600` | `border-green-200 border-t-green-600` | verify-email |

### Files Updated for Color:
1. `app/admin/account-manager/page.tsx`
2. `app/admin/customer-service/page.tsx`
3. `app/admin/executives/page.tsx`
4. `app/member/page.tsx`
5. `app/verify-email/page.tsx`

---

## Part 5: Data Flow Diagrams

### User Registration & Verification Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User Registration                                             │
│    POST /api/register → User created in 'users' table           │
│                      → Email verification sent                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Create User Session                                          │
│    createUserSession(userId)                                    │
│      → Generate sessionToken                                    │
│      → Create record in 'user_sessions' table                  │
│      → Store sessionToken in localStorage                       │
│      → Return sessionToken                                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. User Clicks Verification Link                                │
│    /verify-email?token=<verification_token>                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Verify Email                                                 │
│    POST /api/verify-email                                       │
│      → Decode verification token                                │
│      → Update user.verified = true                              │
│      → Return user data                                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. Create User Session (for verified user)                      │
│    createUserSession(userId)                                    │
│      → Create NEW session in 'user_sessions' table             │
│      → Store sessionToken in localStorage                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. Member Dashboard Access                                      │
│    /member page loads                                           │
│      → getSessionToken() from localStorage                      │
│      → validateUserSession(token)                               │
│        • Check session exists in DB                             │
│        • Check not expired (7 days)                             │
│        • Auto-clean expired sessions                            │
│      → Fetch user data from 'users' table                       │
│      → Display user info                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Admin Login & Dashboard Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Admin Login                                                  │
│    POST /api/login (email & password)                           │
│      → Find admin in 'admins' table                             │
│      → Verify password                                          │
│      → Return admin data with role                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Create Admin Session                                         │
│    createAdminSession(adminId)                                  │
│      → Generate sessionToken                                    │
│      → Create record in 'admin_sessions' table                 │
│      → Store sessionToken + type="admin" in localStorage        │
│      → Return sessionToken                                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Redirect to Admin Dashboard                                  │
│    Based on role:                                               │
│      - account-manager → /admin/account-manager                │
│      - customer-service → /admin/customer-service              │
│      - executive → /admin/executives                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Dashboard Page Access                                        │
│    /admin/account-manager loads                                 │
│      → getSessionToken() from localStorage                      │
│      → getSessionType() === "admin"                             │
│      → validateAdminSession(token)                              │
│        • Check session exists in 'admin_sessions'              │
│        • Check not expired                                      │
│        • Fetch admin from 'admins' table                        │
│      → Verify admin.role matches page requirement               │
│      → Display admin dashboard                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Session Validation Process

```
                   validateUserSession(token)
                              ↓
              ┌───────────────────────────┐
              │ Query user_sessions table │
              │ WHERE session_token = X   │
              └───────────────────────────┘
                        ↓
            Found session record?
              ↙              ↖
            YES               NO → Return null
              ↓
    Check expiration:
    expires_at < NOW()?
      ↙            ↖
    YES             NO → Continue
      ↓
  Delete session
  Return null
      ↑
      ↓
    Query users table
    WHERE id = user_id
      ↓
  Return User data
```

---

## Part 6: localStorage Usage After Changes

### Before
```javascript
// 7+ items stored
userId
userEmail
firstName
lastName
phone
verified
createdAt
adminUser (entire JSON object)
```

### After
```javascript
// Only 2 items stored
session_token    // Opaque token, validated against Supabase
session_type     // "user" or "admin"
```

**Reduction:** 87.5% fewer localStorage entries

---

## Part 7: Security Improvements

### Before
- Raw user data exposed in client storage
- Data could be modified by user
- Stale data possible if user info updated elsewhere
- No session expiration

### After
- Only opaque session token stored client-side
- User data fetched fresh from Supabase on every page load
- Session tokens have 7-day expiration
- Expired sessions automatically cleaned from database
- Tokens uniquely linked to user/admin records
- RLS policies protect database queries

---

## Part 8: Testing Checklist

### User Registration & Verification
- [ ] Register new user → Session created in user_sessions
- [ ] Verify email → New session created
- [ ] Check localStorage only has session_token + session_type
- [ ] Member page loads user data from Supabase
- [ ] Logout clears session token

### Admin Login
- [ ] Login as account-manager → Session in admin_sessions
- [ ] Login as customer-service → Session in admin_sessions
- [ ] Login as executive → Session in admin_sessions
- [ ] Check localStorage has session_token + "admin"
- [ ] Admin dashboard loads correct role
- [ ] Navbar displays admin name from Supabase

### Session Expiration
- [ ] Create session, wait 7+ days
- [ ] Session should be invalid
- [ ] Page redirects to login
- [ ] Expired record deleted from database

### UI Colors
- [ ] All buttons are green (not blue)
- [ ] All text colors are green (not blue)
- [ ] All spinners are green (not blue)
- [ ] Background colors updated (blue-50 → green-50)
- [ ] Border colors updated (blue-200 → green-200)

---

## Part 9: Troubleshooting

### Session Not Found
**Problem:** "Session not found" error when validating token
**Solution:** 
1. Check token format in localStorage
2. Verify user_sessions/admin_sessions table has record
3. Check session hasn't expired (expires_at > NOW())
4. Ensure user_id/admin_id in session matches authenticated user

### User Data Not Loading
**Problem:** Page shows "Loading..." indefinitely
**Solution:**
1. Check browser console for fetch errors
2. Verify Supabase credentials in .env
3. Check RLS policies allow data access
4. Ensure user record exists in users table

### Logout Not Working
**Problem:** Still logged in after logout
**Solution:**
1. Check clearSession() is called
2. Verify localStorage is cleared
3. Check redirect to /login
4. Clear browser cache/cookies

---

## Part 10: Future Enhancements

1. **Session Refresh Tokens** - Implement sliding window for longer sessions
2. **Session Activity Tracking** - Log last_accessed timestamp
3. **Multi-Device Sessions** - Allow multiple concurrent sessions
4. **Session Revocation** - Force logout across all devices
5. **Email Session Notifications** - Alert users of new sessions
6. **Rate Limiting** - Prevent brute force session creation
7. **Hardware-Bound Sessions** - Tie sessions to device fingerprints
