"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { createUserSession } from "@/lib/session";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [registrationFee, setRegistrationFee] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [step, setStep] = useState<"form" | "payment" | "verification">("form");
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Load Paystack script
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      setPaystackLoaded(true);
    };
    document.body.appendChild(script);

    // Fetch registration fee from admin settings
    const fetchRegistrationFee = async () => {
      try {
        const res = await fetch("/api/admin/registration-fee");
        if (res.ok) {
          const data = await res.json();
          setRegistrationFee(data.fee || 0);
        }
      } catch (err) {
        console.error("Error fetching registration fee:", err);
      }
    };
    fetchRegistrationFee();

    return () => {
      // Cleanup - remove script if needed
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      // Create account first
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          middleName: form.middleName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          phone: form.phone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const userId = data.user?.id;
        setUserId(userId);
        
        // Create session in Supabase
        if (userId) {
          await createUserSession(userId);
        }
        
        // Move to payment step if fee > 0
        if (registrationFee > 0) {
          setStep("payment");
        } else {
          setSuccess("Registration successful! Check your email to verify your account.");
          setForm({
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
          });
          setStep("verification");
        }
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Registration error:", err);
    }

    setLoading(false);
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    setError(null);

    try {
      if (!paystackLoaded || !window.PaystackPop) {
        setError("Payment service is not ready. Please refresh and try again.");
        setPaymentProcessing(false);
        return;
      }

      // Initialize Paystack payment
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          amount: registrationFee,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          userId: userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Failed to initialize payment");
        setPaymentProcessing(false);
        return;
      }

      const data = await res.json();
      const reference = data.reference;

      // Initialize Paystack checkout
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: Math.round(registrationFee * 100), // Amount in kobo
        ref: reference,
        currency: "GHS", // Change to your currency code
        onClose: function () {
          setError("Payment window closed. Please try again.");
          setPaymentProcessing(false);
        },
        onSuccess: async function (response: any) {
          // Verify payment on backend
          try {
            const verifyRes = await fetch(
              `/api/paystack/verify?reference=${response.reference}`
            );

            if (verifyRes.ok) {
              const verifyData = await verifyRes.json();
              setSuccess("Payment successful! Check your email to verify your account.");
              setStep("verification");
            } else {
              const errorData = await verifyRes.json();
              setError(errorData.message || "Payment verification failed");
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            setError("Error verifying payment. Please contact support.");
          } finally {
            setPaymentProcessing(false);
          }
        },
      });

      handler.openIframe();
    } catch (err) {
      setError("Payment processing error. Please try again.");
      console.error("Payment error:", err);
      setPaymentProcessing(false);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {step === "form" && (
              <>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                <p className="text-gray-600 mb-8">
                  Join Patriotic Investors and start your investment journey
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Name Fields */}
                  <div className="grid text-gray-800 grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        name="middleName"
                        value={form.middleName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                        placeholder="Ofori"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-6 text-gray-800">
                    <label className="block  text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 text-gray-800 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                      placeholder="sack....@gmail.com"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-6 text-gray-800">
                    <label className="block text-sm  font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                      placeholder="+233 (552) 000-000"
                    />
                  </div>

                  {/* Password Fields */}
                  <div className="grid text-gray-800 grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                        placeholder="••••••"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 text-gray-800 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                        placeholder="••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:bg-gray-400 mb-4"
                  >
                    {loading ? "Creating Account..." : "Continue"}
                  </button>

                  {/* Login Link */}
                  <p className="text-center text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-green-700 font-semibold hover:underline">
                      Sign In
                    </Link>
                  </p>
                </form>
              </>
            )}

            {step === "payment" && (
              <>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Required</h1>
                <p className="text-gray-600 mb-8">
                  Complete your registration by paying the registration fee
                </p>

                <div className="bg-gray-100 p-6 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg text-gray-700">Registration Fee:</span>
                    <span className="text-3xl font-bold text-green-700">${registrationFee.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Email: <strong>{form.email}</strong>
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={paymentProcessing}
                  className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:bg-gray-400 mb-4"
                >
                  {paymentProcessing ? "Processing Payment..." : "Pay Now"}
                </button>

                <button
                  onClick={() => {
                    setStep("form");
                    setError(null);
                  }}
                  className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Back
                </button>
              </>
            )}

            {step === "verification" && (
              <>
                <div className="text-center">
                  <div className="mb-4 text-6xl">✓</div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">Verify Your Email</h1>
                  <p className="text-gray-600 mb-6">
                    We&apos;ve sent a verification link to <strong>{form.email}</strong>
                  </p>
                  <p className="text-gray-600 mb-8">
                    Please click the link in your email to verify your account and complete registration.
                  </p>

                  {success && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                      {success}
                    </div>
                  )}

                  <Link
                    href="/login"
                    className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                  >
                    Go to Sign In
                  </Link>
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
