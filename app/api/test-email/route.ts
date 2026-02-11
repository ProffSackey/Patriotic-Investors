import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (!supabaseServer) {
      return NextResponse.json(
        { message: "Server not configured" },
        { status: 500 }
      );
    }

    console.log("🧪 Testing email send to:", email);

    // Test 1: Generate magic link
    const { data: linkData, error: linkError } = await supabaseServer.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

    console.log("📧 Magic link response:", { linkData, linkError });

    if (linkError) {
      return NextResponse.json(
        {
          message: "Email send failed",
          error: linkError.message || "Unknown error",
          details: linkError,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Email test successful",
        magicLink: linkData?.properties?.email_link || "Generated (check spam folder)",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Test email error:", error);
    return NextResponse.json(
      { message: "Test failed", error: String(error) },
      { status: 500 }
    );
  }
}
