/*
https://br.pinterest.com/matheusantoni0/profissional-artesanato/in-queue/
*/
var request = require('request'), fs = require('fs');
var crypto = require('crypto');

const puppeteer = require('puppeteer');

const email = 'matheus.antonio208@gmail.com';
const password = 'Geniodanet1!';
const linkBoardToDownload = 'https://br.pinterest.com/matheusantoni0/profissional-artesanato/in-queue/';

async function startWithLogin(page) {
  await page.setViewport({width: 1080, height: 10000});
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://br.pinterest.com/login/', { waitUntil: 'networkidle0' });
  await page.type('#email', email);
  await page.type('#password', password);

  await Promise.all([
    page.click('.SignupButton'),
    page.waitForNavigation()
  ])
}

(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  
  await startWithLogin(page);
  
  await Promise.all([
    page.goto(linkBoardToDownload,{timeout: 0, waitUntil: 'domcontentloaded'}),
    page.waitForNavigation({waitUntil: 'networkidle2'})
  ])

  const imageList = await page.evaluate(() => {
    const nodeList = document.querySelectorAll('[src^="https://i.pinimg.com/"]');
    const imageArray = [...nodeList];
    const img = imageArray.map( ({src}) => ({ src }));

    return img;
  });

  imageList.forEach((img) => {

    function downloadWebp(){
      const urlImg = 'https://i.pinimg.com/originals/' + img.src.substring(26,img.src.lastIndexOf('.')) + '.webp';
      console.log({src: img.src});
      console.log({urlImg});
      request({
        url : urlImg,
        encoding : null
    }, function(error, response, body) {
        const name = img.src.substring(35,img.src.lastIndexOf('.'));
        fs.writeFile('image downloads/' + name + '.png', body, {
            encoding : null
        }, function(err) {
    
            if (err)
                throw err;
            console.log(name +'.png ' + 'It\'s saved!');
        });
      })
    }

    function downloadPng() {
      const urlImg = 'https://i.pinimg.com/originals/' + img.src.substring(26,img.src.lastIndexOf('.')) + '.png';
      console.log({src: img.src});
      console.log({urlImg});
      request({
        url : urlImg,
        encoding : null
    }, function(error, response, body) {
      if(response.statusCode === 403) {
        downloadWebp();
      }
        const name = img.src.substring(35,img.src.lastIndexOf('.'));
        fs.writeFile('image downloads/' + name + '.png', body, {
            encoding : null
        }, function(err) {
    
            if (err)
                throw err;
            console.log(name +'.png ' + 'It\'s saved!');
        });
      })
    }

    const downloadJpeg = () => {
      const urlImg = 'https://i.pinimg.com/originals/' + img.src.substring(26,img.src.lastIndexOf('.')) + '.jpg';
      request({
        url : urlImg,
        encoding : null
    }, function(error, response, body) {
      if(response.statusCode === 403) {
        downloadPng();
      }
        const name = img.src.substring(35,img.src.lastIndexOf('.'));
        fs.writeFile('image downloads/' + name + '.png', body, {
            encoding : null
        }, function(err) {
    
            if (err)
                throw err;
            console.log(name +'.png ' + 'It\'s saved!');
        });
    })
    }

    downloadJpeg();
    browser.close();
});
})();

