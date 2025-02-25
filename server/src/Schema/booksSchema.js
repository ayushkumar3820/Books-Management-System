import mongoose from "mongoose";

const booksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    published_at: {
      type: String,
      required: true,
    },
    copies:{
        type:Number,
        required:true
    }
  },
  { timestamps: true }
);

const Books = new mongoose.model("Books", booksSchema);

export default Books;
