const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 8000;
const mongoose = require('mongoose');
const mongoDB = "mongodb://127.0.0.1:27017/my_library_db";

mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function() {
  console.log('Connected to database');
});

const Book = require('./models/book');
const Author = require('./models/author');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/home', (_, res) => {
  res.send('Welcome to the home page');
});

app.get('/available', async (_, res) => {
  try {
    const books = await Book.find({ status: 'available' }).select('title status');
    res.send(books);
  } catch (error) {
    console.error('Error retrieving available books:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/books', async (_, res) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/authors', async (_, res) => {
  try {
    const authors = await Author.find().select('name lifespan');
    res.send(authors);
  } catch (error) {
    console.error('Error retrieving authors:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/book_dtls', async (req, res) => {
  try {
    const book = await Book.findById(req.query.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.send(book);
  } catch (error) {
    console.error('Error retrieving book details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/newbook', async (req, res) => {
  const { familyName, firstName, genreName, bookTitle } = req.body;
  if (!familyName || !firstName || !genreName || !bookTitle) {
    return res.status(400).send('Invalid Inputs');
  }

  try {
    const author = await Author.findOne({ family_name: familyName, first_name: firstName });
    if (!author) {
      return res.status(404).send('Author not found');
    }

    const book = new Book({
      title: bookTitle,
      author: author._id,
      genre: genreName
    });

    await book.save();
    res.send('Book created successfully');
  } catch (error) {
    console.error('Error creating new book:', error);
    res.status(500).send('Failed to create new book');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});