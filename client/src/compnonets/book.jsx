import React, { useState, useEffect } from "react";
import axios from "axios";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    published_at: "",
    copies: 0,
  });
  const [editBook, setEditBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/books", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/books", newBook, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchBooks();
      setNewBook({ title: "", author: "", published_at: "", copies: 0 });
    } catch (error) {
      alert(error.response?.data?.message || "Error adding book");
    }
  };

  const updateBook = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/books/${editBook._id}`,
        editBook,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchBooks();
      setEditBook(null);
    } catch (error) {
      alert(error.response?.data?.message || "Error updating book");
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting book");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Books</h2>
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
                ? setEditBook({ ...editBook, copies: e.target.value })
                : setNewBook({ ...newBook, copies: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter number of copies"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-md hover:bg-primary-dark transition-colors w-full"
          >
            {editBook ? "Update Book" : "Add Book"}
          </button>
          {editBook && (
            <button
              type="button"
              className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-colors w-full"
              onClick={() => setEditBook(null)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-4">
        {books.map((book) => (
          <li
            key={book._id}
            className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
          >
            <span className="text-gray-800">
              {book.title} by {book.author} - {book.copies} copies
            </span>
            <div className="space-x-2">
              <button
                className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-colors"
                onClick={() => setEditBook(book)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                onClick={() => deleteBook(book._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Books;
