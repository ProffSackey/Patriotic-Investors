import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const { sessionToken } = await request.json();

    if (!sessionToken) {
      return NextResponse.json(
        { message: "Session token is required" },
        { status: 400 }
      );
    }

    // Query user_sessions table
    const { data: sessionData, error: sessionError } = await supabaseServer
      .from("user_sessions")
      .select("user_id, expires_at")
      .eq("session_token", sessionToken)
      .single();

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { message: "Invalid session token" },
        { status: 401 }
      );
    }

    // Check if session has expired
    const expiresAt = new Date(sessionData.expires_at);
    if (expiresAt < new Date()) {
      // Clean up expired session
      await supabaseServer
        .from("user_sessions")
        .delete()
        .eq("session_token", sessionToken);

      return NextResponse.json(
        { message: "Session has expired" },
        { status: 401 }
      );
    }

    // Fetch user data
    const { data: user, error: userError } = await supabaseServer
      .from("users")
      .select("*")
      .eq("id", sessionData.user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Session is valid",
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          verified: user.verified,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error validating user session:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
