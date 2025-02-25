import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`http://localhost:8000/api/register`, formData, {
        withCredentials: true,
      });
      alert(response.data.message || "Registration successful");
      
      if (response.data.user) {
        console.log("Registered user:", response.data.user);
      }
      
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Registration failed due to a network or server error");
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-primary text-white p-3 rounded-md font-semibold transition-colors ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-primary-dark"
          }`}
        >
          {isLoading ? "Creating Account..." : "Register"}
        </button>
        <div className="mt-6 text-center text-sm text-gray-400">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="text-primary hover:text-primary-dark font-medium"
          >
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;