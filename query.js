const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

const getAllBooks = `SELECT * FROM books`;
const getAllCategories = `SELECT * FROM categories`;
const booksForCategory = `SELECT * FROM books WHERE category = ?`;
db.all(getAllBooks, [], (err, rows) => {
  if (err) return console.error(err.message);
  rows.forEach((row) => {
    console.log(row);
  });
});

db.all(getAllCategories, [], (err, rows) => {
  if (err) return console.error(err.message);
  rows.forEach((row) => {
    console.log(row);
  });
});

db.all(booksForCategory,['Sequential Art'],(err,rows) =>{
    if(err) return console.error(err.message);
    rows.forEach(row =>{
        console.log(row)
    })
})

// db.run('DROP TABLE categories')
// db.run('DROP TABLE books')
