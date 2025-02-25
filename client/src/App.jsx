import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./compnonets/Register";
import Login from "./compnonets/Login";
import Books from "./compnonets/book";
import Checkouts from "./compnonets/checkout";
import ProtectedRoute from "./compnonets/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="container mx-auto max-w-4xl">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
            <Route path="/checkouts" element={<ProtectedRoute><Checkouts /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute><Books /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;