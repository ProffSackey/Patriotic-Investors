import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

/**
 * @deprecated Use /api/paystack/initialize and /api/paystack/verify instead
 * This endpoint is kept for backward compatibility
 */
export async function POST(request: NextRequest) {
  try {
    const { email, amount, userId } = await request.json();

    if (!email || !amount || !userId) {
      return NextResponse.json(
        { message: "Email, amount, and userId are required" },
        { status: 400 }
      );
    }

    // This endpoint is now handled by Paystack payment flow
    // For backward compatibility, we'll redirect to Paystack initialization
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY is not configured");
      return NextResponse.json(
        { message: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Amount must be in kobo (smallest unit), so multiply by 100
    const amountInKobo = Math.round(amount * 100);

    // Initialize payment with Paystack
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        metadata: {
          userId,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Paystack error:", data);
      return NextResponse.json(
        { message: data.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Payment initialized successfully",
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { message: "An error occurred during payment processing" },
      { status: 500 }
    );
  }
}
