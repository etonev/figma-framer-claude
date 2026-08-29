# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A reference project demonstrating how to build web pages from Figma designs using Claude Code. Contains a Framer export example (`index.html`) showing what NOT to do, and a guide (`figma-to-code-with-claude.md`) documenting the recommended workflow.

Fork of `etonev/figma-framer-claude`.

## Repository Structure

- `page.html` - Clean Tailwind CSS rebuild. The main file to edit.
- `index.html` - Framer-exported page (429KB, monolithic). Used as a "before" example. Do not edit.
- `assets/images/` - All images with descriptive filenames.
- `assets/fonts/` - Gilroy Bold woff2 font.
- `docs/` - Guides, session log, and export checklist.

## Development Setup

This is a static HTML project. To preview, open `page.html` in a browser.

### Visual QA with Playwright

When working on UI improvements, use Playwright to take screenshots and compare against the Framer original.

```bash
npm install
npx playwright install chromium
```

Then take screenshots for comparison:

```bash
npx playwright screenshot --viewport-size=1440,900 --full-page page.html screenshots/rebuild-desktop.png
npx playwright screenshot --viewport-size=1440,900 --full-page https://intelligent-gecko-264478.framer.app/ screenshots/framer-desktop.png
```

Mobile viewport:

```bash
npx playwright screenshot --viewport-size=375,812 --full-page page.html screenshots/rebuild-mobile.png
npx playwright screenshot --viewport-size=375,812 --full-page https://intelligent-gecko-264478.framer.app/ screenshots/framer-mobile.png
```

See [docs/playwright-guide.md](docs/playwright-guide.md) for advanced usage (scroll-position screenshots, cross-browser testing, interactive elements).

## Design Reference

The page being rebuilt is a HealthTap/Clover Health landing page with these design tokens:

- **Colors:** Primary green `#0C847A`, dark green `#1B4332`, cream `#FFF8F0`
- **Fonts:** Gilroy Bold (headings), Noto Sans (body)
- **Max content width:** 1200px

## When Rebuilding the Page

Follow the approach in `figma-to-code-with-claude.md`: separate HTML from CSS, use descriptive asset filenames, build section by section, and use semantic HTML.
