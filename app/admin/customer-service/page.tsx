"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { getSessionToken, getSessionType, validateAdminSession } from "@/lib/session";

export default function CustomerServiceDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [tickets, setTickets] = useState({
    open: 8,
    inProgress: 5,
    resolved: 34,
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
        if (adminData.role !== "customer-service") {
          window.location.href = "/login";
          return;
        }

        setAdmin(adminData);
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
            <h1 className="text-4xl font-bold text-gray-800">Customer Service Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {admin?.username}</p>
          </div>

          {/* Ticket Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Open Tickets</p>
              <p className="text-3xl font-bold text-red-600">{tickets.open}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">{tickets.inProgress}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{tickets.resolved}</p>
            </div>
          </div>

          {/* Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Support Tickets */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Support Tickets</h2>
              <p className="text-gray-600 mb-4">
                View and respond to customer support tickets.
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                View Tickets
              </button>
            </div>

            {/* Handle Complaints */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Handle Complaints</h2>
              <p className="text-gray-600 mb-4">
                Review and address customer complaints.
              </p>
              <button className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">
                View Complaints
              </button>
            </div>

            {/* Customer Database */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Database</h2>
              <p className="text-gray-600 mb-4">
                Search and view customer information.
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                Search Customers
              </button>
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
