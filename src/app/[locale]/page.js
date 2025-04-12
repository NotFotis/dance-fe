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

export default function Home() {
  const t = useTranslations();

  return (
    
    <div className="bg-transparent min-h-screen flex flex-col items-center justify-center relative">
      {/* Moving Ad Panel */}


      {/* Navbar */}
      <Navbar />
      <AudioForm/>
      {/* Hero Section with background image */}
      <TypingText />


      {/* Dance News Section */}
      <section id="news" className="my-20 w-full px-6">
        <News />
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="my-20 w-full px-6 ">
        <Carousel />
      </section>

      {/* Contact Form Section */}
      <section id="events" className="my-20 px-6 ">
                <About />
      </section>
      
      <section id="journey" className="my-20 w-full px-6 ">
        <JourneySection />
      </section>

      <section id="servies" className="my-20 w-full px-6 ">
        <OurServices />
      </section>
      {/* Footer Section */}
      <Footer />

      {/* Inline CSS for the marquee animation */}

    </div>
  );
}
