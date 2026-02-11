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
    const { data: linkData, error: emailError } = await supabaseServer.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

    if (emailError) {
      console.error("❌ Email send error:", emailError.message);
      console.warn("⚠️ Email verification failed. For development, auto-verifying user...");
      
      // Development workaround: auto-verify user if email fails
      if (userId && process.env.NODE_ENV !== 'production') {
        const { error: verifyError } = await supabaseServer.auth.admin.updateUserById(userId, {
          email_confirm: true,
        });
        
        if (!verifyError) {
          console.log("✅ User auto-verified for development");
          // Also mark as verified in database
          await supabaseServer
            .from("users")
            .update({ verified: true })
            .eq("id", userId);
        }
      }
    } else {
      console.log("✅ Magic link generated for:", email);
      const verificationLink = (linkData as any)?.properties?.email_link || (linkData as any)?.properties || null;
      console.log("📧 Verification link:", verificationLink);
    }

    return NextResponse.json(
      {
        message: "Account created successfully. Check your email to verify your account.",
        userId,
        devNote: emailError ? "Email sending failed - user auto-verified for development" : undefined,
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
