# Resend Email Integration Setup

## Overview

Your Patriotic Investors application now uses **Resend** for sending verification and payment confirmation emails. Resend is a modern email API built for developers.

## Setup Steps

### 1. Create a Resend Account
1. Go to https://resend.com
2. Click "Sign Up"
3. Create your account with your email
4. Verify your email address

### 2. Get Your API Key
1. Go to https://resend.com/api-keys
2. Copy your API key (starts with `re_`)
3. Keep it safe - never share it!

### 3. Configure Environment Variables

Update your `.env.local`:

```env
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@patrioticinvestors.com
```

**Important**: 
- Use the **default Resend email** (`onboarding@resend.dev`) first to test
- Later, add your own domain for production use

### 4. Update .env.local with Default Email

For testing, use Resend's default email:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### 5. Restart Dev Server

```bash
npm run dev
```

## How It Works

### Registration Flow

```
User Registers
    ↓
Account Created (verified: false)
    ↓
Generate Verification Link
    ↓
Send Verification Email (via Resend)
    ↓
User Receives Email
    ↓
User Clicks Link
    ↓
Account Verified ✓
```

### Payment Flow

```
User Completes Payment
    ↓
Payment Verified with Paystack
    ↓
Generate Verification Link
    ↓
Send Payment Confirmation Email (via Resend)
    ↓
User Receives Email
    ↓
User Clicks Link
    ↓
Account Verified + Payment Confirmed ✓
```

## Email Templates

### 1. Verification Email
Sent when user registers (if no fee) or after payment

**Subject**: "Verify Your Patriotic Investors Account"

**Contains**:
- Welcome message
- Verification link
- Instructions
- Expiration notice (24 hours)

### 2. Payment Confirmation Email
Sent when user completes payment

**Subject**: "Payment Confirmed - Verify Your Patriotic Investors Account"

**Contains**:
- Payment confirmation
- Amount paid
- Transaction ID
- Date
- Verification link
- Next steps

## Testing Email Sending

### Test Mode

When `RESEND_API_KEY` is not configured or invalid, emails are logged to console:

```
Email that would be sent to user@example.com: Verify Your Patriotic Investors Account
```

### Verify Email Sent

1. Register a user via `/register`
2. Check your email inbox
3. Look for email from `onboarding@resend.dev` (test) or your configured domain (production)

### Test Email Addresses

You can test with any email address when using the default Resend email.

## Resend Email Rules

### Testing Phase
- Use: `onboarding@resend.dev` as FROM email
- Can send to any email address
- Up to 100 emails/day free tier

### Production Phase
1. Add your own domain to Resend
2. Verify domain ownership via DNS records
3. Use `noreply@yourdomain.com` or similar
4. Full email deliverability

## Adding Your Domain (Production)

### Step 1: Go to Resend Dashboard
1. Visit https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (e.g., `patrioticinvestors.com`)

### Step 2: Add DNS Records
Resend will show you DNS records to add:

```
Type: MX
Name: @
Value: feedback-smtp.region.amazonses.com
Priority: 10

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none;
```

### Step 3: Update .env.local
```env
RESEND_FROM_EMAIL=noreply@patrioticinvestors.com
```

## Troubleshooting

### "RESEND_API_KEY not configured"
- ✅ Check you copied the API key correctly
- ✅ Paste it in `.env.local` as `RESEND_API_KEY=re_xxxxx`
- ✅ Restart dev server

### Email not received
- ✅ Check spam/junk folder
- ✅ Verify recipient email is correct
- ✅ Check Resend dashboard for bounces: https://resend.com/emails
- ✅ If using default email, recipient must be inbox-ready

### "Email sending failed"
- ✅ Check Resend status page: https://resend.statuspage.io
- ✅ Verify API key is valid
- ✅ Check email format is valid

### Emails going to spam
- ✅ Add SPF record for your domain
- ✅ Add DKIM record for your domain
- ✅ Add DMARC policy record
- ✅ (Resend provides these in dashboard)

## Email Sending Limits

| Plan | Emails/Day | Price |
|------|-----------|-------|
| Free | 100 | Free |
| Pro | Unlimited | $20/month |

Upgrade at: https://resend.com/pricing

## Code Examples

### Manual Email Sending

```typescript
import { sendVerificationEmail } from "@/lib/email";

// Send verification email
await sendVerificationEmail(
  "user@example.com",
  "John",
  "https://yourapp.com/verify?token=xxx"
);
```

### Payment Confirmation

```typescript
import { sendPaymentConfirmationEmail } from "@/lib/email";

// Send payment confirmation
await sendPaymentConfirmationEmail(
  "user@example.com",
  "John",
  25.00,
  "KFD2H3H9...",
  "https://yourapp.com/verify?token=xxx"
);
```

## Email Customization

### Change From Address

Edit `.env.local`:
```env
RESEND_FROM_EMAIL=support@patrioticinvestors.com
```

### Customize Email Content

Edit `lib/email.ts`:
- Modify HTML templates
- Change branding
- Adjust copy
- Add company logo

### Add More Email Types

In `lib/email.ts`, add new function:

```typescript
export async function sendWelcomeEmail(email: string, firstName: string) {
  const html = `<h1>Welcome ${firstName}!</h1>...`;
  return sendEmail({
    to: email,
    subject: "Welcome to Patriotic Investors",
    html,
  });
}
```

Then use in your endpoints:
```typescript
import { sendWelcomeEmail } from "@/lib/email";
await sendWelcomeEmail(email, firstName);
```

## Monitoring

### Check Email Status
1. Go to https://resend.com/emails
2. See all sent emails
3. Check delivery status
4. View error details

### Bounce Management
- Hard bounces: Invalid email addresses
- Soft bounces: Temporary delivery issues
- Spam complaints: User marked as spam

## Production Checklist

- [ ] Resend API key configured in `.env.local`
- [ ] Custom domain added to Resend
- [ ] DNS records verified
- [ ] FROM email updated to your domain
- [ ] Test email sent and received
- [ ] Email arrives in inbox (not spam)
- [ ] All email templates customized with your branding
- [ ] Error handling tested
- [ ] Monitor Resend dashboard regularly

## Support

- **Resend Docs**: https://resend.com/docs
- **Resend Support**: https://resend.com/support
- **Status Page**: https://resend.statuspage.io

## Cost

- **Free**: 100 emails/day
- **Pro**: $20/month for unlimited
- After free tier, only pay for what you use

## Next Steps

1. ✅ Get API key from Resend
2. ✅ Add to `.env.local`
3. ✅ Test email sending
4. ✅ Verify emails are received
5. ✅ (Later) Add your domain for production
6. ✅ (Later) Monitor email deliverability

**Your email integration is complete and ready to send emails!** 🎉
