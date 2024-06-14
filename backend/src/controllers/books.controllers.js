import {Book} from '../models/book.model.js';

export const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const books = await Book.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Book.countDocuments();

    res.status(200).json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//not to use
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const updateData = req.body;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.publisher.toString() !== user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this book' });
    }

    Object.assign(book, updateData);
    await book.save();

    res.json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.author.toString() !== user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this book' });
    }

    await book.remove();
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const regex = new RegExp(q, 'i');
    const books = await Book.find({
      $or: [
        { title: regex },
        { author: regex },
      ]
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//not to use
export const deleteBooksByAuthor = async (req, res) => {
  try {
    const { author } = req.params;
    const { user } = req;

    const books = await Book.find({ author, publisher: user.id });

    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found for this author or you are not authorized to delete them' });
    }

    const result = await Book.deleteMany({ author, publisher: user.id });

    res.json({ message: `Deleted ${result.deletedCount} book(s) by ${author}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
