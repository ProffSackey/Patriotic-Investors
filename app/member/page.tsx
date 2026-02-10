"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getSessionToken,
  getSessionType,
  validateUserSession,
  clearSession,
} from "@/lib/session";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  verified: boolean;
  created_at: string;
}

export default function MemberDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session token
    const sessionToken = getSessionToken();
    const sessionType = getSessionType();

    if (!sessionToken || sessionType !== "user") {
      // Not logged in, redirect to login
      router.push("/login");
      return;
    }

    // Validate session and fetch user from Supabase
    const fetchUser = async () => {
      try {
        const userData = await validateUserSession(sessionToken);

        if (!userData) {
          console.error("User session validation failed");
          clearSession();
          router.push("/login");
          return;
        }

        setUser(userData as User);
      } catch (err) {
        console.error("Error loading user:", err);
        clearSession();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    // Clear session data using utility
    clearSession();
    router.push("/");
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <section className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4">
            <p>Loading...</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Navbar />
        <section className="py-16 bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4">
            <p>Not logged in</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  Welcome, {user.first_name}! 👋
                </h1>
                <p className="text-gray-600 mt-2">Member Dashboard</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>

            {/* Account Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <p className="text-gray-600 mb-2">Account Status</p>
                <p className="text-2xl font-bold text-green-600">
                  {user.verified ? "✓ Verified" : "⏳ Pending Verification"}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <p className="text-gray-600 mb-2">Account Email</p>
                <p className="text-lg font-semibold text-green-700">{user.email}</p>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm">First Name</p>
                  <p className="text-lg font-semibold text-gray-800">{user.first_name}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Last Name</p>
                  <p className="text-lg font-semibold text-gray-800">{user.last_name}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Email Address</p>
                  <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                </div>

                {user.phone && (
                  <div>
                    <p className="text-gray-600 text-sm">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-800">{user.phone}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-600 text-sm">Member Since</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Verification Status</p>
                  <p className={`text-lg font-semibold ${user.verified ? "text-green-600" : "text-yellow-600"}`}>
                    {user.verified ? "Verified ✓" : "Pending"}
                  </p>
                </div>
              </div>
            </div>

            {/* Member Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl mr-4">💼</span>
                  <div>
                    <p className="font-semibold text-gray-800">Investment Portfolio</p>
                    <p className="text-sm text-gray-600">View and manage your investments</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl mr-4">📊</span>
                  <div>
                    <p className="font-semibold text-gray-800">Analytics</p>
                    <p className="text-sm text-gray-600">Track your performance and returns</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl mr-4">🔐</span>
                  <div>
                    <p className="font-semibold text-gray-800">Account Security</p>
                    <p className="text-sm text-gray-600">Manage security settings</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl mr-4">💬</span>
                  <div>
                    <p className="font-semibold text-gray-800">Support</p>
                    <p className="text-sm text-gray-600">Contact our support team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
