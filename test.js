const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });
  const page = await browser.newPage();
  const url = "https://books.toscrape.com/";

  await page.goto(url);

  const categoryLinks = await page.$$("div .side_categories .nav ul li a");
  const categoryUrls = [];
  for (const link of categoryLinks) {
    const categoryUrl = await link.evaluate((el) => el.href);
    categoryUrls.push(categoryUrl);
  }

  for (const categoryUrl of categoryUrls) {
    await page.goto(categoryUrl);
    console.log(categoryUrl)
    // Perform any actions or capture data on the category page if needed
    //await page.goBack(); // Go back to the original page
  }

 // await browser.close();
})();
