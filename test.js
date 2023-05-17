const puppeteer = require('puppeteer')
const url = 'https://books.toscrape.com/'



const main = async () =>{
    const browser = await puppeteer.launch({
        headless : false,
        defaultViewport : { 'width' : 1920, 'height' : 1080 }
    })
    const page = await browser.newPage()
    await page.setViewport( { 'width' : 1920, 'height' : 1080 } );
    await page.goto(url)
    const hrefElement = await page.$('div .side_categories .nav ul li a');
    await hrefElement.click();

     


 await browser.close()
}

main()
