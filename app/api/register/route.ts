import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, middleName, email, password, phone } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if supabaseServer is initialized
    if (!supabaseServer) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        phone,
      },
    });

    if (authError) {
      console.error("Supabase Auth error:", authError);
      
      if (authError.message?.includes("already registered")) {
        return NextResponse.json(
          { message: "This email is already registered. Please log in or use a different email." },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { message: authError.message || "Registration failed. Please try again." },
        { status: 400 }
      );
    }

    // Create user profile in users table
    const userId = authData?.user?.id;
    if (userId) {
      const { data: userData, error: userError } = await supabaseServer
        .from("users")
        .insert([
          {
            id: userId,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            email,
            phone,
            verified: false,
            password: "", // Auth handled by Supabase Auth
          },
        ])
        .select();

      if (userError) {
        console.error("User profile creation error:", userError);
        // Auth user was created, but profile creation failed
        // This is not critical as user can still log in
      }
    }

    // Send confirmation email (Supabase Auth handles this automatically)
    const { error: emailError } = await supabaseServer.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

    if (emailError) {
      console.error("❌ Email send error:", emailError);
      // Don't fail registration if email fails - just log it
    } else {
      console.log("✅ Magic link generated for:", email);
    }

    return NextResponse.json(
      {
        message: "Account created successfully. Check your email to verify your account.",
        userId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
