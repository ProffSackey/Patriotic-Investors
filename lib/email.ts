/**
 * Email utilities
 * Supabase Authentication handles all email sending automatically
 * This file is kept for legacy/future use
 */

/**
 * Send verification email
 * NOTE: Supabase Auth handles this automatically when email_confirmation is enabled
 * 
 * In Supabase, verification emails are sent automatically to new users.
 * You can customize the email templates in your Supabase Dashboard:
 * - Authentication > Email Templates
 */
export async function sendVerificationEmail(
  email: string,
  firstName: string,
  verificationLink: string
) {
  console.log(`[Email] Verification email would be sent automatically by Supabase to ${email}`);
  return {
    success: true,
    message: 'Supabase handles verification emails automatically',
  };
}

/**
 * Send password reset email
 * NOTE: Supabase Auth handles this automatically
 */
export async function sendPasswordResetEmail(email: string) {
  console.log(`[Email] Password reset email would be sent automatically by Supabase to ${email}`);
  return {
    success: true,
    message: 'Supabase handles password reset emails automatically',
  };
}
/**
 * Send welcome email
 * This is optional and can be called after user creation
 */
export async function sendWelcomeEmail(email: string, firstName: string) {
  console.log(`[Email] Welcome email sent to ${email}`);
  return {
    success: true,
    message: 'Welcome email logic (implement as needed)',
  };
}

/**
 * Generate verification link
 * NOTE: Supabase Auth generates these automatically
 * This function is kept for reference
 */
export function generateVerificationLink(
  userId: string,
  email: string,
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
): string {
  // Supabase provides verification links automatically
  const token = Buffer.from(`${userId}:${email}:${Date.now()}`).toString('base64');
  return `${baseUrl}/verify-email?token=${token}`;
}
