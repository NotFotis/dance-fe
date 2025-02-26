"use client";
import { useState } from "react";
import TypingText from "../components/TypingText";
import Navbar from "../components/NavBar";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import { AuthForm, AuthModal } from "@/components/AuthForm";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRegisterForm, setIsRegisterForm] = useState(false); // Track form type

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleForm = () => setIsRegisterForm(!isRegisterForm);

  return (
    <div className="bg-gradient min-h-screen flex flex-col items-center justify-center relative">
      {/* Navbar - Pass toggleDrawer as prop */}
      
      <Navbar toggleDrawer={toggleDrawer} />

      {/* Hero Section with background image */}
      <div className="font-yaro text-white text-center bg-transparent">
          <TypingText />
        </div>

      {/* Events Section with enhanced Carousel */}
      <section id="events" className="my-20 w-full px-6">
        <h2 className="text-center text-4xl font-bold text-white mb-10">Upcoming Events</h2>
        <Carousel />
      </section>

      {/* Contact Form Section */}
      <section className="w-full px-6 py-10 bg-transparent rounded-xl shadow-xl">
        <ContactForm />
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
