import axios from 'axios';

const API_URL = 'http://localhost:1338/api/auth/local'; // Strapi's local auth endpoint

// Login function
export const login = async (identifier, password) => {
  try {
    const response = await axios.post(API_URL, {
      identifier,
      password,
    });
    return response.data; // Contains JWT and user info
  } catch (error) {
    throw new Error(error.response.data.error.message || 'Login failed');
  }
};

// Register function
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error.message || 'Registration failed');
  }
};

// Logout function
export const logout = () => {
  // Clear JWT token from localStorage
  localStorage.removeItem('token');
};
