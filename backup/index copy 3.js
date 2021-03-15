const fs = require('fs');
const puppeteer = require('puppeteer');



(async () => {
  
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 1200, height: 720});
  await page.goto('https://br.pinterest.com/login/', { waitUntil: 'networkidle0' }); // wait until page load
  await page.type('#email', 'matheus.antonio208@gmail.com');
  await page.type('#password', 'Geniodanet1!');
  
  // click and wait for navigation
  await Promise.all([
    page.click('.SignupButton'),
    page.waitForNavigation()
  ])
  await page.goto('https://br.pinterest.com/matheusantoni0/profissional-artesanato/',{timeout: 0, waitUntil: 'domcontentloaded'});
  await page.waitForTimeout(5000);

  await autoScroll(page);

  const images = await downloadImage(page);

  fs.writeFile('images.json', JSON.stringify(images,null, 2), err => {
    if(err) throw new Error('Wrong!');
    console.log("Download Complete");
  })
})();

async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });}

  async function downloadImage(page){
    await page.evaluate(() => {
      const nodeList = document.querySelectorAll('[src^="https://i.pinimg.com/"]');
      const imageArray = [...nodeList];
      const imageList = imageArray.map( ({src}) => ({
        src
      }))
  
      return imageList;
    })
  }