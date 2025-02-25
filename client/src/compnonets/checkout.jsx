import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const Checkouts = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [newCheckout, setNewCheckout] = useState({ user_id: "", book_id: "" });
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const fetchCheckouts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/api/checkout`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCheckouts(Array.isArray(response.data) ? response.data : response.data.checkouts || []);
    } catch (error) {
      console.error("Error fetching checkouts:", error);
      setError(error.response?.data?.message || "Failed to fetch checkouts");
    } finally {
      setIsLoading(false);
    }
  };

  const checkoutBook = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`http://localhost:8000/api/checkout`, {
        ...newCheckout,
        user_id: newCheckout.user_id, 
        book_id: newCheckout.book_id, 
      }, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      fetchCheckouts();
      setNewCheckout({ user_id: "", book_id: "" });
      alert("Book checked out successfully");
    } catch (error) {
      console.error("Error checking out book:", error);
      const errorMessage = error.response?.data?.message || "Error checking out book";
      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const returnBook = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put(`http://localhost:8000/api/checkout/${id}`, {}, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      fetchCheckouts();
      alert("Book returned successfully");
    } catch (error) {
      console.error("Error returning book:", error);
      const errorMessage = error.response?.data?.message || "Error returning book";
      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Checkouts</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={checkoutBook} className="space-y-4 mb-6">
        <div>
          <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
          <input
            type="text"
            id="user_id"
            value={newCheckout.user_id}
            onChange={(e) => setNewCheckout({ ...newCheckout, user_id: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter User ID"
            required
          />
        </div>
        <div>
          <label htmlFor="book_id" className="block text-sm font-medium text-gray-700 mb-1">Book ID</label>
          <input
            type="text"
            id="book_id"
            value={newCheckout.book_id}
            onChange={(e) => setNewCheckout({ ...newCheckout, book_id: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter Book ID"
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
          {isLoading ? "Checking out..." : "Checkout Book"}
        </button>
      </form>
      {isLoading && !checkouts.length && <p className="text-gray-500">Loading checkouts...</p>}
      <ul className="space-y-4">
        {Array.isArray(checkouts) ? (
          checkouts.length > 0 ? (
            checkouts.map((checkout) => (
              <li key={checkout._id} className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                <span className="text-gray-800">User {checkout.user_id} checked out Book {checkout.book_id}</span>
                {checkout.return_date ? (
                  <span className="text-green-500 font-medium">Returned</span>
                ) : (
                  <button
                    className="bg-green-500 text-white p-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
                    onClick={() => returnBook(checkout._id)}
                    disabled={isLoading}
                  >
                    Return
                  </button>
                )}
              </li>
            ))
          ) : (
            !isLoading && <p className="text-gray-500">No checkouts available.</p>
          )
        ) : (
          <p className="text-red-500">Checkouts data is not an array.</p>
        )}
      </ul>
    </div>
  );
};

export default Checkouts;