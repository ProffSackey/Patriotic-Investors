"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { getSessionToken, getSessionType, validateAdminSession } from "@/lib/session";

export default function ExecutiveDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activeSessions: 0,
    systemHealth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionToken = getSessionToken();
    const sessionType = getSessionType();
    
    if (!sessionToken || sessionType !== "admin") {
      // Not authenticated, redirect to login
      window.location.href = "/login";
      return;
    }

    // Validate session and fetch admin data
    const loadAdmin = async () => {
      try {
        const adminData = await validateAdminSession(sessionToken);
        if (!adminData) {
          window.location.href = "/login";
          return;
        }
        
        // Verify correct role
        if (adminData.role !== "executive") {
          window.location.href = "/login";
          return;
        }

        setAdmin(adminData);

        setStats({
          totalUsers: 500,
          totalRevenue: 45000,
          activeSessions: 120,
          systemHealth: 99.8,
        });
      } catch (err) {
        console.error("Error loading admin:", err);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, []);

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
            <h1 className="text-4xl font-bold text-gray-800">Executive Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {admin?.username}</p>
          </div>

          {/* Executive Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Total Users</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">${stats.totalRevenue}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Active Sessions</p>
              <p className="text-3xl font-bold text-purple-600">{stats.activeSessions}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">System Health</p>
              <p className="text-3xl font-bold text-green-600">{stats.systemHealth}%</p>
            </div>
          </div>

          {/* Executive Functions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Manage Admins */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Admins</h2>
              <p className="text-gray-600 mb-4">
                Create, edit, and remove admin accounts.
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                Manage Admin Accounts
              </button>
            </div>

            {/* View Reports */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">View Reports</h2>
              <p className="text-gray-600 mb-4">
                Access comprehensive system reports and analytics.
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                View Reports
              </button>
            </div>

            {/* Manage Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Settings</h2>
              <p className="text-gray-600 mb-4">
                Configure system-wide settings and preferences.
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition">
                System Settings
              </button>
            </div>

            {/* Manage Fees */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Registration Fees</h2>
              <p className="text-gray-600 mb-4">
                Set and manage registration fee amounts.
              </p>
              <Link
                href="/admin-account"
                className="block text-center w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Manage Fees
              </Link>
            </div>
          </div>

          {/* Full Access Permissions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Full Access Permissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {admin?.permissions?.map((perm: string) => (
                <div key={perm} className="flex items-center p-3 bg-green-50 border border-green-200 rounded">
                  <span className="text-green-600 mr-3 font-bold">✓</span>
                  <span className="text-gray-700">{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
