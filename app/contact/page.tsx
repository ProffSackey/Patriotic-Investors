"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <div>
      <Navbar />
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-gray-700 font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-700 text-base mx-4 md:mx-0">
            We&apos;d love to hear from you! Reach out to discuss partnerships, projects, or any inquiries you may have. Your collaboration is key to Ghana&apos;s agricultural prosperity.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow p-8 col-span-1 md:col-span-1">
            <h3 className="font-bold text-lg text-gray-700 mb-6">Send us a message</h3>
            <form>
              <label className="block text-sm mb-2 text-gray-700">Your Name</label>
              <input type="text" className="w-full mb-4 px-3 py-2 border text-gray-500 rounded focus:outline-none focus:ring" placeholder="Enter your name" />
              <label className="block text-sm mb-2 text-gray-700">Your Email</label>
              <input type="email" className="w-full mb-4 px-3 py-2 border text-gray-500  rounded focus:outline-none focus:ring" placeholder="Enter your email address" />
              <label className="block text-sm mb-2 text-gray-700">Subject</label>
              <input type="text" className="w-full mb-4 px-3 py-2 border text-gray-500  rounded focus:outline-none focus:ring" placeholder="Subject of your inquiry" />
              <label className="block text-sm mb-2 text-gray-700">Your Message</label>
              <textarea className="w-full mb-6 px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring" rows={4} placeholder="Type your message here..."></textarea>
              <button type="submit" className="w-full  bg-green-700 text-white py-2 rounded font-semibold hover:bg-yellow-800 transition">
                Send Message
              </button>
            </form>
          </div>
          {/* Contact Details and Social */}
          <div className="flex flex-col gap-8 col-span-1 md:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 mb-4">
              <h4 className="font-bold text-gray-700 mb-4">Contact Details</h4>
              <div className="flex items-center mb-2">
                <span className="text-green-700 mr-2">
                  {/* Phone Icon */}
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92V19a2 2 0 01-2.18 2A19.86 19.86 0 013 5.18 2 2 0 015 3h2.09a2 2 0 012 1.72c.13.81.28 1.61.46 2.39a2 2 0 01-.45 2L7.21 10.29a16 16 0 006.5 6.5l1.18-1.18a2 2 0 012-.45c.78.18 1.58.33 2.39.46a2 2 0 011.72 2z"/>
                  </svg>
                </span>
                <span className="text-gray-700">Phone: 0597194123</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-700 mr-2">
                  {/* Email Icon */}
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16v16H4V4zm0 0l8 8 8-8"/>
                  </svg>
                </span>
                <span className="text-gray-700">Email: patrioticinvestors1@gmail.com</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 mb-4">
              <h4 className="font-bold text-gray-700 mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-blue-600 transition" title="Facebook">
                  <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 5.02 3.66 9.16 8.44 9.93v-7.03H7.9v-2.9h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7.03C18.34 21.23 22 17.09 22 12.07z"/>
                  </svg>
                </a>
                <a href="#" className="text-black transition" title="TikTok">
                  <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.5 2v14.5a3.5 3.5 0 11-3.5-3.5h1.5v-2H9a5.5 5.5 0 105.5 5.5V2h-2z"/>
                  </svg>
                </a>
                <a href="#" className="text-red-600 transition" title="YouTube">
                  <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.8 8.001a2.75 2.75 0 00-1.94-1.94C18.07 6 12 6 12 6s-6.07 0-7.86.061a2.75 2.75 0 00-1.94 1.94C2 9.801 2 12.001 2 12.001s0 2.2.2 3.999a2.75 2.75 0 001.94 1.94C5.93 18 12 18 12 18s6.07 0 7.86-.061a2.75 2.75 0 001.94-1.94c.2-1.799.2-3.999.2-3.999s0-2.2-.2-3.999zM10 15.5v-7l6 3.5-6 3.5z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}