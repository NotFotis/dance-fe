"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/NavBar";

const AdvertisePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 text-lg">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-40">
        <h1 className="text-5xl font-extrabold mb-8 text-center uppercase tracking-widest">
          Advertise with Us
        </h1>
        
        {/* Why Advertise Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            Why Advertise on Our Platform?
          </h2>
          <p className="mb-4">
            Our platform reaches a diverse and engaged audience across various
            demographics. By advertising with us, you'll have the opportunity to
            connect with potential customers and boost your brand's visibility.
            Our innovative advertising solutions ensure your message is delivered
            effectively and resonates with our audience.
          </p>
        </section>
        
        {/* Advertising Options Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            Our Advertising Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">Banner Ads</h3>
              <p>
                Place your banner ads on high-traffic areas of our platform, ensuring
                maximum visibility and engagement.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">Sponsored Content</h3>
              <p>
                Leverage our editorial space with sponsored posts and articles that
                resonate with our audience.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">Video Ads</h3>
              <p>
                Engage our users with dynamic video ads that tell your brand story in
                a compelling way.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">Custom Campaigns</h3>
              <p>
                Work with our team to develop tailor-made advertising campaigns that
                align with your business goals.
              </p>
            </div>
          </div>
        </section>
        
        {/* Call-to-Action Section */}
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            Get in Touch
          </h2>
          <p className="mb-4">
            Ready to boost your brand's visibility? Contact our advertising team to
            learn more about our packages and to discuss custom solutions.
          </p>
          <button
            onClick={() => router.push("/contact")}
            className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
          >
            Contact Us
          </button>
        </section>
      </div>
    </div>
  );
};

export default AdvertisePage;
