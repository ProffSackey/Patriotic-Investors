"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const executives = [
  { name: "Mrs. Rita Obeng Siaw​", role: "President", img: "/team1.jpg" },
  { name: "Mrs. Justina Akpele​", role: "Vice President​", img: "/team2.jpg" },
  { name: "Sackey Abednego​", role: "General Secretary​", img: "/team3.jpg" },
  { name: "Mr. Obed Agyei Boamah​", role: "Financial Secretary​", img: "/team4.jpg" },
  { name: "Mr. Richard Kofi Bekoe Lartey​", role: "Organizer & Research Team Head​", img: "/team5.jpg" },
  { name: "Mr. Richard Boampong​", role: "Treasurer​", img: "/team6.jpg" },
  { name: "Mr. Godfred Danfrohdei​", role: "Public Relation Officer​", img: "/team7.jpg" },
  { name: "Mr Frank Kusi Kofi Boateng​", role: "Auditor​", img: "/team8.jpg" },
  { name: "Sandra Amarko Owusu​", role: "Customer Service Head​", img: "/team9.jpg" },
  { name: "Mr. Ernest Yawson​", role: "Executive Board Member​", img: "/team10.jpg" },
  { name: "Mad. Gloria Amaniampong​", role: "Publicity Head​", img: "/team11.jpg" },
  { name: "Mr. Isaac Mensah Agoe​", role: "Executive Board Member", img: "/team12.jpg" },
  { name: "Ms. Beatrice Konadu Sefaa​", role: "Executive Board Member", img: "/team13.jpg" },
  { name: "Mad. Serwaa Akoto Abena​", role: "Executive Board Member", img: "/team14.jpg" },
  { name: "Albeluv Oforiwaa Nketsia Dadzie​", role: "Executive Board Member", img: "/team15.jpg" },
  { name: "Mr. Isaac Adams Essilfie​", role: "Executive Board Member", img: "/team16.jpg" },
  { name: "Mr. Emmanuel Quansah", role: "Executive Board Member", img: "/team17.jpg" },
  { name: "Mr. Prince D. Addo", role: "Executive Board Member", img: "/team18.jpg" },
  { name: "Mr. Kofi Antwi-Sefa", role: "Executive Board Member", img: "/team19.jpg" },
  { name: "Mr. Joseph Kwame Amoani", role: "Executive Board Member", img: "/team20.jpg" },
];

const About: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <div>
      <Navbar />
      {/* History and Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-10 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Our History and Vision</h2>
            <p className="text-gray-700 mb-4">
              The journey of Patriotic Investors began in 2024, ignited by an inspirational talk on "Africa Industrialization" delivered by Mr. Kwabena Obeng Darko. His powerful message—urging Ghanaians and all Africans to unite and collaborate for national and continental development—struck a chord. This vision prompted a dedicated citizen in Ohio, Mad Victoria Mensah Zelle, to reach out to Mrs. Rita Obeng Siaw, who resides in the USA (President of Patriotic Investors), to unite and do something in the USA.
            </p>
            <p className="text-gray-700 mb-4">
              Recognizing the immense potential in this call to action, Mrs. Rita Obeng Siaw shared the idea with her team. A key member, Mr. Joe from Canada, passionately argued that this initiative must begin on their homeland, Ghana. The team convened to brainstorm potential ventures, with initial ideas ranging from real estate to manufacturing. The discussion took a pivotal turn when Mr. David Adu suggested focusing on agriculture, a cornerstone of the Ghanaian economy. Mr. Emmanuel Dantey also proposed the ambitious idea of building a university named after Mr. Kwabena Obeng Darko. Ultimately, the team reached a majority consensus to focus on agriculture, based on Mr. Adu’s powerful statement: "Agriculture is the backbone of every economy."
            </p>
            <p className="text-gray-700 mb-4">
              The initial registration period ran from May 1st to September 30th, 2024. Despite challenges and early dropouts, a core group of resilient visionaries—including Mrs. Rita Obeng Siaw, Mrs. Justina Akpele, Mr. Frank Kusi Kofi Boateng, Mr. Ernest Yawson, Mr. Obed Agyei Boamah, Mr. Richard Kofi Bekoe Lartey, Mr. Richard Boampong, Mr. Isaac Mensah Agoe, Mr. Isaac Adams Essilfie, and Mr. Joseph Kwame Amoani, along with Mr. Sackey Abednego—held firm to the vision, concluding the first registration with 130 dedicated members.
            </p>
            <p className="text-gray-700 mb-4">
              Following this success, the founding team decided to bring on board new executive members from the registered group to help accelerate the company's mission. This led to the addition of more visionary leaders, including Mr. Godfred Danfrohdei, Sandra Amarko Owusu, Gloria Amaniampong, Ms. Beatrice Konadu Sefaa, Albeluv Oforiwaa Nketsia Dadzie, Mr. Emmanuel Quansah, Mr. Prince D. Addo, and Mr. Kofi Antwi-Sefa.
            </p>
            <p className="text-gray-700 mb-4">
              With this expanded leadership, a new initiative was launched: opening a public portal for a second wave of registrations. This second batch, which took place from May 1st to June 30th, 2025, brought in an additional 60 members, further strengthening the Patriotic Investors community and its commitment to a prosperous Ghana.
            </p>
          </div>
        </div>
      </section>
      {/* Mission and Purpose Section */}
      <section className="py-16 bg-gray-50">
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900">Our Mission and Purpose</h2>
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-10">
          <p className="text-gray-700 mb-4">
            At Patriotic Investors, our core mission is to empower Ghana's agricultural sector and unite its people. We are committed to bridging the gap between seasonal abundance and scarcity by reducing farm produce waste and ensuring a year-round supply of food. By doing so, we are actively working to enhance food security and create a sustainable, prosperous future for all Ghanaians.
          </p>
          <p className="text-gray-700">
            We believe in fostering a sense of national unity and pride, bringing Ghanaians together as one people. Our vision is a brighter future where every individual has the opportunity to thrive, contribute to the nation's economic growth, and enjoy a better quality of life.
          </p>
        </div>
      </section>
      {/* Meet Our Dedicated Executives Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Meet Our Dedicated Executives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {executives.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-full max-w-xs cursor-pointer"
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
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;