import Books from "../Schema/booksSchema.js";

export const booksPost = async (req, res) => {
  try {
    const { title, author, published_at, copies } = req.body;

    const newBook = new Books({
      title,
      author,
      published_at,
      copies,
    });
    await newBook.save();
    return res.status(200).json({ message: "newBook are created", newBook });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error " });
  }
};

export const booksGet = async (req, res) => {
  try {
    const books = await Books.find();
    return res.status(200).json({ message: "get the books data", books });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error " });
  }
};

export const booksPatch = async (req, res) => {
  try {
    const { id } = req.params;

    const booksUpdate = await Books.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!booksUpdate) {
      return res.status(404).json({ message: "user are not updated" });
    }
    return res
      .status(200)
      .json({ message: "user are updated successfully", booksUpdate });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error " });
  }
};

export const booksDeleted = async (req, res) => {
  try {
    const { id } = req.params;

    const booksDeleted = await Books.findByIdAndUpdate(id);

    if (!booksDeleted) {
      return res.status(404).json({ message: "user are not Deleted" });
    }
    return res
      .status(200)
      .json({ message: "user are updated successfully", booksDeleted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error " });
  }
};
