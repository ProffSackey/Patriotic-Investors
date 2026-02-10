import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    if (!supabaseServer) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Decode the token (base64 encoded: userId:email:timestamp)
    let decodedToken: string;
    try {
      decodedToken = Buffer.from(token, "base64").toString("utf-8");
    } catch {
      return NextResponse.json(
        { message: "Invalid verification token" },
        { status: 400 }
      );
    }

    const [userId, email, timestamp] = decodedToken.split(":");

    if (!userId || !email) {
      return NextResponse.json(
        { message: "Invalid token format" },
        { status: 400 }
      );
    }

    // Check if token is not older than 24 hours
    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    const tokenAgeHours = (currentTime - tokenTime) / (1000 * 60 * 60);

    if (tokenAgeHours > 24) {
      return NextResponse.json(
        { message: "Verification link has expired. Please register again." },
        { status: 400 }
      );
    }

    // Update user as verified
    const { data: userData, error } = await supabaseServer!
      .from("users")
      .update({ verified: true })
      .eq("id", userId)
      .eq("email", email)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: "Failed to verify email" },
        { status: 400 }
      );
    }

    if (!userData || userData.length === 0) {
      return NextResponse.json(
        { message: "User not found or email doesn't match" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: userData[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "An error occurred during email verification" },
      { status: 500 }
    );
  }
}
