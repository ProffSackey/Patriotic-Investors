import { supabase } from './supabase';

/**
 * Sign up with email and password using Supabase Auth
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: Record<string, any>
) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/verify-email`,
    },
  });
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Send OTP to phone number
 */
export async function sendPhoneOTP(phone: string) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  return await supabase.auth.signInWithOtp({
    phone,
  });
}

/**
 * Verify phone OTP
 */
export async function verifyPhoneOTP(phone: string, token: string) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  return await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
}

/**
 * Sign out current user
 */
export async function signOut() {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  return await supabase.auth.signOut();
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get current session
 */
export async function getSession() {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
  });
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  return await supabase.auth.updateUser({
    password: newPassword,
  });
}

/**
 * Refresh session
 */
export async function refreshSession() {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.refreshSession();

  if (error) {
    throw error;
  }

  return session;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (isAuthenticated: boolean, user: any) => void) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  return supabase.auth.onAuthStateChange((event, session) => {
    callback(!!session, session?.user || null);
  });
}

/**
 * Get user metadata
 */
export async function getUserMetadata() {
  const user = await getCurrentUser();
  return user?.user_metadata || null;
}
