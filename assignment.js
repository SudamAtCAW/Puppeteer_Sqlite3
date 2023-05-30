const puppeteer = require("puppeteer");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});
let createCategoriesTable = `CREATE TABLE if not exists categories(category_id INTEGER PRIMARY KEY, category_name)`;
let insertIntoCategories = `INSERT INTO categories(category_name) VALUES (?) `;
let createBooksTable = `CREATE TABLE if not exists books(book_id INTEGER PRIMARY KEY, book_name, category, image_url, book_price INTEGER, book_rating INTEGER)`;
let insertIntoBooks = `INSERT INTO books(book_name, category, image_url, book_price, book_rating) VALUES (?, ?, ?, ?, ?)`;
db.run(createCategoriesTable);
db.run(createBooksTable);

async function launchBrowser() {
  return await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });
}

async function getAllcategories(locator, url) {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.goto(url);
  //const categories =[]
  const categories = await page.$$eval(locator, (elements) =>
    elements.map((e) => ({
      categoryName: e.innerText,
      categoryLink: e.href,
    }))
  );

  await browser.close();
  return categories;
}

async function getBooksFromEachCategoryPage(page, booksData) {
  const categoryName = await page.$eval(
    ".page-header h1",
    (element) => element.innerText
  );
  const allBooks = await page.$$eval(".product_pod", (elements) =>
    elements.map((e) => ({
      bookName: e.querySelector("h3 a").getAttribute("title"),
      price: e.querySelector(".price_color").innerText,
      imageSrc: e.querySelector("img").getAttribute("src"),
      rating: e.querySelector(".star-rating").classList[1],
    }))
  );
  booksData.push({ categoryName, allBooks });
  const nextButton = await page.$(".next a");
  if (nextButton) {
    await Promise.all([page.waitForNavigation(), nextButton.click()]);
    await getBooksFromEachCategoryPage(page, booksData);
  }
}

async function getAllBooks(categoryLinks) {
  const browser = await launchBrowser();
  const booksData = [];
  for (const category of categoryLinks) {
    const page = await browser.newPage();
    await page.goto(category);
    await getBooksFromEachCategoryPage(page, booksData);
    await page.close();
  }
  await browser.close();
  return booksData;
}

async function addCategoryInsideBook(booksData) {
  const allBooks = [];
  for (const books of booksData) {
    const category = books.categoryName;
    for (const book of books.allBooks) {
      book["category"] = category;
    }
  }
  for (const books of booksData) {
    for (const book of books.allBooks) {
      allBooks.push(book);
    }
  }
  return allBooks;
}

getAllcategories(".nav ul li a", "https://books.toscrape.com/").then(
  (categories) => {
    const categoryUrls = [];
    const categoryNames = [];
    for (const category of categories) {
      categoryUrls.push(category.categoryLink);
      categoryNames.push(category.categoryName);
    }
    for (const category of categoryNames) {
      db.run(insertIntoCategories, [category], (err) => {
        if (err) return console.error(err.message);
      });
    }

    getAllBooks(categoryUrls).then((booksData) => {
      addCategoryInsideBook(booksData).then((allBooks) => {
        const converToprice = (price) => {
          return parseFloat(price.replace("£", ""));
        };

        const convertRating = (rating) => {
          switch (rating) {
            case "One":
              return 1;
            case "Two":
              return 2;
            case "Three":
              return 3;
            case "Four":
              return 4;
            case "Five":
              return 5;
            default:
              return 0;
          }
        };
        const url = "https://books.toscrape.com/";

        const upadtedBooksData = Array.from(allBooks, (book) => ({
          bookName: book.bookName,
          category: book.category,
          price: converToprice(book.price),
          imageSrc: url + book.imageSrc,
          rating: convertRating(book.rating),
        }));

        for (const book of upadtedBooksData) {
          db.run(
            insertIntoBooks,
            [
              book.bookName,
              book.category,
              book.imageSrc,
              book.price,
              book.rating,
            ],
            (err) => {
              if (err) return console.error(err.message);
            }
          );
        }
      });
    });
  }
);
