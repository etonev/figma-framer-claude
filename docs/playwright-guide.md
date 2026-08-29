# Using Playwright with Claude Code for Visual QA

Playwright is a browser automation tool. In this project we used it to take screenshots of our deployed page and compare against the Figma design. But it can do much more.

## Setup

Playwright comes as an npm package. No project-level install needed, just use `npx`:

```bash
# Install browser (one-time)
npx playwright install chromium
```

That's it. No package.json required.

## How We Used It in This Project

### Taking full-page screenshots

```bash
# Desktop viewport (1440x900)
npx playwright screenshot --full-page --viewport-size="1440,900" \
  "https://your-site.github.io/page.html" screenshots/desktop.png

# Mobile viewport (375x812, iPhone-sized)
npx playwright screenshot --full-page --viewport-size="375,812" \
  "https://your-site.github.io/page.html" screenshots/mobile.png
```

Claude Code can read the resulting PNG files and compare them against the Figma design, identifying visual differences section by section.

### The QA loop

1. Deploy the page (GitHub Pages, local server, etc.)
2. Take a Playwright screenshot
3. Share the screenshot with Claude Code alongside the Figma design
4. Claude Code identifies differences (missing images, wrong spacing, color mismatches)
5. Fix the issues, redeploy, repeat

This is how we caught that the "Earn rewards" card needed a dark green background and the testimonials needed avatar photos.

## Other Scenarios Where Playwright Is Useful

### 1. Responsive testing across breakpoints

Take screenshots at multiple viewport sizes to verify responsive behavior:

```bash
for size in "375,812" "768,1024" "1024,768" "1440,900" "1920,1080"; do
  name=$(echo $size | tr ',' 'x')
  npx playwright screenshot --full-page --viewport-size="$size" \
    "http://localhost:3000" "screenshots/responsive-${name}.png"
done
```

Claude Code can review all screenshots and flag layout issues at specific breakpoints.

### 2. Visual regression testing

Take "before" and "after" screenshots when making changes:

```bash
# Before changes
npx playwright screenshot --full-page --viewport-size="1440,900" \
  "https://your-site.com" screenshots/before.png

# After changes
npx playwright screenshot --full-page --viewport-size="1440,900" \
  "https://your-site.com" screenshots/after.png
```

Ask Claude Code: "Compare these two screenshots and tell me what changed."

### 3. Cross-browser testing

Playwright supports Chromium, Firefox, and WebKit (Safari):

```bash
npx playwright install  # installs all browsers

npx playwright screenshot --browser=chromium --full-page \
  "https://your-site.com" screenshots/chromium.png

npx playwright screenshot --browser=firefox --full-page \
  "https://your-site.com" screenshots/firefox.png

npx playwright screenshot --browser=webkit --full-page \
  "https://your-site.com" screenshots/webkit.png
```

### 4. Testing interactive elements

Write a short script to test interactions like accordions, modals, or hover states:

```javascript
// test-faq.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://your-site.com/page.html');

  // Screenshot with FAQ closed
  await page.screenshot({ path: 'screenshots/faq-closed.png', fullPage: true });

  // Click first FAQ question
  await page.click('details:first-of-type summary');
  await page.waitForTimeout(300);

  // Screenshot with FAQ open
  await page.screenshot({ path: 'screenshots/faq-open.png', fullPage: true });

  await browser.close();
})();
```

Run with:

```bash
node test-faq.js
```

### 5. Performance and loading states

Capture the page with network throttling to see how it loads on slow connections:

```javascript
// test-slow-network.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Simulate slow 3G
  const client = await context.newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 500 * 1024 / 8,  // 500 kbps
    uploadThroughput: 500 * 1024 / 8,
    latency: 400,
  });

  await page.goto('https://your-site.com', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshots/slow-network.png', fullPage: true });

  await browser.close();
})();
```

### 6. Checking broken images and links

```javascript
// check-resources.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const failedResources = [];
  page.on('requestfailed', request => {
    failedResources.push({ url: request.url(), error: request.failure().errorText });
  });

  await page.goto('https://your-site.com/page.html', { waitUntil: 'networkidle' });

  if (failedResources.length > 0) {
    console.log('Failed resources:');
    failedResources.forEach(r => console.log(`  ${r.url} - ${r.error}`));
  } else {
    console.log('All resources loaded successfully.');
  }

  await browser.close();
})();
```

### 7. Generating PDFs

```bash
npx playwright pdf "https://your-site.com/page.html" output.pdf
```

Useful for sharing designs with stakeholders who don't want to open a URL.

## Tips

- **Local files work too.** Use `file:///path/to/page.html` instead of a URL for faster iteration without deploying.
- **Claude Code reads PNGs natively.** Just take the screenshot and ask Claude Code to read the file. No extra tools needed.
- **Combine with `gh` CLI.** Take screenshots in CI and attach them to PR comments for visual review.
- **No `npm install` needed.** `npx playwright` works without a project-level installation. Just need the one-time browser install.
