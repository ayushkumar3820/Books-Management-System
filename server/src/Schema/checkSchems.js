import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    checkout_date: { type: Date, default: Date.now },
    return_date: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Checkout", checkoutSchema);
