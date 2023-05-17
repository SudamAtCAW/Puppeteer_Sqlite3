const sqlite3 = require('sqlite3').verbose();
const puppeteer = require('puppeteer')
const url = 'https://books.toscrape.com/'

let createCategoriesTable, createBooksTable, insertIntoCategories, insertIntoBooks, querry, querry2;

//conect to a DB
const db = new sqlite3.Database('./test.db',sqlite3.OPEN_READWRITE,(err) =>{
    if(err) return console.error(err.message);
});

//create table
createCategoriesTable = `CREATE TABLE if not exists categories(category_id INTEGER PRIMARY KEY, category_name)`
createBooksTable = `CREATE TABLE if not exists books(book_id INTEGER PRIMARY KEY, book_name, image_url, book_price INTEGER, book_rating INTEGER)`
//drop table
//db.run('DROP TABLES table_name')

//insert into tables
insertIntoCategories= `INSERT INTO categories(category_name) VALUES (?) `
insertIntoBooks = `INSERT INTO books(book_name, image_url, book_price, book_rating) VALUES (?, ?, ?, ?)`

//in the square bracket we have to provide the values in order 
// db.run(insertIntoGenres,[],(err) =>{
//     if(err) return console.error(err.message);
// })

// db.run(insertIntoBooks,[],(error) =>{
//     if(err) return console.error(err.message);
// })


db.run(createBooksTable)
db.run(createCategoriesTable)


//upadte data
//It will update the book name based on the given book_id 
//update = `UPDATE books SET book_name = ? WHERE book_id = ?`

const main = async () =>{
    const browser = await puppeteer.launch({
        headless : false,
        defaultViewport : { 'width' : 1920, 'height' : 1080 }
    })
    const page = await browser.newPage()
    await page.setViewport( { 'width' : 1920, 'height' : 1080 } );
    await page.goto(url)




const categories = await page.$$('div .side_categories .nav ul li a');


for (const category of categories) {
    const categoryName = await page.evaluate(el => el.innerText, category);
    db.run(insertIntoCategories,[categoryName],(err) =>{
            if(err) return console.error(err.message);
        })
        
}

    


    

    while( await page.$('.pager .next a')){
     
const booksData = await page.evaluate(() => 

Array.from(document.querySelectorAll('.product_pod'), (book) =>({

    bookName : book.querySelector('h3 a').getAttribute('title'),
    price : book.querySelector('.price_color').innerText,
    imageSrc : book.querySelector('img').getAttribute('src'),
    rating : book.querySelector('.star-rating').classList[1]
}))
)
const converToprice = (price  =>{
    return parseFloat(price.replace('£',''))
})

const convertRating = (rating =>{
    switch(rating){
        case 'One':
            return 1;
        case 'Two':
            return 2
        case 'Three':
            return 3
        case 'Four':
            return 4
        case 'Five':
            return 5
        default:
            return 0
    }
})

const updatedData = Array.from((booksData), (book) =>({
    bookName: book.bookName,
    price : converToprice(book.price),
    imageSrc : url + book.imageSrc,
    rating : convertRating(book.rating)
}))



//console.log(updatedData)

for (const book of updatedData) {
    db.run(insertIntoBooks,[book.bookName,book.imageSrc,book.price,book.rating],(err) =>{
            if(err) return console.error(err.message);
        })
        
}


        await Promise.all([
            page.click('.pager .next a'),
            page.waitForNavigation({waitUntil: 'domcontentloaded'})
        ])
        
    }

    querry =   `SELECT * FROM books`
db.all(querry,[],(err,rows) =>{
    if(err) return console.error(err.message);
    rows.forEach(row =>{
        console.log(row)
    })
})

querry2 =   `SELECT * FROM categories`
db.all(querry2,[],(err,rows) =>{
    if(err) return console.error(err.message);
    rows.forEach(row =>{
        console.log(row)
    })
})
db.run('DROP TABLE categories')
db.run('DROP TABLE books')
    
    await browser.close()
}

main()
