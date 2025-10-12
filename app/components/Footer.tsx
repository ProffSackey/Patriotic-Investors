import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-700 text-gray-200 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-wide">Patriotic Investors</span>
        </div>
        {/* Links */}
        <div className="flex flex-wrap gap-6 text-sm">
          <a href="/" className="hover:text-green-400 transition">Home</a>
          <a href="/about" className="hover:text-green-400 transition">About</a>
          <a href="/contact" className="hover:text-green-400 transition">Contact</a>
        </div>
        {/* Copyright */}
        <div className="text-s text-gray-400 text-center md:text-right">
          &copy; {new Date().getFullYear()} Patriotic Investors. All rights reserved.
        </div>
      </div>
    </footer>
  );
}