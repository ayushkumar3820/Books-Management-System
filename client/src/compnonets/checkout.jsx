import React, { useState, useEffect } from "react";
import axios from "axios";

const Checkouts = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [newCheckout, setNewCheckout] = useState({ user_id: "", book_id: "" });

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const fetchCheckouts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/checkouts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCheckouts(response.data);
    } catch (error) {
      console.error("Error fetching checkouts:", error);
    }
  };

  const checkoutBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/checkouts", newCheckout, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCheckouts();
      setNewCheckout({ user_id: "", book_id: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Error checking out book");
    }
  };

  const returnBook = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/checkouts/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCheckouts();
    } catch (error) {
      alert(error.response?.data?.message || "Error returning book");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Checkouts</h2>
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
          className="w-full bg-primary text-white p-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Checkout Book
        </button>
      </form>
      <ul className="space-y-4">
        {checkouts.map((checkout) => (
          <li key={checkout._id} className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
            <span className="text-gray-800">User {checkout.user_id} checked out Book {checkout.book_id}</span>
            {checkout.return_date ? (
              <span className="text-green-500 font-medium">Returned</span>
            ) : (
              <button
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
                onClick={() => returnBook(checkout._id)}
              >
                Return
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checkouts;