import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    const { data, error } = await supabaseServer
      .from("settings")
      .select("value")
      .eq("key", "registration_fee")
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    const fee = data ? parseFloat(data.value) : 0;
    return NextResponse.json({ fee }, { status: 200 });
  } catch (error) {
    console.error("Error fetching registration fee:", error);
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fee } = await request.json();

    if (fee === undefined || fee === null) {
      return NextResponse.json(
        { message: "Fee amount is required" },
        { status: 400 }
      );
    }

    if (!supabaseServer) {
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    const { data, error } = await supabaseServer
      .from("settings")
      .upsert(
        { key: "registration_fee", value: fee.toString() },
        { onConflict: "key" }
      )
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Registration fee updated", fee: parseFloat(fee) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating registration fee:", error);
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}
