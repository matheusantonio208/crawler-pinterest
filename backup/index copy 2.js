const puppeteer = require('puppeteer');



(async () => {
  
  const browser = await puppeteer.launch({headless: false,  args: [ '--proxy-server=http://10.10.10.10:8000' ]});
  const page = await browser.newPage();
  await page.setViewport({width: 1200, height: 720});
  await page.goto('https://br.pinterest.com/login/', { waitUntil: 'networkidle0' }); // wait until page load
  await page.type('#email', 'matheus.antonio208@gmail.com');
  await page.type('#password', 'Geniodanet1!');

  // click and wait for navigation
  await Promise.all([
    page.click('.SignupButton'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);

  await Promise.all([
    page.click('div a.GestaltTouchableFocus'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);
  
  /*
  await page.evaluate(() => {
    const nodeList = document.querySelectorAll('div img');
    const imageArray = [...nodeList];
    const list = imageArray.map( ({src}) => ({
      src
    }))

    console.log(list);
  })
  */
})();