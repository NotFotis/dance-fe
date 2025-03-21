"use client";
import { motion } from "framer-motion";
import { FaCode, FaMobileAlt, FaPaintBrush, FaChartLine } from "react-icons/fa";

const services = [
  {
    icon: <FaCode />,
    title: "Web Development",
    description:
      "We build scalable and robust web applications tailored to your business needs.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Mobile Apps",
    description:
      "Crafting intuitive and engaging mobile experiences across all platforms.",
  },
  {
    icon: <FaPaintBrush />,
    title: "UI/UX Design",
    description:
      "Designing user-friendly interfaces that drive conversions and elevate your brand.",
  },
  {
    icon: <FaChartLine />,
    title: "Digital Marketing",
    description:
      "Strategic digital marketing solutions to boost your online presence and drive growth.",
  },
];

const circleVariants = {
  rest: { scale: 0 },
  hover: { scale: 20 }, // Adjust this value if needed to fully cover the card
};

export default function OurServices() {
  return (
    <section className="bg-transparent">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="relative group overflow-hidden bg-black p-8 rounded-lg shadow-lg cursor-pointer border border-white transition-colors duration-300 group-hover:border-black"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              {/* Expanding white circle */}
              <motion.div
                variants={circleVariants}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute bg-white rounded-full z-0"
                style={{
                  width: 50,
                  height: 50,
                  top: "50%",
                  left: "50%",
                  x: "-50%",
                  y: "-50%",
                }}
              />
              <div className="relative z-10 flex flex-col items-center text-white transition-colors duration-300 group-hover:text-black">
                <div className="text-4xl mb-4 group-hover:text-black">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-center group-hover:text-black">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
