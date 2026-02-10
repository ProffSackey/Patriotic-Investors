import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { sendPaymentConfirmationEmail, generateVerificationLink } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { message: "Reference is required" },
        { status: 400 }
      );
    }

    if (!supabaseServer) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY is not configured");
      return NextResponse.json(
        { message: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Verify payment with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Paystack verification error:", data);
      return NextResponse.json(
        { message: data.message || "Failed to verify payment" },
        { status: 400 }
      );
    }

    const transactionData = data.data;

    // Check if payment was successful
    if (transactionData.status !== "success") {
      return NextResponse.json(
        { 
          message: "Payment was not successful",
          status: transactionData.status,
        },
        { status: 400 }
      );
    }

    const userId = transactionData.metadata?.userId;
    const amount = transactionData.amount / 100; // Convert from kobo to currency

    // Record payment in database
    const { data: payment, error } = await supabaseServer!
      .from("payments")
      .insert([
        {
          user_id: userId,
          amount: amount,
          description: "Registration fee",
          status: "completed",
          transaction_id: transactionData.reference,
          paystack_reference: reference,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: "Failed to record payment" },
        { status: 500 }
      );
    }

    // Update user verification status to verified
    const { error: updateError, data: userData } = await supabaseServer!
      .from("users")
      .update({ verified: true })
      .eq("id", userId)
      .select();

    if (updateError) {
      console.error("Error updating user verification:", updateError);
      // Don't fail the request - payment was successful
    }

    // Send payment confirmation email
    const user = userData?.[0];
    if (user?.email) {
      const verificationLink = generateVerificationLink(userId, user.email);
      await sendPaymentConfirmationEmail(
        user.email,
        user.first_name || "User",
        amount,
        transactionData.reference,
        verificationLink
      );
    }

    return NextResponse.json(
      {
        message: "Payment verified successfully",
        payment: payment?.[0],
        transaction: {
          reference: transactionData.reference,
          amount: amount,
          currency: transactionData.currency,
          status: transactionData.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying Paystack payment:", error);
    return NextResponse.json(
      { message: "An error occurred while verifying payment" },
      { status: 500 }
    );
  }
}
