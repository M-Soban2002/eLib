import express from 'express';
const router = express.Router();


import {
  getAllBooks,
  getBookById,
  updateBook,
  deleteBookById,
  searchBooks,
  deleteBooksByAuthor
} from "../controllers/books.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);
router.put('/books/:id', verifyJWT, updateBook);
router.delete('/books/:id', verifyJWT, deleteBookById);
router.get('/books/search', searchBooks);
router.delete('/books/author/:author', verifyJWT, deleteBooksByAuthor);

export default router;
