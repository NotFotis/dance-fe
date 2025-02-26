"use client";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import Navbar from "@/components/NavBar";

export default function RegisterPage() {
  const router = useRouter();

  // Handle successful registration
  const handleRegisterSuccess = (userData) => {
    console.log("Registration successful:", userData);
    localStorage.setItem("token", userData.jwt); // Store token
    localStorage.setItem("user", JSON.stringify(userData.user)); // Store user info
    router.push("/profile"); // Redirect after registration
  };

  return (
    <div className="bg-gradient min-h-[80vh] flex flex-col items-center">
      <Navbar />

      <div className="flex items-center justify-center w-full px-6 mt-10">
        <div className="w-full max-w-sm bg-transparent p-6 rounded-2xl text-white">
          <AuthForm type="register" onSuccess={handleRegisterSuccess} />

          {/* Login Button */}
          <div className="text-center mt-1">
            <p className="text-white text-sm">Already have an account?</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-1 px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
