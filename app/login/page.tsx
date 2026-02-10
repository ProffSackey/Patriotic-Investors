"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { createAdminSession, createUserSession } from "@/lib/session";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // TODO: Replace with your actual login API endpoint
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Login successful:", data);
        
        // Create session in Supabase
        if (data.isAdmin) {
          const adminId = data.admin?.id;
          console.log("Admin ID:", adminId);
          if (adminId) {
            const sessionResult = await createAdminSession(adminId);
            console.log("Admin session created:", sessionResult);
          }
          
          // Redirect to appropriate dashboard based on role
          const role = data.admin.role;
          console.log("Admin role:", role);
          if (role === "account-manager") {
            window.location.href = "/admin/account-manager";
          } else if (role === "customer-service") {
            window.location.href = "/admin/customer-service";
          } else if (role === "executive") {
            window.location.href = "/admin/executives";
          } else {
            window.location.href = "/admin/account-manager";
          }
        } else {
          // Regular user login
          const userId = data.user?.id;
          console.log("User ID:", userId);
          if (userId) {
            const sessionResult = await createUserSession(userId);
            console.log("User session created:", sessionResult);
          }
          window.location.href = "/member";
        }
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Login error:", err);
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <section className="py-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Sign In</h1>
            <p className="text-gray-600 mb-8 text-center">
              Welcome back to Patriotic Investors
            </p>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 text-gray-800 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="sack...@email.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 text-gray-800 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="••••••"
                  required
                />
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
                {loading ? "Signing In..." : "Sign In"}
              </button>

              {/* Register Link */}
              <p className="text-center text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-green-700 font-semibold hover:underline">
                  Register
                </Link>
              </p>

              {/* Forgot Password Link */}
              <p className="text-center text-gray-600 mt-4">
                <Link href="#" className="text-green-700 font-semibold hover:underline text-sm">
                  Forgot your password?
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
