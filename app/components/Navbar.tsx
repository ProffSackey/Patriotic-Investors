"use client";
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <div className="hidden md:flex space-x-8">
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;