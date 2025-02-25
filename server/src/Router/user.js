import express from "express";
import { userLogin, userRegister } from "../Services/authServies.js";
import {
  booksDeleted,
  booksGet,
  booksPatch,
  booksPost,
} from "../Services/booksServices.js";
import { checkoutPost, checkoutUpdate } from "../Services/chekkoutServcies.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);

router.post("/books", booksPost);
router.get("/books", booksGet);

router.patch("/books/:id", booksPatch);

router.delete("/books/:id", booksDeleted);

router.post("/checkout",checkoutPost);
router.put("/checkout/:id",checkoutUpdate);

export default router;
