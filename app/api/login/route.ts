import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if this is an admin login (admins table for legacy support)
    const { data: admin, error: adminError } = await supabaseServer
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (admin && !adminError) {
      // Admin found - use Supabase Auth with admin password
      const { data: authData, error: authError } = await supabaseServer.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.session) {
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Return admin data
      const response = NextResponse.json(
        {
          message: "Admin login successful",
          admin: {
            id: admin.id,
            username: admin.username,
            firstName: admin.first_name,
            lastName: admin.last_name,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
          },
          session: authData.session,
          isAdmin: true,
        },
        { status: 200 }
      );

      // Store session token in secure cookie
      response.cookies.set("admin_session", authData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    // Regular user login via Supabase Auth
    const { data: authData, error: authError } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Get user profile from users table
    const { data: user, error: userError } = await supabaseServer
      .from("users")
      .select("*")
      .eq("id", authData.user?.id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { message: "User profile not found" },
        { status: 404 }
      );
    }

    if (!user.verified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    // Create user session in database
    const sessionToken = authData.session.access_token;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await supabaseServer
      .from("user_sessions")
      .insert([{
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      }]);

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
        },
        session: authData.session,
      },
      { status: 200 }
    );

    // Store session token in secure cookie
    response.cookies.set("auth_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
