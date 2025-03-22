"use client";
import TypingText from "../components/TypingText";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import News from "@/components/News";
import About from "@/components/About";
import AudioForm from "@/components/AudioForm";
import OurServices from "@/components/Services";

export default function Home() {

  return (
    
    <div className="bg-transparent min-h-screen flex flex-col items-center justify-center relative">
      {/* Moving Ad Panel */}
      <div className="w-full bg-black text-white py-1 overflow-hidden">
        <div
          className="whitespace-nowrap"
          style={{ animation: "marquee 15s linear infinite" }}
        >
          {/* Replace the text below with your ad or custom content */}
          Your ad text goes here - check out our latest offers! &nbsp;&nbsp;&nbsp; Your ad text goes here - check out our latest offers!
        </div>
      </div>

      {/* Navbar */}
      <Navbar />
      <AudioForm/>
      {/* Hero Section with background image */}
      <TypingText />
      {/* Contact Form Section */}
      <div className="font-yaro text-white text-center bg-transparent">
        <About />
      </div>

      {/* Dance News Section */}
      <section id="news" className="my-20 w-full px-6">
        <News />
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="my-20 w-full px-6">
        <Carousel />
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
