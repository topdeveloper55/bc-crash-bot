const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
const BET_AMT = "0.2"

// import puppeteer from 'puppeteer';
import puppeteer from 'puppeteer-core';

// http://localhost:9222/json/version
const browser = await puppeteer.connect({
  browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/62742ab0-8673-4f0a-b757-162c880546df'
})
const page = await browser.newPage();

await page.setViewport({ width: 1536, height: 700 });
// await page.authenticate({username:'3b83e61fee48955d', password:'RNW78Fm5'});
await page.goto('https://bc.game/game/crash?type=trenball', {        //https://bc.game/game/crash?type=trenball
  waitUntil: 'networkidle2',
  timeout: 900000
});
console.log("connected and started!")
const buttons = await page.$$(".trenball-btn")

// change this status for right timing
let b_status = true;
let sel_text = "Bet Red"

let b_amt = BET_AMT
let start = Date.now();
let b_cnts = 0;
while (1) {
  try {
    let playerSelector = await page.waitForSelector(
      `text/Player`,
    );
    await playerSelector.click()
    let textSelector = await page.waitForSelector(
      `text/${sel_text}`,
    );
    if (textSelector) {
      await page.locator('input').fill(b_amt);

      // change part
      let now = Date.now();
      if (start && b_status && now - start > 21000) {
        b_amt = BET_AMT
        sel_text = "Bet Green"
        b_cnts = 0;
        b_status = false;
        console.log("triggered Green")
        continue;
      }
      if (!b_status && b_cnts == 2) {
        b_amt = BET_AMT;
        sel_text = "Bet Red"
        b_cnts = 0;
        b_status = true;
        start = 0;
        console.log("triggered Red")
        continue;
      }
      
      if(b_status) await buttons[1].click()
      else await buttons[2].click()
      // await textSelector.click()
      if (b_cnts == 0) start = Date.now();
      b_cnts += 1;
      console.log("trying --> ", sel_text, b_amt, b_cnts)
    }
    // await sleep(500)
  } catch (e) {
    console.log("not found!")
  }
}


console.log("End!")


// await browser.close();