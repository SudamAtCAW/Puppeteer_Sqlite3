const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./test.db',sqlite3.OPEN_READWRITE,(err) =>{
    if(err) return console.error(err.message);
  });



let querry2 =   `SELECT * FROM categories`
db.all(querry2,[],(err,rows) =>{
    if(err) return console.error(err.message);
    rows.forEach(row =>{
        console.log(row)
    })
})

let querry =   `SELECT * FROM books`
db.all(querry,[],(err,rows) =>{
    if(err) return console.error(err.message);
    rows.forEach(row =>{
        console.log(row)
    })
})

// db.run('DROP TABLE categories')
// db.run('DROP TABLE books')
