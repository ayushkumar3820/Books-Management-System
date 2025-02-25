import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const Books = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    published_at: "",
    copies: 0,
  });
  const [editBook, setEditBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/api/books`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const booksData = Array.isArray(response.data) ? response.data : response.data.books || [];
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError(error.response?.data?.message || "Failed to fetch books");
    } finally {
      setIsLoading(false);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`http://localhost:8000/api/books`, newBook, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchBooks();
      setNewBook({ title: "", author: "", published_at: "", copies: 0 });
    } catch (error) {
      console.error("Error adding book:", error);
      const errorMessage = error.response?.data?.message || "Error adding book";
      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBook = async (e) => {
    e.preventDefault();
    if (!editBook || !editBook._id) {
      setError("No book selected for update or invalid book ID");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/books/${editBook._id}`,
        editBook,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json", 
          },
        }
      );
      fetchBooks();
      setEditBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
      const errorMessage = error.response?.data?.message || "Error updating book";
      alert(errorMessage);
      setError(errorMessage);
      if (error.response?.status === 404) {
        console.error("Book not found in backend:", editBook._id);
      } else if (error.response?.status === 405) {
        console.error("Method not allowed (CORS or backend issue):", error.response.status);
      } else if (error.message.includes("CORS")) {
        console.error("CORS error occurred:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBook = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:8000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      const errorMessage = error.response?.data?.message || "Error deleting book";
      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = (bookId) => {
    
    navigate(`/checkouts`)} ;
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Books</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form
        onSubmit={editBook ? updateBook : addBook}
        className="space-y-4 mb-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={editBook ? editBook.title : newBook.title}
            onChange={(e) =>
              editBook
                ? setEditBook({ ...editBook, title: e.target.value })
                : setNewBook({ ...newBook, title: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter book title"
            required
          />
        </div>
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            value={editBook ? editBook.author : newBook.author}
            onChange={(e) =>
              editBook
                ? setEditBook({ ...editBook, author: e.target.value })
                : setNewBook({ ...newBook, author: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter author name"
            required
          />
        </div>
        <div>
          <label
            htmlFor="published_at"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Published Date
          </label>
          <input
            type="date"
            id="published_at"
            value={editBook ? editBook.published_at : newBook.published_at}
            onChange={(e) =>
              editBook
                ? setEditBook({ ...editBook, published_at: e.target.value })
                : setNewBook({ ...newBook, published_at: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label
            htmlFor="copies"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Copies
          </label>
          <input
            type="number"
            id="copies"
            value={editBook ? editBook.copies : newBook.copies}
            onChange={(e) =>
              editBook
                ? setEditBook({ ...editBook, copies: Number(e.target.value) })
                : setNewBook({ ...newBook, copies: Number(e.target.value) })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter number of copies"
            required
            min="0"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-primary text-white p-3 rounded-md font-semibold transition-colors w-full ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-primary-dark"
            }`}
          >
            {isLoading ? (editBook ? "Updating..." : "Adding...") : editBook ? "Update Book" : "Add Book"}
          </button>
          {editBook && (
            <button
              type="button"
              className="bg-gray-500 text-white p-3 rounded-md font-semibold hover:bg-gray-600 transition-colors w-full"
              onClick={() => setEditBook(null)}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {isLoading && !books.length && <p className="text-gray-500">Loading books...</p>}
      <ul className="space-y-4">
        {Array.isArray(books) ? (
          books.length > 0 ? (
            books.map((book) => (
              <li
                key={book._id}
                className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
              >
                <span className="text-gray-800">
                  {book.title} by {book.author} - {book.copies} copies
                </span>
                <div className="space-x-2">
                  <button
                    className="bg-yellow-500 text-white p-2 rounded-md font-semibold hover:bg-yellow-600 transition-colors"
                    onClick={() => setEditBook(book)}
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-md font-semibold hover:bg-red-600 transition-colors"
                    onClick={() => deleteBook(book._id)}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-green-500 text-white p-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
                    onClick={() => handleCheckout(book._id)}
                    disabled={isLoading || book.copies === 0}
                  >
                    Checkout
                  </button>
                </div>
              </li>
            ))
          ) : (
            !isLoading && <p className="text-gray-500">No books available.</p>
          )
        ) : (
          <p className="text-red-500">Books data is not an array.</p>
        )}
      </ul>
    </div>
  );
};

export default Books;