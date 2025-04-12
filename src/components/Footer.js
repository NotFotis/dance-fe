import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 w-full bottom-0 left-0">
      <div className="max-w-screen-xl mx-auto text-center">
        <p>&copy; 2025 dancetoday. All Rights Reserved.</p>
        <p>
          <a href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</a> | 
          <a href="/terms-of-service" className="text-blue-400 hover:underline"> Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
