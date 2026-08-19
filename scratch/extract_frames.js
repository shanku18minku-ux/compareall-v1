const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const html = `<video id="v" src="file:///C:/Users/HP/.gemini/antigravity/brain/a70a8866-702e-460b-974d-8a9d0be87042/vid11.mp4" controls autoplay></video>`;
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 1000));
    const duration = await page.evaluate(() => document.getElementById('v').duration);
    console.log('Video duration:', duration);
    
    for (let i = 0; i < duration; i += 3) {
        await page.evaluate((time) => {
            document.getElementById('v').currentTime = time;
        }, i);
        await new Promise(r => setTimeout(r, 500));
        await page.screenshot({path: `scratch/vid11_frames/frame_${i}.png`});
    }
    await browser.close();
    console.log('Done extracting frames');
})();
