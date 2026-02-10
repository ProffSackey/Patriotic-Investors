"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getSessionToken, getSessionType, validateAdminSession, clearSession } from "@/lib/session";

interface AdminUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Only check session after component is mounted on client
    setHydrated(true);
    
    const sessionToken = getSessionToken();
    const sessionType = getSessionType();
    
    if (sessionToken && sessionType === "admin") {
      // Validate session and fetch admin data
      const loadAdmin = async () => {
        try {
          const adminData = await validateAdminSession(sessionToken);
          if (adminData) {
            setAdmin(adminData);
          }
        } catch (e) {
          console.error("Failed to load admin data", e);
          setAdmin(null);
        }
      };
      loadAdmin();
    }
  }, []);

  const handleLogout = () => {
    clearSession();
    window.location.href = "/login";
  };

  // Only render admin navbar after hydration and if admin is logged in
  if (!hydrated || !admin) {
    // Regular navbar for non-admin users
    return (
      <nav className="bg-green-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Patriotic Investors Logo"
                className="h-8 w-8 rounded-full"
              />
              <span className="text-white text-1xl font-bold tracking-wide">
                PATRIOTIC INVESTORS
              </span>
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/" className="text-white hover:text-gray-200 font-medium transition">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-gray-200 font-medium transition">
                About Us
              </Link>
              <Link href="/contact" className="text-white hover:text-gray-200 font-medium transition">
                Contact Us
              </Link>
            </div>
            {/* Auth Buttons */}
            <div className="hidden md:flex gap-4 items-center">
              <Link href="/login" className="text-white hover:text-gray-200 font-medium transition">
                Sign In
              </Link>
              <Link href="/register" className="bg-white text-green-700 px-4 py-2 rounded font-medium hover:bg-gray-100 transition">
                Register
              </Link>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-green-600 px-2 pb-3 space-y-1">
            <Link href="/" className="block text-white py-2 px-3 rounded hover:bg-green-500">
              Home
            </Link>
            <Link href="/about" className="block text-white py-2 px-3 rounded hover:bg-green-500">
              About Us
            </Link>
            <Link href="/contact" className="block text-white py-2 px-3 rounded hover:bg-green-500">
              Contact Us
            </Link>
            <Link href="/login" className="block text-white py-2 px-3 rounded hover:bg-green-500">
              Sign In
            </Link>
            <Link href="/register" className="block bg-white text-green-700 py-2 px-3 rounded font-medium hover:bg-gray-100">
              Register
            </Link>
          </div>
        )}
      </nav>
    );
  }

  // Admin navbar for logged in users
  return (
    <nav className="bg-green-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Patriotic Investors Logo"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-white text-1xl font-bold tracking-wide">
              PATRIOTIC INVESTORS
            </span>
          </div>

          {/* Admin Info and Logout */}
          <div className="flex items-center gap-6">
            {/* Role Badge */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-white text-sm font-medium">
                  {admin.first_name && admin.last_name ? `${admin.first_name} ${admin.last_name}` : admin.username}
                </p>
                <p className="text-green-100 text-xs capitalize">{admin.role}</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-700 font-bold text-lg">
                {admin.first_name ? admin.first_name.charAt(0).toUpperCase() : admin.username.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-white hover:text-gray-200 transition p-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                <svg className={`w-4 h-4 transition ${dropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Dropdown Content */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50">
                  <div className="px-4 py-4 border-b border-gray-200">
                    <p className="text-gray-800 font-semibold">
                      {admin.first_name && admin.last_name ? `${admin.first_name} ${admin.last_name}` : admin.username}
                    </p>
                    <p className="text-gray-600 text-sm">{admin.email}</p>
                    <p className="text-green-600 text-sm font-medium mt-2 capitalize bg-green-50 px-2 py-1 rounded inline-block">
                      {admin.role}
                    </p>
                  </div>
                  <div className="border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
