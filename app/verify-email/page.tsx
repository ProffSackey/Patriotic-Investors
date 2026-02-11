"use client";
import React, { Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerifyEmailClient from "./client";

export default function VerifyEmail() {
  return (
    <div>
      <Navbar />
      <section className="py-16 bg-gray-50 min-h-screen flex items-center">
        <Suspense
          fallback={
            <div className="max-w-md mx-auto px-4">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                  <div className="inline-block">
                    <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifying Email</h1>
                <p className="text-gray-600">Verifying your email...</p>
              </div>
            </div>
          }
        >
          <VerifyEmailClient />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}
