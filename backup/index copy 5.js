const fs = require('fs');
const puppeteer = require('puppeteer');

const email = 'matheus.antonio208@gmail.com';
const password = 'Geniodanet1!';
const linkBoardToDownload = 'https://br.pinterest.com/matheusantoni0/corpo/';

let images = [];

async function startWithLogin(page) {
  await page.setViewport({width: 1080, height: 1920});
  await page.goto('https://br.pinterest.com/login/', { waitUntil: 'networkidle0' });
  await page.type('#email', email);
  await page.type('#password', password);

  await Promise.all([
    page.click('.SignupButton'),
    page.waitForNavigation()
  ])
}

async function scrollPage(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var currentHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              currentHeight += distance;

              if(currentHeight >= scrollHeight){
                clearInterval(timer);
                resolve();
                return false;
              }
          }, 100);
      });
});}

async function getImagePage(page) {
    const images = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('[src^="https://i.pinimg.com/"]');
      const imageArray = [...nodeList];
      const imageList = imageArray.map( ({src}) => ({
        src
      }))
      return imageList;
    })

    console.log(images);
    return images;
}

function writePathImagesInJson(images) {
  fs.writeFile('images.json', JSON.stringify(images,null, 2), err => {
    if(err) throw new Error('Wrong!');

    console.log("Download Complete");
  })
}
  
(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  
  await startWithLogin(page);
  
  await page.goto(linkBoardToDownload,{timeout: 0, waitUntil: 'domcontentloaded'});
  await page.waitForTimeout(5000);

  const imageList = await page.evaluate(() => {
    const nodeList = document.querySelectorAll('[src^="https://i.pinimg.com/"]');
    const imageArray = [...nodeList];
    const img = imageArray.map( ({src}) => ({
      src
    }))

    return img;
  });

  console.log({imageList});
  console.log({images})
  writePathImagesInJson(images);
})();

