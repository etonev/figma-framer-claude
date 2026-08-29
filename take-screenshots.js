const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const offsets = [0, 500, 900, 1300, 1700, 2100, 2500, 2900, 3300, 3700, 4100, 4500];

  for (const [name, url] of [['framer', 'https://intelligent-gecko-264478.framer.app/'], ['rebuild', 'https://asivura.github.io/figma-framer-claude/page.html']]) {
    const page = await context.newPage();
    console.log(`Loading ${name}: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    for (const offset of offsets) {
      await page.evaluate(y => window.scrollTo(0, y), offset);
      await page.waitForTimeout(500);
      const path = `screenshots/desktop/${name}-desktop-${offset}.png`;
      await page.screenshot({ path });
      console.log(`  Saved ${path}`);
    }
    await page.close();
  }
  await browser.close();
  console.log('Done.');
})();
