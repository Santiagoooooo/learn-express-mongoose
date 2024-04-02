import db from '../db.js';

async function create(req, res) {
  const { family_name, first_name, genre_name } = req;
  
  try {
    const query1 = 'INSERT INTO genre (name) VALUES (?)';
    const values1 = [genre_name];
    const [genre_result] = await db.query(query1, values1);
    const genre_id = genre_result.insertId;

    const query2 = 'INSERT INTO book (family_name, first_name) VALUES (?, ?)';
    const values2 = [family_name, first_name];
    const [book_result] = await db.query(query2, values2);
    const book_id = book_result.insertId;

    const query3 = 'INSERT INTO book_genre (book, genre) VALUES (?, ?)';
    const values3 = [book_id, genre_id];
    await db.query(query3, values3);

    res.redirect(`/book/${book_id}`);
  } catch (err) {
    res.status(500).json(err);
  }
}

export default create;