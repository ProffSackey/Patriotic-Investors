"use client";
import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    emailjs.init("Tpn6otBmseQUlFoll"); // Replace with your EmailJS Public Key
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    try {
      const serviceID = "service_cf1ha0o"; // Replace with your EmailJS Service ID
      const templateID = "template_8u9c7gd"; // Replace with your EmailJS Template ID

      await emailjs.send(serviceID, templateID, {
        to_email: "patrioticinvestors1@gmail.com",
        from_name: form.name,
        from_email: form.email,
        subject: form.subject,
        message: form.message,
      });

      setSuccess("Message sent successfully to Patriotic Investors!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setSuccess("Failed to send message. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-gray-700 font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-700 text-base mx-4 md:mx-0">
            We&apos;d love to hear from you! Reach out to discuss partnerships, projects, or any inquiries you may have.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="bg-white rounded-xl shadow p-8 col-span-1 md:col-span-1">
            <h3 className="font-bold text-lg text-gray-700 mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm mb-2 text-gray-700">Your Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mb-4 px-3 py-2 border text-gray-500 rounded focus:outline-none focus:ring"
                placeholder="Enter your name"
                required
              />
              <label className="block text-sm mb-2 text-gray-700">Your Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full mb-4 px-3 py-2 border text-gray-500 rounded focus:outline-none focus:ring"
                placeholder="Enter your email address"
                required
              />
              <label className="block text-sm mb-2 text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full mb-4 px-3 py-2 border text-gray-500 rounded focus:outline-none focus:ring"
                placeholder="Subject of your inquiry"
                required
              />
              <label className="block text-sm mb-2 text-gray-700">Your Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full mb-6 px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring"
                rows={4}
                placeholder="Type your message here..."
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 rounded font-semibold transition"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {success && (
                <div className="mt-4 text-center text-green-700 font-semibold">{success}</div>
              )}
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}