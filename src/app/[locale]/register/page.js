"use client";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import Navbar from "@/components/NavBar";
import { useTranslations } from "next-intl";
import AudioForm from "@/components/AudioForm";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("register");

  // Handle successful registration
  const handleRegisterSuccess = (userData) => {
    console.log("Registration successful:", userData);
    localStorage.setItem("token", userData.jwt); // Store token
    localStorage.setItem("user", JSON.stringify(userData.user)); // Store user info
    router.push("/profile"); // Redirect after registration
  };

  return (
    <div className="bg-gradient min-h-screen flex flex-col items-center">
      <Navbar />
      <AudioForm/>
      
      <div className="flex-grow flex items-center justify-center w-full px-6 ">
        <div className="w-full max-w-sm bg-transparent p-6 rounded-2xl text-white">
          <AuthForm type="register" onSuccess={handleRegisterSuccess} />

          {/* Login Button */}
          <div className="text-center mt-1">
            <p className="text-white text-sm">{t("alreadyHaveAccount")}</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-1 px-5 py-2 bg-white text-black font-bold rounded-lg hover:bg-black hover:text-white transition"
            >
              {t("login")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
