# Supabase Authentication Setup Guide - Email & Phone

## Overview

Your Patriotic Investors application uses **Supabase Authentication** for secure sign-in and registration. This guide covers email/password and phone OTP authentication methods.

---

## 1. Enable Email/Password Authentication

### Step 1: Access Supabase Dashboard
1. Go to [Supabase](https://app.supabase.com)
2. Select your Patriotic Investors project
3. Navigate to **Authentication** → **Providers**

### Step 2: Enable Email Provider
1. Click on the **Email** provider
2. Toggle **Enable Email/Password authentication** to ON
3. Configure:
   - **Confirm email**: ✓ Enabled (required for security)
   - **Double confirm changes**: Choose your preference
   - **Mailer templates**: Keep defaults or customize

### Step 3: Email Confirmation Template
1. Go to **Authentication** → **Email Templates**
2. Review the **Confirm signup** template
3. Customize with your branding if desired
4. Supabase sends verification emails automatically

---

## 2. Setup Phone Authentication

### Step 1: Enable Phone Provider
1. In Supabase Dashboard → **Authentication** → **Providers**
2. Click on **Phone**
3. Toggle **Enable Phone Authentication** to ON
4. Configure:
   - **SMS Provider**: Choose your SMS provider (Twilio, MessageBird, etc.)
   - **SMS credentials**: Add your SMS provider API keys

### Step 2: Configure SMS Provider

#### Using Twilio (Recommended)
1. Create a Twilio account at https://www.twilio.com
2. Get **Account SID** and **Auth Token**
3. In Supabase add credentials
4. Get a Twilio phone number for sending SMS

#### Using Other Providers
- MessageBird
- AWS SNS
- Other SMS providers (configure in Supabase)

---

## 3. Configure Email Templates

### Email Verification
1. Go to **Authentication** → **Email Templates**
2. Review and customize the confirmation email
3. Supabase sends verification emails automatically

---

## 4. Environment Variables Configuration

Update your `.env.local` file:

```env
# Supabase Core
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# SMS Provider (for phone authentication)
# If using Twilio:
SMS_PROVIDER_API_KEY=your_twilio_auth_token
SMS_PROVIDER_ACCOUNT_SID=your_twilio_account_sid
```

## 5. Database Schema Updates

Your database supports Supabase authentication with:

- **users table**: Stores user profiles
- **user_sessions table**: Manages user sessions
- **admin_sessions table**: Manages admin sessions
- **Row Level Security (RLS)**: Protects user data

No additional schema changes needed!

---

## 6. Authentication Flow

### Email/Password Registration Flow
```
User submits registration form
    ↓
Create user in Supabase Auth
    ↓
Create user profile in users table
    ↓
Supabase sends verification email
    ↓
User clicks verification link
    ↓
Email marked as verified in Supabase Auth
    ↓
User can now log in
```

### Phone Authentication Flow
```
User enters phone number
    ↓
Supabase sends OTP via SMS
    ↓
User receives SMS with OTP code
    ↓
User enters OTP in app
    ↓
Phone number verified
    ↓
User account created/authenticated
```

---

## 7. Authentication API Routes

### Login Route (`/api/login`)
Handles email/password authentication:
- Validates credentials
- Returns session token
- Sets secure HTTP-only cookie

### Register Route (`/api/register`)
Handles user registration:
- Creates Supabase Auth user
- Creates user profile
- Supabase sends verification email

### Create User Route (`/api/auth/create-user`)
Creates user profile from authentication:
- Creates user profile in database
- Marks email as verified

---

## 8. Updated Login Page Implementation

```typescript
'use client';
import { signInWithEmail, sendPhoneOTP, verifyPhoneOTP } from '@/lib/supabase-auth';

export default function Login() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const { error } = await signInWithEmail(email, password);
    if (!error) {
      window.location.href = '/member';
    }
  };

  const handlePhoneOTP = async () => {
    const { error } = await sendPhoneOTP(phone);
    if (!error) {
      setShowOtpInput(true);
    }
  };

  const handleVerifyOTP = async () => {
    const { error } = await verifyPhoneOTP(phone, otp);
    if (!error) {
      window.location.href = '/member';
    }
  };

  return (
    <div className="login-container">
      <div className="auth-method-selector">
        <button 
          onClick={() => setAuthMethod('email')}
          className={authMethod === 'email' ? 'active' : ''}
        >
          Email
        </button>
        <button 
          onClick={() => setAuthMethod('phone')}
          className={authMethod === 'phone' ? 'active' : ''}
        >
          Phone
        </button>
      </div>

      {authMethod === 'email' ? (
        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      ) : (
        <div>
          {!showOtpInput ? (
            <>
              <input
                type="tel"
                placeholder="+233 phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <button onClick={handlePhoneOTP}>Send OTP</button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button onClick={handleVerifyOTP}>Verify OTP</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 9. Updated Registration Page

```typescript
'use client';
import { signUpWithEmail } from '@/lib/supabase-auth';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signUpWithEmail(
      formData.email,
      formData.password,
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
      }
    );
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      alert('Check your email to verify your account!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="First Name" required />
      <input type="text" placeholder="Last Name" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password (min. 6 chars)" required />
      <button type="submit">Create Account</button>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Account created! Check your email.</p>}
    </form>
  );
}
```

---

## 10. Session Management

Sessions are managed automatically by Supabase:

```typescript
// Store session in secure cookie
response.cookies.set('auth_token', sessionToken, {
  httpOnly: true,           // Not accessible to JavaScript
  secure: true,             // HTTPS only
  sameSite: 'lax',          // CSRF protection
  maxAge: 7 * 24 * 60 * 60  // 7 days
});
```

---

## 11. Security Best Practices

✅ **Implemented:**
- Supabase Auth handles password hashing
- Row Level Security (RLS) on all tables
- Secure HTTP-only cookies for session tokens
- Email verification required
- Phone OTP verification

✅ **To Do:**
- Implement rate limiting on auth endpoints
- Add email verification resend functionality
- Set up password reset flow
- Monitor authentication logs
- Enable MFA for admin accounts

---

## 12. Testing Authentication

### Test Email/Password Auth
```bash
1. Go to http://localhost:3000/register
2. Create account with test@example.com / password123
3. Check email for verification link
4. Click link or go to /verify-email
5. Log in with credentials
6. Should redirect to /member
```

### Test Phone Auth
```bash
1. Go to http://localhost:3000/login
2. Switch to Phone tab
3. Enter your phone number
4. Receive SMS with OTP
5. Enter OTP
6. Should create account and redirect to /member
```

---

## 13. Production Deployment

### Before Going Live:

1. **Update Environment Variables**:
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   SMS_PROVIDER_API_KEY=your_production_key
   SMS_PROVIDER_ACCOUNT_SID=your_production_sid
   ```

2. **Verify Email Configuration**:
   - Check Supabase email templates are branded correctly
   - Test email verification flow

3. **SMS Provider Setup**:
   - Verify Twilio (or other provider) credentials
   - Test SMS delivery
   - Set up production phone number

4. **Secure Cookies**:
   - Ensure `secure: true` when `NODE_ENV === 'production'`
   - This requires HTTPS in production

5. **Monitor Logs**:
   - Check Supabase authentication logs
   - Monitor failed login attempts
   - Review SMS delivery status

---

## 14. Troubleshooting

| Issue | Solution |
|-------|----------|
| User can't verify email | Check NEXT_PUBLIC_APP_URL environment variable |
| Email not received | Check Supabase email settings and verify configuration |
| SMS not received | Verify SMS provider credentials and phone number format |
| CORS errors | Verify Supabase URL and ANON_KEY are correct |
| Session not persisting | Check secure cookies are properly set |

---

## 15. Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Email Password Authentication](https://supabase.com/docs/guides/auth/auth-email-password)
- [Phone Authentication](https://supabase.com/docs/guides/auth/phone-login)
- [Twilio SMS Provider](https://www.twilio.com)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email)

---

## 16. Migration Notes

**What Changed:**
- ✅ Removed Resend email service
- ✅ Removed OAuth providers (Google, GitHub)
- ✅ Using Supabase built-in authentication
- ✅ Removed bcryptjs dependency (Supabase handles hashing)
- ✅ Added phone OTP authentication
- ✅ Added `supabase-auth.ts` utilities

**Backward Compatibility:**
- Legacy admin login still works
- Existing user database compatible
- Session management updated

**What to Update:**
- Login and Register pages to use new auth utilities
- Any custom auth HTTP interceptors
- Admin authentication flow (optional)
