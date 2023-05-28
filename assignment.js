const puppeteer = require("puppeteer");

async function getAllcategories(locator, url) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });
  const page = await browser.newPage();
  await page.goto(url);

  const categoryNames = await page.$$eval(locator, (elements) =>
    elements.map((e) => e.innerText)
  );
  const categoryLinks = await page.$$(locator);
  const categoryUrls = [];
  for (const link of categoryLinks) {
    const categoryUrl = await link.evaluate((el) => el.href);
    categoryUrls.push(categoryUrl);
  }
  // console.log(categoryUrls)
  // console.log(categoryNames)

  await browser.close();
  return categoryUrls;
}

async function getBooksFromEachCategoryPage(page,booksData){
  const categoryName = await page.$eval(
    ".page-header h1",
    (element) => element.innerText
  );
  const allBooks = await page.$$eval(".product_pod",(elements) => elements.map( e =>({
    bookName : e.querySelector('h3 a').getAttribute('title'),
    price : e.querySelector('.price_color').innerText,
    imageSrc : e.querySelector('img').getAttribute('src'),
    rating : e.querySelector('.star-rating').classList[1],
  })));
  booksData.push({categoryName,allBooks });
  const nextButton = await page.$(".next a");
  if (nextButton) {
    await Promise.all([page.waitForNavigation(), nextButton.click()]);
    await getBooksFromEachCategoryPage(page,booksData)
  }
}

async function getAllBooks(categoryLinks) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });
  
  const booksData = [];
  for (const category of categoryLinks) {
    const page = await browser.newPage();
    await page.goto(category);
    await getBooksFromEachCategoryPage(page,booksData)
    await page.close()
  //console.log(categoryName)
  }
  await browser.close();
  return booksData;
}



getAllcategories(".nav ul li a", "https://books.toscrape.com/").then(
  (categoryLinks) => {
    getAllBooks(categoryLinks).then((booksData) => {
      for (const book of booksData){
        console.log(book)
      }
    });
  }
);

