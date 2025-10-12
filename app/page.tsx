"use client";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [showFullPatron, setShowFullPatron] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // Short and full patron descriptions
  const shortDescription = (
    <>
      Is an Entrepreneur, Author and Engineer. He brings expertise in multiple fields including Real Estate development, Engineering, Fashion retails, Construction, and Writing. Mr. Kwabena Obeng Darko has inspired many through his dedication to excellence and his commitment to empowering others.
    </>
  );
  const fullDescription = (
    <>
      {shortDescription}
      <br /><br />
      His diverse background and relentless pursuit of knowledge make him a valuable asset to the Patriotic Investors community.<br /><br />
      Mr. Obeng Darko went to Opoku Ware School. He holds BSc. in Agricultural Engineering from KNUST and MSc. in Bioprocess Engineering from UCD. He has business interests in fashion retail, construction/engineering and real estate development/investment.<br /><br />
      He has written 12 books: 1. Perspective - how to develop the mindset to start and build your business 2. Streamline - how to teach yourself money. 3. Resilience 4. Unlimited opportunities. 5. African Advantage. 6. Self Investment 7. Financial Intelligence 8. Financial Freedom 9. Reset. 10. Real Estate. 11. Sales Systems. 12. Growth.<br /><br />
      He has been on many radio and TV stations to share his thoughts on such topics. Kwabena organizes business and finance seminars as well. He also has YouTube and Facebook Channels, OBENG DARKO, where he shares on African dignity, entrepreneurship, financial education, personal development, real estate, etc. He lives in Accra with his wife, Marie and Children, Yaa, Awuraa.
    </>
  );

  // Team members data (20 executives)
  const teamMembers = [
    {
      name: "Mrs. Rita Obeng Siaw",
      role: "President",
      img: "/team1.jpg",
    },
    {
      name: "Mrs. Justina Akpele",
      role: "Vice President",
      img: "/team2.jpg",
    },
    {
      name: "Sackey Abednego",
      role: "General Secretary",
      img: "/team3.jpg",
    },
    {
      name: "Mr. Obed Agyei Boamah",
      role: "Financial Secretary",
      img: "/team4.jpg",
    },
    {
      name: "Yaw Ofori",
      role: "Finance Manager",
      img: "/team5.jpg",
    },
    {
      name: "Akosua Dapaah",
      role: "Marketing Lead",
      img: "/team6.jpg",
    },
    {
      name: "Samuel Owusu",
      role: "IT Director",
      img: "/team7.jpg",
    },
    {
      name: "Martha Asante",
      role: "Legal Advisor",
      img: "/team8.jpg",
    },
    {
      name: "Felix Addo",
      role: "Logistics Manager",
      img: "/team9.jpg",
    },
    {
      name: "Linda Mensima",
      role: "HR Lead",
      img: "/team10.jpg",
    },
    {
      name: "Nana K. Boadu",
      role: "Partnerships Lead",
      img: "/team11.jpg",
    },
    {
      name: "Emmanuel Tetteh",
      role: "Field Operations",
      img: "/team12.jpg",
    },
    {
      name: "Patricia Owusu",
      role: "Sustainability Lead",
      img: "/team13.jpg",
    },
    {
      name: "Michael Darko",
      role: "Research Lead",
      img: "/team14.jpg",
    },
    {
      name: "Grace Opoku",
      role: "Events Coordinator",
      img: "/team15.jpg",
    },
    {
      name: "Josephine Amankwah",
      role: "Customer Relations",
      img: "/team16.jpg",
    },
    {
      name: "Daniel K. Sarpong",
      role: "Procurement Lead",
      img: "/team17.jpg",
    },
    {
      name: "Rebecca Adu",
      role: "Training Lead",
      img: "/team18.jpg",
    },
    {
      name: "Francis Appiah",
      role: "Compliance Officer",
      img: "/team19.jpg",
    },
    {
      name: "Esi Quartey",
      role: "Communications Lead",
      img: "/team20.jpg",
    },
  ];

  return (
    <div>
      <Navbar />
      <section className="bg-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 md:pl-13">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Investing in Ghana&apos;s <br /> Agricultural Future
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Patriotic Investors is a vibrant community committed to adding value
              to farm produce and building essential infrastructure, driving
              prosperity across Ghana.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <button
                className="bg-gray/10 text-green-700 font-semibold px-6 py-2 rounded-full shadow hover:bg-white/20 transition cursor-pointer"
                onClick={() => router.push("/contact")}
              >
                Contact Us
              </button>
            </div>
          </div>
          {/* Image */}
          <div className="flex-1 flex justify-center md:mr-10">
            <img
              src="heroimage.jpeg"
              alt="Ghana Agriculture"
              className="rounded-xl shadow-lg w-full max-w-lg max-h-[400px] object-cover"
              style={{ width: "100%", height: "400px" }}
            />
          </div>
        </div>
      </section>

      {/* Core Mission & Goals Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-10 mt-10">
          <h2 className="text-3xl text-black md:text-4xl font-bold mb-8">Our Core Mission &amp; Goals</h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
          {/* Community Collaboration */}
          <div className="bg-white rounded-2xl p-10 shadow text-center border mx-auto mb-6 w-full max-w-lg md:mb-0 md:w-auto flex flex-col">
            <div className="w-full mb-4">
              <img
                src="/unity.jpeg"
                alt="National Unity and Pride"
                className="object-cover w-full h-40 rounded-xl"
                style={{ display: "block" }}
              />
            </div>
            <h3 className="font-bold text-gray-700 text-xl mb-2">National Unity and Pride</h3>
            <p className="text-gray-700 text-base">
             True transformation begins with togetherness. By fostering unity among Ghanaians, we build a resilient foundation for inclusive growth, shared prosperity, and a national identity rooted in pride and purpose.
            </p>
          </div>
          {/* Infrastructure Development */}
          <div className="bg-white rounded-2xl p-10 shadow text-center border mx-auto mb-6 w-full max-w-lg md:mb-0 md:w-auto flex flex-col">
            <div className="w-full mb-4">
              <img
                src="/infrastracture.jpeg"
                alt="Infrastructure Development"
                className="object-cover w-full h-40 rounded-xl"
                style={{ display: "block" }}
              />
            </div>
            <h3 className="font-bold text-gray-700 text-xl mb-2">Infrastructure Development</h3>
            <p className="text-gray-700 text-base">
             Modern infrastructure is the backbone of agricultural resilience—reducing post-harvest losses, improving storage efficiency, and enabling year-round market access for Ghanaian produce.
            </p>
          </div>
          {/* Value Addition & Processing */}
          <div className="bg-white rounded-2xl p-10 shadow text-center border mx-auto w-full max-w-lg md:w-auto flex flex-col">
            <div className="w-full mb-4">
              <img
                src="/transportation.jpeg"
                alt="Value Addition & Processing"
                className="object-cover w-full h-40 rounded-xl"
                style={{ display: "block" }}
              />
            </div>
            <h3 className="font-bold text-gray-700 text-xl mb-2">Transportation &amp; Logistics </h3>
            <p className="text-gray-700 text-base">
              Efficient logistics not only reduce waste and unlock access to premium markets, empower farmers, and ensure Ghanaian produce reaches the world with pride and precision
            </p>
          </div>
        </div>
      </section>

      {/* Patron Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 ">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">Our Patron</h2>
          <div className="bg-gray-100 rounded-xl shadow p-8 flex flex-col md:flex-row items-center gap-8">
            {/* Patron Image */}
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
              <img
                src="/patron.jpg"
                alt="Patron"
                className="rounded-lg object-cover w-full h-full max-h-[420px] max-w-[350px] md:max-h-[500px] md:max-w-[400px]"
                style={{ objectFit: "cover" }}
              />
              <span className="block mt-4 text-lg font-semibold text-gray-800 text-center">
                Mr. Kwabena Obeng Darko
              </span>
            </div>
            {/* Patron Description */}
            <div className="w-full md:w-2/3 text-gray-700 ">
              <p>
                {showFullPatron ? fullDescription : shortDescription}
              </p>
              {!showFullPatron && (
                <button
                  className="mt-4 text-green-700 font-semibold hover:underline transition"
                  onClick={() => setShowFullPatron(true)}
                >
                  Read More
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-green-700 py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-white text-lg mb-8">
            Join our growing community and contribute to the sustainable development of Ghana&apos;s agricultural sector.
          </p>
          <button className="bg-white text-green-700 font-semibold px-8 py-3 rounded-full shadow hover:bg-gray-100 transition cursor-pointer" onClick={() => router.push("/contact")}>
             Get Involved Today
          </button>
        </div>
      </section>

      {/* Meet Our Dedicated Team Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Meet Our Dedicated Executives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {teamMembers.slice(0, 4).map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-4 flex flex-col  w-full max-w-xs cursor-pointer"
                style={{ minHeight: "260px", height: "260px" }}
                onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full rounded-xl mb-3"
                  style={{
                    height: expandedCard === idx ? "100%" : "75%",
                    objectFit: "cover",
                    transition: "height 0.3s"
                  }}
                />
                <h3 className="font-bold text-gray-800 text-base mb-1 text-center">{member.name}</h3>
                <p className="text-gray-500 text-sm text-center">{member.role}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow hover:bg-green-800 transition"
              onClick={() => router.push("/about")}
            >
              Read More
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
