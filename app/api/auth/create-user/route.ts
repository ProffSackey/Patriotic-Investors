import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { userId, email, firstName, lastName, provider } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseServer
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (existingUser) {
      // User already exists, just return success
      return NextResponse.json(
        { message: 'User already exists', userId },
        { status: 200 }
      );
    }

    // Create new user record
    const { data: newUser, error } = await supabaseServer
      .from('users')
      .insert([
        {
          id: userId,
          first_name: firstName || '',
          last_name: lastName || '',
          email,
          verified: true, // OAuth and email-verified users are pre-verified
          password: '', // OAuth users don't have passwords in our table
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('User creation error:', error);
      // Don't fail authentication if profile creation fails
      return NextResponse.json(
        { message: 'User authenticated', userId },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'User created successfully', userId },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
