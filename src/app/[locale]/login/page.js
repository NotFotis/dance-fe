"use client";
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import Navbar from '@/components/NavBar';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const router = useRouter();
  // Use translations from the "login" namespace.
  const t = useTranslations("login");

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    console.log("Login successful:", userData);
    localStorage.setItem('token', userData.jwt); // Store token
    localStorage.setItem('user', JSON.stringify(userData.user)); // Store user info
    router.push('/profile'); // Redirect after login
  };

  return (
    <div className="bg-gradient min-h-screen flex flex-col items-center">
      <Navbar />

      <div className="flex-grow flex items-center justify-center w-full px-6">
        <div className="w-full max-w-md bg-transparent p-6 rounded-2xl text-white">
          <AuthForm type="login" onSuccess={handleLoginSuccess} />

          {/* Register Section (Closer Spacing) */}
          <div className="text-center mt-1">
            <p className="text-white text-sm">{t("noAccount")}</p>
            <button
              onClick={() => router.push('/register')}
              className="mt-1 px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              {t("register")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
