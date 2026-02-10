# Supabase Authentication - Email & Phone Quickstart

## What's Changed

✅ **Removed:**
- Resend email service dependency
- bcryptjs password hashing (Supabase Auth handles this)
- OAuth providers (Google, GitHub)
- Custom email sending logic

✅ **Added:**
- Phone OTP authentication via SMS
- Supabase Auth integration (`lib/supabase-auth.ts`)
- Updated API routes to use Supabase Auth

---

## Quick Setup Steps

### 1. Enable Email & Phone Auth in Supabase Dashboard

Go to https://app.supabase.com → select your project → **Authentication** → **Providers**

#### Enable Email/Password
- Click **Email**
- Toggle **Enable Email/Password** to ON
- Keep "Confirm email" enabled

#### Enable Phone OTP
- Click **Phone**
- Choose SMS Provider (Twilio recommended)
- Add SMS provider credentials

---

### 2. Setup SMS Provider (Twilio)

1. Create account at https://www.twilio.com
2. Get **Account SID** and **Auth Token**
3. Get a Twilio phone number
4. Add credentials to Supabase Dashboard:
   - **Authentication** → **Phone** → Add SMS provider settings

---

### 3. Update Environment Variables

Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 4. Update Login Page

Replace `/app/login/page.tsx`:

```typescript
'use client';
import { useState } from 'react';
import { signInWithEmail, sendPhoneOTP, verifyPhoneOTP } from '@/lib/supabase-auth';

export default function Login() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await signInWithEmail(email, password);
    if (error) {
      setError(error.message);
    } else {
      window.location.href = '/member';
    }
    setLoading(false);
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');
    
    const { error } = await sendPhoneOTP(phone);
    if (error) {
      setError(error.message);
    } else {
      setShowOtpInput(true);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');
    
    const { error } = await verifyPhoneOTP(phone, otp);
    if (error) {
      setError(error.message);
    } else {
      window.location.href = '/member';
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h1>Sign In</h1>

      {/* Auth Method Selector */}
      <div className="auth-tabs">
        <button 
          onClick={() => {
            setAuthMethod('email');
            setShowOtpInput(false);
            setError('');
          }}
          className={authMethod === 'email' ? 'active' : ''}
        >
          📧 Email
        </button>
        <button 
          onClick={() => {
            setAuthMethod('phone');
            setShowOtpInput(false);
            setError('');
          }}
          className={authMethod === 'phone' ? 'active' : ''}
        >
          📱 Phone
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Email/Password Form */}
      {authMethod === 'email' && (
        <form onSubmit={handleEmailLogin} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      )}

      {/* Phone OTP Form */}
      {authMethod === 'phone' && (
        <div className="auth-form">
          {!showOtpInput ? (
            <>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233 XX XXX XXXX"
                  required
                  disabled={loading}
                />
              </div>
              <button onClick={handleSendOTP} disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Enter OTP Code</label>
                <p className="text-sm">Code sent to {phone}</p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>
              <button onClick={handleVerifyOTP} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button 
                type="button"
                onClick={() => setShowOtpInput(false)}
                className="btn-secondary"
              >
                Back
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### 5. Update Register Page

Replace `/app/register/page.tsx`:

```typescript
'use client';
import { useState } from 'react';
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

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
      setFormData({ firstName: '', lastName: '', email: '', password: '' });
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min. 6 characters"
            minLength={6}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {error && <p className="error">{error}</p>}
        {success && (
          <p className="success">
            ✓ Account created! Check your email to verify.
          </p>
        )}
      </form>
    </div>
  );
}
```

---

## Testing Checklist

- [ ] Email registration works
- [ ] User receives verification email
- [ ] Can log in with email/password
- [ ] Phone OTP is sent successfully
- [ ] Can verify OTP and log in
- [ ] User profile created after auth
- [ ] Session persists
- [ ] Logout works

---

## Troubleshooting

**"Email already registered"**
- Email exists in Supabase
- User should log in instead

**"Invalid credentials"**
- Wrong password or email doesn't exist
- Check user in Supabase Auth dashboard

**SMS not received**
- Verify Twilio credentials
- Check phone number format
- Verify SMS provider configured in Supabase

**Email verification not working**
- Check email templates in Supabase
- Verify NEXT_PUBLIC_APP_URL is correct
- Check spam folder

---

## Next Steps

1. ✅ Update `.env.local` with Supabase credentials
2. ✅ Enable Email & Phone providers in Supabase
3. ✅ Setup Twilio SMS provider
4. ✅ Update login and register pages
5. ⬜ Test email registration
6. ⬜ Test phone OTP auth
7. ⬜ Deploy to production

---

## Security Features

✅ Passwords hashed by Supabase Auth
✅ Session tokens in secure HTTP-only cookies
✅ Row Level Security (RLS) enabled
✅ Email verification required
✅ Phone OTP verification
✅ CORS configured

---

See [SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md) for complete details.
