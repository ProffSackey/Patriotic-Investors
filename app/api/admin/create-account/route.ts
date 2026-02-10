import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const DEVELOPER_TOKEN = process.env.DEVELOPER_TOKEN;

const rolePermissions = {
  "account-manager": ["manage-accounts", "view-analytics", "manage-registrations"],
  "customer-service": ["support-users", "handle-complaints", "view-tickets"],
  "executive": ["full-access", "manage-admins", "view-reports", "manage-fees"],
};

export async function POST(request: NextRequest) {
  try {
    // Verify developer token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token || token !== DEVELOPER_TOKEN) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid or missing developer token" },
        { status: 401 }
      );
    }

    if (!supabaseServer) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const { username, email, password, role, firstName, lastName } = await request.json();

    // Validate inputs
    if (!username || !email || !password || !role || !firstName || !lastName) {
      return NextResponse.json(
        { message: "Missing required fields: username, email, password, role, firstName, lastName" },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.keys(rolePermissions).includes(role)) {
      return NextResponse.json(
        { 
          message: `Invalid role. Available roles: ${Object.keys(rolePermissions).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const { data: existing, error: checkError } = await supabaseServer!
      .from("admins")
      .select("id")
      .eq("email", email);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { message: "Admin with this email already exists" },
        { status: 409 }
      );
    }

    // Check username
    const { data: userExists } = await supabaseServer!
      .from("admins")
      .select("id")
      .eq("username", username);

    if (userExists && userExists.length > 0) {
      return NextResponse.json(
        { message: "Admin with this username already exists" },
        { status: 409 }
      );
    }

    // Create admin account
    const { data, error } = await supabaseServer!
      .from("admins")
      .insert([
        {
          username,
          first_name: firstName,
          last_name: lastName,
          email,
          password, // TODO: Hash password in production
          role,
          permissions: rolePermissions[role as keyof typeof rolePermissions],
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: "Failed to create admin account" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Admin account created successfully",
        admin: {
          id: data[0]?.id,
          username: data[0]?.username,
          firstName: data[0]?.first_name,
          lastName: data[0]?.last_name,
          email: data[0]?.email,
          role: data[0]?.role,
          permissions: data[0]?.permissions,
          createdAt: data[0]?.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { message: "An error occurred while creating admin account" },
      { status: 500 }
    );
  }
}
