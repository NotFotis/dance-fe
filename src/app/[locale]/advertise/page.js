"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/components/NavBar";

const AdvertisePage = () => {
  const router = useRouter();
  // Use the "advertise" namespace for this page's translations
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 text-lg">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-40">
        <h1 className="text-5xl font-extrabold mb-8 text-center uppercase tracking-widest">
          {t("advertiseWithUs")}
        </h1>
        
        {/* Why Advertise Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t("whyAdvertiseTitle")}
          </h2>
          <p className="mb-4">
            {t("whyAdvertiseDescription")}
          </p>
        </section>
        
        {/* Advertising Options Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t("advertisingOptionsTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">{t("bannerAdsTitle")}</h3>
              <p>{t("bannerAdsDescription")}</p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">{t("sponsoredContentTitle")}</h3>
              <p>{t("sponsoredContentDescription")}</p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">{t("videoAdsTitle")}</h3>
              <p>{t("videoAdsDescription")}</p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">{t("customCampaignsTitle")}</h3>
              <p>{t("customCampaignsDescription")}</p>
            </div>
          </div>
        </section>
        
        {/* Call-to-Action Section */}
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t("getInTouchTitle")}
          </h2>
          <p className="mb-4">
            {t("getInTouchDescription")}
          </p>
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

export default AdvertisePage;
