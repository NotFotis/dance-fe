"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthForm = ({ type, onSuccess }) => {
  const [formData, setFormData] = useState({
    identifier: "", 
    password: "",
    username: "", 
    email: "", 
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    setError(null);

    try {
      let requestData;
      let endpoint;
      
      if (type === "register") {
        endpoint = `${NEXT_PUBLIC_API_URL}/auth/local/register`;
        requestData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };
      } else {
        endpoint = `${NEXT_PUBLIC_API_URL}/auth/local`;
        requestData = {
          identifier: formData.identifier, 
          password: formData.password,
        };
      }

      const { data } = await axios.post(endpoint, requestData);

      if (data.jwt && data.user) {
        console.log("Login successful, storing user data...");
  
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (onSuccess) {
          onSuccess(data);
        }

        router.push("/profile"); // Redirect after login
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err);
      setError(err.response?.data?.message || "An error occurred");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent text-white">
      <div className="w-full max-w-md p-8 bg-black rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">
          {type === "register" ? "Register" : "Login"}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "register" && (
            <>
              <div>
                <label className="block text-gray-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-600 bg-gray-800 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-600 bg-gray-800 rounded-lg"
                />
              </div>
            </>
          )}
          {type === "login" && (
            <div>
              <label className="block text-gray-300">Email or Username</label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-600 bg-gray-800 rounded-lg"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-600 bg-gray-800 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Processing..." : type === "register" ? "Register" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
