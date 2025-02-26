import React, { useState } from "react";
import axios from "axios";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      // Send form data to Strapi or any other backend
      await axios.post(`${API_URL}/contact-forms`, {
        data: {
          name: formData.name,
          email: formData.email,
          message: formData.message.trim(), // Ensure it's a string
        },
      });
      

      setSuccess("Thank you! Your message has been sent.");
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <section id="contact" className="py-12 px-6 bg-black rounded-3xl mt-8">
      <h2 className="text-center text-5xl font-bold mb-8 text-white rounded-3xl">Contact Us</h2>
      
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-black p-8 rounded-3xl shadow-lg space-y-6 w-full md:w-[400px] flex flex-col justify-between"
      >
        <div className="flex flex-col">
          <label htmlFor="name" className="text-lg font-medium mb-2 text-white">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-lg font-medium mb-2 text-white">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="message" className="text-lg font-medium mb-2 text-white">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg mb-6"
          disabled={loading}
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
