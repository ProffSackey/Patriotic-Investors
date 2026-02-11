'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange the code for a session
        const response = await supabase?.auth.getSession();
        const session = response?.data?.session || null;
        const sessionError = response?.error || null;
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Authentication failed. Please try again.');
          setLoading(false);
          return;
        }

        if (session?.user) {
          // Create or update user profile in database
          const { id, email, user_metadata } = session.user;

          try {
            const createUserResponse = await fetch('/api/auth/create-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: id,
                email,
                firstName: user_metadata?.first_name || '',
                lastName: user_metadata?.last_name || '',
                provider: session.user.app_metadata?.provider,
              }),
            });

            if (createUserResponse.ok) {
              // Redirect to member dashboard
              router.push('/member');
            } else {
              // Even if profile creation fails, user is authenticated
              router.push('/member');
            }
          } catch (err) {
            console.error('Profile creation error:', err);
            // Redirect anyway as user is authenticated
            router.push('/member');
          }
        } else {
          setError('No session found. Please log in again.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Callback error:', error);
        setError('An unexpected error occurred.');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
          <p className="text-white text-lg">Authenticating your account...</p>
          <p className="text-blue-100 text-sm mt-2">Please wait while we set things up</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="text-center">
          <p className="text-red-300 text-lg">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-white text-blue-900 rounded hover:bg-blue-50"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
}
