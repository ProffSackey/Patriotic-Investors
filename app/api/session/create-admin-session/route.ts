import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { adminId } = await request.json();

    if (!adminId) {
      return NextResponse.json(
        { message: "adminId is required" },
        { status: 400 }
      );
    }

    if (!supabaseServer) {
      console.error("Supabase server client not initialized");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const sessionToken = `${adminId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabaseServer
      .from("admin_sessions")
      .insert([
        {
          admin_id: adminId,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Error creating admin session:", error);
      return NextResponse.json(
        { message: "Failed to create session" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Session created successfully",
        sessionToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating session" },
      { status: 500 }
    );
  }
}
