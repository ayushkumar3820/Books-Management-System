import Books from "../Schema/booksSchema.js";
import User from "../Schema/userSchema.js";

export const checkoutPost = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    if (!userId || !bookId) {
      return res.status(404).json({ message: "user and book is are required" });
    }
    const user = await User.findById(user._id);
    const books = await Books.findById(book._id);

    if (!user || !books) {
      return res
        .status(409)
        .json({ message: "user and books id are not corrected" });
    }

    if (books.copies <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    books.copies -= 1;
    await books.save();

    const checkout = new Checkout({ user_id, book_id });
    await checkout.save();

    return res.status(200).json({ message: "checkout update" });
  } catch (error) {
    return res.status(500).json({ message: "Server checkout error " });
  }
};

export const checkoutUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const checkout = await Checkout.findById(id);
    if (!checkout) {
      return res.status(404).json({ message: "checkout are not update" });
    }
if(checkout.return.date){
    return res.status(409).json({message:"book are already updated"})
}
    checkout.return.date = new Date();
    await checkout.save();

    checkout.book_id.copies+=1;
    await checkout.book_id.save();
    return res.status(200).json({message:"sdffg",checkout})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server checkout update eror" });
  }
};
