"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { getSessionToken, getSessionType, validateAdminSession } from "@/lib/session";

export default function AccountManagerDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRegistrations: 0,
    pendingVerifications: 0,
    totalRevenue: 0,
  });
  const [registrationFee, setRegistrationFee] = useState(0);
  const [tempFee, setTempFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Get session token
    const sessionToken = getSessionToken();
    const sessionType = getSessionType();
    
    console.log("Session token:", sessionToken ? "exists" : "missing");
    console.log("Session type:", sessionType);
    
    if (!sessionToken || sessionType !== "admin") {
      // Not authenticated, redirect to login
      console.log("No valid admin session, redirecting to login");
      window.location.href = "/login";
      return;
    }

    // Validate session and fetch admin data
    const loadAdmin = async () => {
      try {
        console.log("Validating admin session...");
        const adminData = await validateAdminSession(sessionToken);
        console.log("Admin data:", adminData);
        
        if (!adminData) {
          console.log("Admin validation failed, redirecting to login");
          window.location.href = "/login";
          return;
        }
        
        // Verify correct role
        if (adminData.role !== "account-manager") {
          console.log("Admin role mismatch:", adminData.role);
          window.location.href = "/login";
          return;
        }

        console.log("Admin authenticated successfully");
        setAdmin(adminData);
        
        // Fetch registration fee
        const res = await fetch("/api/admin/registration-fee");
        if (res.ok) {
          const data = await res.json();
          setRegistrationFee(data.fee || 0);
          setTempFee(data.fee || 0);
        }
      } catch (err) {
        console.error("Error loading admin:", err);
        window.location.href = "/login";
      }
    };

    loadAdmin();
    
    // TODO: Fetch stats from database
    setStats({
      totalUsers: 150,
      totalRegistrations: 45,
      pendingVerifications: 12,
      totalRevenue: 4500,
    });
    setLoading(false);
  }, []);

  const handleUpdateRegistrationFee = async () => {
    if (tempFee < 0) {
      alert("Registration fee cannot be negative");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch("/api/admin/registration-fee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fee: parseFloat(tempFee.toString()),
          role: admin?.role,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRegistrationFee(data.fee);
        setTempFee(data.fee);
        alert("Registration fee updated successfully!");
      } else {
        const error = await res.json();
        alert(`Failed to update fee: ${error.message}`);
      }
    } catch (err) {
      console.error("Error updating registration fee:", err);
      alert("Error updating registration fee");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="py-12 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Account Manager Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {admin?.username}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Total Users</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Total Registrations</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalRegistrations}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Pending Verifications</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingVerifications}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-purple-600">${stats.totalRevenue}</p>
            </div>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manage Accounts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Accounts</h2>
              <p className="text-gray-600 mb-4">
                View, verify, and manage user accounts.
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                View All Accounts
              </button>
            </div>

            {/* View Analytics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">View Analytics</h2>
              <p className="text-gray-600 mb-4">
                View detailed analytics and reports.
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                View Reports
              </button>
            </div>

            {/* Manage Registrations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Registrations</h2>
              <p className="text-gray-600 mb-4">
                Handle pending registrations and approvals.
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition">
                View Registrations
              </button>
            </div>

            {/* Registration Fee Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Registration Fee Management</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-2">Current Registration Fee</p>
                  <p className="text-3xl font-bold text-indigo-600">${registrationFee.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Set New Registration Fee
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <span className="text-gray-600">$</span>
                      <input
                        type="number"
                        value={tempFee}
                        onChange={(e) => setTempFee(parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      onClick={handleUpdateRegistrationFee}
                      disabled={updating || tempFee === registrationFee}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {updating ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Permissions</h2>
              <ul className="space-y-2 text-gray-600">
                {admin?.permissions?.map((perm: string) => (
                  <li key={perm} className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
