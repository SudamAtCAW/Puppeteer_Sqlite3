const getAllcategories = async (url, locator) =>{
    const puppeteer = require("puppeteer");
 const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
 })
 const page = await browser.newPage();
 await page.goto(url)
 const categories = await page.$$eval(locator, (elements) =>
 elements.map((e) => ({
   categoryName: e.innerText,
   categoryLink: e.href,
 }))

);
const result = [categories, browser]
return result;
}

const  getBooksFromEachCategoryPage = async (page, booksData, categotyNameLocator, booksLocator) =>{
    const categoryName = await page.$eval(
        categotyNameLocator,
        (element) => element.innerText
      );
      const allBooks = await page.$$eval(booksLocator, (elements) =>
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
        await getBooksFromEachCategoryPage(page, booksData, categotyNameLocator, booksLocator);
      }
}

// async function getBooksFromEachCategoryPage(page, booksData, categotyNameLocator, booksLocator) {
 
//   }


const getAllBooks = async (result) =>{
    const browser = result[1]
    const categories = result[0]
    const booksData = [];
    const categoryUrls = [];
    const categoryNames = [];
    for (const category of categories) {
        categoryUrls.push(category.categoryLink);
        categoryNames.push(category.categoryName);
      }
      for (const categoryUrl of categoryUrls) {
        const page = await browser.newPage();
        await page.goto(categoryUrl);
        await getBooksFromEachCategoryPage(page, booksData,".page-header h1",".product_pod");
        await page.close();
      }
      const allData = [categoryNames, booksData]
    await browser.close()
    return allData;
}




const executeAll = () =>{
   getAllcategories("https://books.toscrape.com/",".nav ul li a").then((result) =>{
        getAllBooks(result).then((allData) =>{
            const categories = allData[0]
            const booksWithCategories = allData[1]
            console.log(categories)
            console.log(booksWithCategories)
        })
    })
}

module.exports = executeAll;
