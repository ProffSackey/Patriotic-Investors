import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { message: "Internal server error" },
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

    // Query admin_sessions table
    const { data: sessionData, error: sessionError } = await supabaseServer
      .from("admin_sessions")
      .select("admin_id, expires_at")
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
        .from("admin_sessions")
        .delete()
        .eq("session_token", sessionToken);

      return NextResponse.json(
        { message: "Session has expired" },
        { status: 401 }
      );
    }

    // Fetch admin data
    const { data: admin, error: adminError } = await supabaseServer
      .from("admins")
      .select("*")
      .eq("id", sessionData.admin_id)
      .single();

    if (adminError || !admin) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Session is valid",
        admin: {
          id: admin.id,
          username: admin.username,
          first_name: admin.first_name,
          last_name: admin.last_name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error validating admin session:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
