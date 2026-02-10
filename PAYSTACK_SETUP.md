# Paystack Integration Guide

## Overview
The Patriotic Investors platform now uses **Paystack** for secure payment processing of registration fees. Paystack provides a reliable payment gateway with support for multiple payment methods including card, mobile money, and bank transfers.

## Setup Instructions

### 1. Create a Paystack Account
1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Sign up or log in to your account
3. Navigate to **Settings > Developer**

### 2. Get Your API Keys
From the Developer Settings page:
- Copy your **Public Key** (starts with `pk_`)
- Copy your **Secret Key** (starts with `sk_`)

⚠️ **Important**: 
- Use TEST keys for development (`pk_test_` and `sk_test_`)
- Use LIVE keys for production (`pk_live_` and `sk_live_`)

### 3. Configure Environment Variables
Update your `.env.local` file:

```env
# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
```

**Note**: `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is prefixed with `NEXT_PUBLIC_` because it's used on the frontend.

### 4. Restart the Development Server
```bash
npm run dev
```

## How It Works

### User Registration Flow
1. **Form Step**: User fills out registration details (name, email, password, etc.)
2. **Payment Step** (if fee > $0): 
   - User is prompted to pay the registration fee
   - Clicking "Pay Now" opens Paystack payment modal
   - User selects payment method (card, mobile money, etc.)
3. **Verification Step**: 
   - After successful payment, user receives verification email
   - User clicks link in email to verify and activate account

### Payment Flow Diagram
```
User Registration
    ↓
Create Account (not verified yet)
    ↓
If Fee > $0:
  └→ Initialize Paystack Payment
      ↓
     User Completes Payment
      ↓
     Verify Payment with Paystack
      ↓
     Mark User as Verified
      ↓
     Send Verification Email
    ↓
User Clicks Email Link
    ↓
Account Activated
```

## API Endpoints

### 1. Initialize Payment
**Endpoint**: `POST /api/paystack/initialize`

**Request Body**:
```json
{
  "email": "user@example.com",
  "amount": 25.00,
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+233501234567",
  "userId": "uuid-of-user"
}
```

**Response**:
```json
{
  "message": "Payment initialized successfully",
  "authorization_url": "https://checkout.paystack.com/...",
  "access_code": "access_code_here",
  "reference": "payment_reference_here"
}
```

### 2. Verify Payment
**Endpoint**: `GET /api/paystack/verify?reference=PAYMENT_REFERENCE`

**Response**:
```json
{
  "message": "Payment verified successfully",
  "payment": {
    "id": "uuid",
    "user_id": "uuid",
    "amount": 25.00,
    "status": "completed",
    "transaction_id": "paystack_ref_xyz"
  },
  "transaction": {
    "reference": "paystack_ref_xyz",
    "amount": 25.00,
    "currency": "GHS",
    "status": "success"
  }
}
```

### 3. Set Registration Fee
**Endpoint**: `POST /api/admin/registration-fee`

**Request Body**:
```json
{
  "fee": 25.00,
  "role": "account-manager"
}
```

**Response**:
```json
{
  "message": "Registration fee updated",
  "fee": 25.00
}
```

## Currency Settings

The current setup uses **GHS (Ghana Cedis)** as the default currency. To change this:

1. Edit `app/register/page.tsx` and update the currency code in the Paystack setup:
```tsx
currency: "GHS", // Change to your currency code (USD, NGN, KES, etc.)
```

2. Common Paystack-supported currencies:
   - `GHS` - Ghana Cedis
   - `NGN` - Nigerian Naira
   - `USD` - US Dollar
   - `KES` - Kenyan Shilling
   - `ZAR` - South African Rand

## Database Schema

### Payments Table
The `payments` table stores all payment records:

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL (references users table),
  amount DECIMAL(10, 2),
  description TEXT,
  status TEXT (pending/completed/failed),
  transaction_id TEXT (Paystack reference),
  paystack_reference TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Settings Table
The `settings` table stores configuration values:

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY,
  key TEXT UNIQUE (e.g., 'registration_fee'),
  value TEXT (e.g., '25.00'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Testing

### Test Mode
1. Use TEST keys from your Paystack dashboard
2. Use test card details:
   - **Card Number**: 4084 0343 0343 0343
   - **Expiry**: Any future date (e.g., 05/25)
   - **CVV**: 353
   - **OTP**: 123456

### Testing Scenarios
1. **Zero Fee**: Set registration fee to 0 - payment step should be skipped
2. **Positive Fee**: Set fee > 0 - payment step should appear
3. **Payment Success**: Complete test payment and verify user is marked as verified
4. **Payment Failure**: Test error handling and user feedback

## Production Deployment

### Before Going Live:
1. ✅ Replace TEST keys with LIVE keys in `.env.local`
2. ✅ Test the complete flow with a small live payment
3. ✅ Ensure HTTPS is enabled on your domain
4. ✅ Set up email verification (currently sends to user email)
5. ✅ Configure proper error handling and user notifications
6. ✅ Set up monitoring for payment failures

### Environment Variables (Production):
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
```

## Troubleshooting

### "Payment service not configured"
- ✅ Check that `PAYSTACK_SECRET_KEY` is set in `.env.local`
- ✅ Restart the dev server after adding keys
- ✅ Verify no typos in environment variable names

### "Paystack is not defined"
- ✅ Check that Paystack script loaded successfully
- ✅ Verify `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is correct
- ✅ Check browser console for script loading errors

### Payment doesn't verify
- ✅ Ensure `PAYSTACK_SECRET_KEY` is correct
- ✅ Check that user was created before payment
- ✅ Verify reference parameter is passed to verify endpoint

### User not marked as verified after payment
- ✅ Check database for payment record
- ✅ Verify user ID is correctly passed through payment flow
- ✅ Check server logs for database errors

## Support & Resources

- **Paystack Documentation**: https://paystack.com/docs
- **Paystack Support**: support@paystack.com
- **Live Chat**: Available in Paystack dashboard

## Key Features Implemented

✅ Secure payment processing with Paystack  
✅ Support for multiple payment methods (card, mobile money, bank transfer)  
✅ Real-time payment verification  
✅ Automatic user verification after successful payment  
✅ Transaction history in database  
✅ Admin control over registration fee  
✅ Error handling and user feedback  
✅ Test and live mode support  

## Next Steps

Optional improvements you could implement:
- [ ] Email notifications after payment
- [ ] Payment retry mechanism
- [ ] Transaction receipts
- [ ] Webhook integration for real-time updates
- [ ] Refund functionality
- [ ] Payment analytics dashboard
