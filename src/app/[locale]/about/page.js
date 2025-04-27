"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/components/NavBar";
import AudioForm from "@/components/AudioForm"

const AboutPage = () => {
  const router = useRouter();
  const t = useTranslations('about');

  return (
    <div className="min-h-screen bg-transparent text-white py-12 px-4 text-lg">
      <Navbar />
      <AudioForm/>
      <div className="max-w-7xl mx-auto mt-40">
        <h1 className="text-5xl font-extrabold mb-8 text-center uppercase tracking-widest">
          {t("aboutUs")}
        </h1>

        {/* Our Story Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t("ourStoryTitle")}
          </h2>
          <p className="mb-4">{t("ourStoryDescription")}</p>
        </section>

        {/* Mission & Vision Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t("missionVisionTitle")}
          </h2>
          <p className="mb-4">{t("missionDescription")}</p>
          <p>{t("visionDescription")}</p>
        </section>

        {/* The Team Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t("teamTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-900 rounded-lg shadow-2xl text-center">
              <h3 className="text-2xl font-bold mb-2">{t("founderName")}</h3>
              <p className="italic mb-1">{t("founderRole")}</p>
              <p>{t("founderBio")}</p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg shadow-2xl text-center">
              <h3 className="text-2xl font-bold mb-2">{t("coFounderName")}</h3>
              <p className="italic mb-1">{t("coFounderRole")}</p>
              <p>{t("coFounderBio")}</p>
            </div>
            {/* Add more team members if needed */}
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t("joinUsTitle")}
          </h2>
          <p className="mb-4">{t("joinUsDescription")}</p>
          <button
            onClick={() => router.push("/contact")}
            className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
          >
            {t("contactUs")}
          </button>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
