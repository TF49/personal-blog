// 从首屏 3D 场景截取静态回退图(不含文字),输出两种构图:
//   hero-landscape.webp  横屏(桌面)    hero-portrait.webp  竖屏(手机)
// 用法(依赖 puppeteer-core,装在临时目录,见 DESIGN.md 第 15 节):
//   node capture-hero.mjs http://localhost:5173 "D:\...\personal-blog\src\assets\hero"
// 竖屏构图要求视口宽度 ≥ 768,否则 HeroScene 会降级,所以用 820 宽的竖屏视口拍摄。
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import path from 'node:path'

const [, , base = 'http://localhost:5173', outDir = '.'] = process.argv
fs.mkdirSync(outDir, { recursive: true })

const shots = [
  { name: 'hero-landscape.webp', width: 1600, height: 1000, scale: 1.2 },
  { name: 'hero-portrait.webp', width: 820, height: 1458, scale: 1.4 },
]

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})

for (const s of shots) {
  const page = await browser.newPage()
  await page.setViewport({ width: s.width, height: s.height, deviceScaleFactor: s.scale })
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  // 跳过加载页
  await page.evaluateOnNewDocument(() => sessionStorage.setItem('tf49:intro-seen', '1'))
  await page.goto(base + '/', { waitUntil: 'networkidle2', timeout: 60000 })
  await page.waitForSelector('[data-hero-canvas][data-ready]', { timeout: 30000 })
  await page.addStyleTag({
    content: '[data-hero-copy], header, #skip-link { visibility: hidden !important; }',
  })
  // 等画布淡入(300ms)完成
  await new Promise((r) => setTimeout(r, 600))
  const canvas = await page.$('[data-hero-canvas]')
  const file = path.join(outDir, s.name)
  await canvas.screenshot({ path: file, type: 'webp', quality: 80 })
  console.log(`${s.name}: ${Math.round(fs.statSync(file).size / 1024)} KB`)
  await page.close()
}
await browser.close()
