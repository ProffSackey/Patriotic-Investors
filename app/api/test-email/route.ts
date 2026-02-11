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

    // The exact shape of `linkData.properties` can vary and TypeScript may not
    // expose `email_link` directly on the generated type. Use a safe cast
    // to access the link for development debugging.
    const magicLink = (linkData as any)?.properties?.email_link || (linkData as any)?.properties || "Generated (check spam folder)";

    return NextResponse.json(
      {
        message: "Email test successful",
        magicLink,
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
