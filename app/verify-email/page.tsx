"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserSession } from "@/lib/session";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided. Please check your email link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Email verified successfully! Redirecting to your dashboard...");

          // Create session in Supabase
          if (data.user) {
            await createUserSession(data.user.id);
          }

          // Redirect to member dashboard after 2 seconds
          setTimeout(() => {
            router.push("/member");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to verify email. Please try again.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred while verifying your email. Please try again.");
        console.error("Verification error:", error);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div>
      <Navbar />
      <section className="py-16 bg-gray-50 min-h-screen flex items-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {status === "verifying" && (
              <>
                <div className="mb-6">
                  <div className="inline-block">
                    <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifying Email</h1>
                <p className="text-gray-600">{message}</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mb-6">
                  <div className="text-6xl">✓</div>
                </div>
                <h1 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="w-full bg-green-100 border border-green-300 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    Your account is now active. You will be redirected shortly.
                  </p>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="mb-6">
                  <div className="text-6xl">✗</div>
                </div>
                <h1 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => router.push("/register")}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Register Again
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Go Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
