# Paystack Integration Quick Reference

## Environment Setup

### Add to `.env.local`:
```env
# Get these from https://dashboard.paystack.com/#/settings/developer
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
```

## Payment Flow

### 1. User Submits Registration Form
```typescript
// Frontend: Register user
POST /api/register
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "password123",
  phone: "+233501234567"
}

// Response:
{
  user: {
    id: "uuid-xxx", // Save this!
    verified: false,
    ...
  }
}
```

### 2. Initialize Paystack Payment
```typescript
// Frontend: When user clicks "Pay Now"
POST /api/paystack/initialize
{
  userId: "uuid-xxx",
  email: "john@example.com",
  amount: 25.00,
  firstName: "John",
  lastName: "Doe",
  phone: "+233501234567"
}

// Response:
{
  reference: "KFD2H3H9...",
  authorization_url: "https://checkout.paystack.com/...",
  access_code: "access_code_xxx"
}
```

### 3. User Pays (happens in Paystack modal)
- User sees Paystack payment modal
- Selects payment method (card, mobile money, etc.)
- Completes payment

### 4. Verify Payment
```typescript
// Frontend: After payment modal closes
GET /api/paystack/verify?reference=KFD2H3H9...

// Response:
{
  message: "Payment verified successfully",
  payment: {
    id: "uuid",
    user_id: "uuid-xxx",
    amount: 25.00,
    status: "completed",
    transaction_id: "KFD2H3H9..."
  }
}

// Backend automatically:
// - Marks user as verified: true
// - Records payment in database
```

### 5. User Gets Verification Email
Email is sent to user with verification link

## Code Examples

### Initialize Payment (Frontend)
```typescript
const handlePayment = async () => {
  const response = await fetch("/api/paystack/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userId,
      email: form.email,
      amount: registrationFee,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
    }),
  });

  const data = await response.json();
  
  // Open Paystack modal
  window.PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email: form.email,
    amount: Math.round(registrationFee * 100),
    ref: data.reference,
    onSuccess: (response) => {
      // Verify payment
      verifyPayment(response.reference);
    },
    onClose: () => {
      // User closed modal
    },
  }).openIframe();
};
```

### Verify Payment (Frontend)
```typescript
const verifyPayment = async (reference) => {
  const response = await fetch(
    `/api/paystack/verify?reference=${reference}`
  );

  if (response.ok) {
    const data = await response.json();
    // User verified! Show success message
    // User can now complete email verification
  } else {
    // Verification failed
  }
};
```

## Test Payment Details

| Field | Value |
|-------|-------|
| Card Number | 4084 0343 0343 0343 |
| Expiry | 05/25 |
| CVV | 353 |
| OTP | 123456 |

## Payment Methods Supported

- 💳 Debit/Credit Cards
- 📱 Mobile Money (MTN, Vodafone, AirtelTigo)
- 🏦 Bank Transfer
- 📲 USSD
- ⚡ QR Code

## Error Handling

```typescript
try {
  const res = await fetch("/api/paystack/initialize", {...});
  if (!res.ok) {
    const error = await res.json();
    // error.message contains error description
    alert(error.message);
  }
} catch (err) {
  // Network error or other issue
}
```

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| "Payment service not configured" | Add PAYSTACK_SECRET_KEY to .env.local |
| "PaystackPop is not defined" | Check NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is correct |
| "Failed to verify payment" | Check payment reference is being passed correctly |
| User not marked verified | Check userId is passed through payment flow |

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Invalid request (missing required fields) |
| 500 | Server error (check logs) |

## Payment Status Values

- `pending` - Payment initiated but not completed
- `completed` - Payment successful, user verified
- `failed` - Payment failed

## Currency Settings

Default: **GHS** (Ghana Cedis)

To change, edit `app/register/page.tsx`:
```typescript
currency: "GHS", // Change to: USD, NGN, KES, ZAR, etc.
```

## Supported Currencies

- GHS - Ghana Cedis
- NGN - Nigerian Naira
- USD - US Dollar
- KES - Kenyan Shilling
- ZAR - South African Rand
- And others supported by Paystack

## Database Schema

### Payments Table
```sql
payments {
  id: UUID (primary key)
  user_id: UUID (foreign key → users)
  amount: DECIMAL(10, 2)
  description: TEXT
  status: TEXT ('pending'|'completed'|'failed')
  transaction_id: TEXT (Paystack reference)
  paystack_reference: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### Users Table (updated)
```sql
users {
  ...existing fields...
  verified: BOOLEAN (set to true after payment)
}
```

## Useful Links

- 📚 [Paystack Documentation](https://paystack.com/docs)
- 🔑 [API Reference](https://paystack.com/docs/api/)
- 💬 [Support](support@paystack.com)
- 🏠 [Dashboard](https://dashboard.paystack.com)

## Go Live Checklist

- [ ] Replace TEST keys with LIVE keys
- [ ] Test with real payment (use small amount)
- [ ] Enable HTTPS on your domain
- [ ] Set up proper email notifications
- [ ] Configure error logging/monitoring
- [ ] Test all payment methods
- [ ] Document refund process
- [ ] Brief support team on payment flow
