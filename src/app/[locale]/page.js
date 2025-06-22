"use client";
import TypingText from "@/components/TypingText";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Carousel from "@/components/Carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import News from "@/components/News";
import About from "@/components/About";
import AudioForm from "@/components/AudioForm";
import OurServices from "@/components/Services";
import { useTranslations } from "next-intl";
import JourneySection from "@/components/Journey";
import SwipeableStack from "@/components/About";
import CookieBanner from "@/components/CookieBanner";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import SpecialEventsBanner from "@/components/SpecialEventsBanner";
import SpecialEventsBanner2 from "@/components/SpecialEventsBanner2";
import NewsletterSection from "@/components/Newsletter";

export default function Home() {
  const t = useTranslations();
  let newsletterText = [];
  return (
    
    <div className="bg-transparent min-h-screen flex flex-col items-center justify-center relative">
      {/* Moving Ad Panel */}


      {/* Navbar */}
      <Navbar />
      <AudioForm />
      {/* Hero Section with background image */}
      <TypingText />

      <SpecialEventsBanner />

      
      <SpecialEventsBanner2 />

      {/* Dance News Section */}
      <section id="news" className="my-6 md:my-20 w-full px-3 md:px-6">
        <News />
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="my-6 md:my-20 w-full px-3 md:px-6">
        <Carousel />
      </section>

      {/* Contact Form Section */}
      <section id="about" className="mt-8 md:mt-40 w-full px-3 md:px-6 py-8 md:py-12 mb-8 md:mb-20">
        <SwipeableStack apiUrl={process.env.NEXT_PUBLIC_API_URL} />
      </section>
      
      <section id="journey" className="my-6 md:my-20 w-full px-3 md:px-6">
        <JourneySection />
      </section>

      <section id="services" className="my-6 md:my-20 w-full px-3 md:px-6">
        <OurServices />
      </section>

      <section id="newsletter" className="my-6 md:my-20 w-full px-3 md:px-6">
      <NewsletterSection t={t} newsletterText={newsletterText} />
      </section>
      {/* Footer Section */}
      <Footer />

      <CookieBanner />
      {/* Inline CSS for the marquee animation */}

    </div>
  );
}
