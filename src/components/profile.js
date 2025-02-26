import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <p className="text-lg"><strong>Username:</strong> {user.username}</p>
          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
