const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(`./test.db`, sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

// const getAllBooks = `SELECT * FROM books`;
// const getAllCategories = `SELECT * FROM categories`;
// const booksForCategory = `SELECT * FROM books WHERE category = ?`;
// db.all(getAllBooks, [], (err, rows) => {
//   if (err) return console.error(err.message);
//   rows.forEach((row) => {
//     console.log(row);
//   });
// });

// db.all(getAllCategories, [], (err, rows) => {
//   if (err) return console.error(err.message);
//   rows.forEach((row) => {
//     console.log(row);
//   });
// });

// db.all(booksForCategory,['Sequential Art'],(err,rows) =>{
//     if(err) return console.error(err.message);
//     rows.forEach(row =>{
//         console.log(row)
//     })
// })


// const getCategoryId2 = async (categoryName) =>{
//   const db = await new sqlite3.Database(`./test.db`, sqlite3.OPEN_READWRITE, (err) => {
//     if (err) return console.error(err.message);
//   });
//   let getCategoryId = `SELECT category_id FROM categories WHERE category_name = ?`;
//   const categoryId = await db.get(getCategoryId, [categoryName], (err, row) => {
//     if (err) return console.error(err.message);
//     console.log(row.category_id)
//     return row;
//     })
//     // console.log(categoryId)
// }
// getCategoryId2("Historical Fiction")
// let getCategoryId = `SELECT * FROM categories WHERE category_name = ?`;



// const getCategoryId3 = (categoryName) =>{
//   db.get(getCategoryId, [categoryName], (err, row) => {
//   if (err) return console.error(err.message);
//   console.log(row.category_id)
//   let categoryId= row.category_id
//   })
// }
// getCategoryId3("Historical Fiction")


db.run('DROP TABLE categories')
db.run('DROP TABLE books')
