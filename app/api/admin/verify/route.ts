import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // First try to read from local file (for development)
    const adminsFilePath = path.join(process.cwd(), "data", "admins.json");
    
    if (fs.existsSync(adminsFilePath)) {
      const admins = JSON.parse(fs.readFileSync(adminsFilePath, "utf-8"));
      const admin = admins.find(
        (a: any) => a.username === username && a.password === password
      );

      if (admin) {
        const { password: _, ...adminData } = admin;
        return NextResponse.json(adminData, { status: 200 });
      }
    }

    // Try Supabase database
    if (!supabaseServer) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const { data: admin, error } = await supabaseServer
      .from("admins")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const { password: _, ...adminData } = admin;
    return NextResponse.json(adminData, { status: 200 });
  } catch (error) {
    console.error("Admin verification error:", error);
    return NextResponse.json(
      { message: "An error occurred during verification" },
      { status: 500 }
    );
  }
}
