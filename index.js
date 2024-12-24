const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

// import puppeteer from 'puppeteer';
import puppeteer from 'puppeteer-core';

// http://localhost:9222/json/version
const browser = await puppeteer.connect({
  browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/22dc630e-3719-435f-b693-1db26f6704c1'
})
const page = await browser.newPage();

await page.setViewport({ width: 1536, height: 700 });
// await page.authenticate({username:'3b83e61fee48955d', password:'RNW78Fm5'});
await page.goto('https://bc.game/game/crash?type=trenball', {        //https://bc.game/game/crash?type=trenball
  waitUntil: 'networkidle2',
  timeout: 900000
});
console.log("connected and started!")

let sel_text = "Bet Red"
let b_amt = "0.01"
let start = Date.now();
let b_cnts = 0;
let b_status = true;
while (1) {
  const now = Date.now();
  if (b_status && now - start > 120000) {
    b_amt = "0.0001"
    b_cnts = 0;
    b_status = false;
  }
  if(!b_status && b_cnts == 5) {
    b_amt = "0.01";
    b_cnts = 0;
    b_status = true;
  }

  try {
    let playerSelector = await page.waitForSelector(
      `text/Player`,
    );
    await playerSelector.click()
    await sleep(500);
    let textSelector = await page.waitForSelector(
      `text/${sel_text}`,
    );
    if (textSelector) {
      if(b_cnts == 0) start = Date.now();
      await page.locator('input').fill(b_amt);
      await textSelector.click()
      b_cnts += 1;
      console.log("trying --> ", b_status, b_cnts, b_amt)
    }
  } catch(e) {
    console.log("not found!")
  }
}


console.log("End!")


// await browser.close();