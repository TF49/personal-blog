import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const [, , url, name, w = '1440', h = '900', maxShots = '12', waitMs = '9000'] = process.argv;
const out = `${process.env.TEMP}\\shots`;
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h });
const errs = [];
page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }).catch((e) => console.log('goto', e.message));

// 加载页截一张,再等它走完
await sleep(1500);
await page.screenshot({ path: `${out}\\${name}-loader.png` });
await sleep(+waitMs);
await page.mouse.move(+w / 2, +h / 2);
await page.screenshot({ path: `${out}\\${name}-00-hero.png` });

const info = await page.evaluate(() => ({
  title: document.title,
  bodyBg: getComputedStyle(document.body).backgroundColor,
  bodyColor: getComputedStyle(document.body).color,
  bodyFont: getComputedStyle(document.body).fontFamily.slice(0, 80),
  scrollH: document.documentElement.scrollHeight,
  bodyScrollH: document.body.scrollHeight,
  canvases: document.querySelectorAll('canvas').length,
  heads: [...document.querySelectorAll('h1,h2,h3')].slice(0, 12).map((e) => ({
    t: e.tagName, text: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 60),
    font: getComputedStyle(e).fontFamily.slice(0, 40), size: getComputedStyle(e).fontSize, w: getComputedStyle(e).fontWeight,
  })),
}));
console.log(JSON.stringify(info, null, 1));

let i = 1;
const step = Math.round(+h * 0.9);
let lastY = -1;
while (i < +maxShots) {
  await page.mouse.wheel({ deltaY: step });
  await sleep(2200);
  const y = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop || 0);
  if (y === lastY) { console.log('scroll stalled at', y); break; }
  lastY = y;
  await page.screenshot({ path: `${out}\\${name}-${String(i).padStart(2, '0')}.png` });
  i++;
}
console.log('shots:', i, '| last scrollY:', lastY);
if (errs.length) console.log('pageerrors:', errs.slice(0, 3).join(' | '));
await browser.close();
