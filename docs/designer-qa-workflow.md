# Designer QA Workflow: Getting a Pixel-Perfect Match

Practical advice for designers working with Claude Code to match a Figma or Framer design. Based on lessons learned from 8 rounds of visual QA on this project.

## The biggest mistake: full-page comparisons

Our first 7 QA rounds compared full-page screenshots side by side. This caught large layout issues but missed dozens of subtle differences: wrong font weights, slightly different button styles, mismatched section backgrounds, incorrect icon shapes.

**What to do instead:** Compare section by section. Take a screenshot of each individual section at the same viewport width on both the target design and your rebuild. This makes every difference obvious.

## Section-by-section QA process

### 1. Set up Playwright

```bash
npm install
npx playwright install chromium
```

### 2. Identify your sections

Break the page into logical sections. For a typical landing page:

- Navbar
- Hero
- Feature cards
- How it works / Steps
- Social proof / Testimonials
- CTA banner
- FAQ
- Footer

### 3. Screenshot each section

Write a script that scrolls to each section and takes a viewport-sized screenshot on both pages. Name them consistently:

```
framer-01-hero.png     rebuild-01-hero.png
framer-02-features.png rebuild-02-features.png
```

### 4. Compare side by side

Open each pair and note every difference. Be specific:

| Section | Difference | Fix |
|---------|-----------|-----|
| Hero | Phone button is filled, should be outlined | Change bg-dark-green to border border-primary |
| Cards | Text is bold, should be normal weight | Remove font-bold |

### 5. Fix all differences in one commit

Apply all fixes, take new screenshots, verify.

## Common differences to watch for

These are the things we missed in early rounds and only caught with section-level comparison:

### Text styling
- **Font weight**: Bold vs normal is hard to spot in small screenshots but very visible up close
- **Text color**: Subtle grays (gray-400 vs gray-500 vs gray-600) look similar at full-page zoom
- **Bold phrases**: Mid-paragraph bold text is invisible at full-page zoom level

### Buttons and CTAs
- **Filled vs outlined**: A filled teal button and an outlined teal button look similar at full page. They are very different up close.
- **Border radius**: rounded-lg vs rounded-full changes the whole feel
- **Icon presence**: Small icons inside buttons are easy to miss

### Cards and containers
- **Border vs shadow**: Both create visual separation, but the look is different
- **Background color**: White cards on a cream section vs cream cards on a white section
- **Padding and spacing**: py-4 vs py-6 is subtle but adds up

### Section backgrounds
- **Alternation pattern**: Which sections are white vs cream vs dark
- **Section ordering**: If you get one section's background wrong, all the alternation shifts

### Icons and indicators
- **Shape**: Circles vs rounded squares vs plain text
- **Fill style**: Solid filled circle vs outlined circle vs no container
- **Color**: Teal vs gold vs gray icons convey different meaning

### Footer layout
- **Column structure**: 2+2 columns vs 4 columns looks very different
- **Alignment**: Centered links vs left-aligned vs right-aligned
- **Nested elements**: Download card, Questions section inside or outside cards

## Advice for designers preparing assets

### Before you start building

1. **Export the design as a flat image** (PNG or screenshot). This is your reference.
2. **List every section** of the page with a one-line description.
3. **Document your design tokens**: colors (exact hex), fonts (name + weights used), spacing scale, max content width, border radius values.

### Asset export checklist

Export each asset individually from Figma. Never export an entire section as one SVG.

| Type | Format | Naming |
|------|--------|--------|
| Logos | SVG | `company-logo.svg` |
| Icons | SVG with `currentColor` fill | `icon-feature-name.svg` |
| Photos | PNG @2x | `hero-couple.png` |
| App badges | SVG | `app-store-badge.svg` |
| Compliance badges | SVG | `hipaa-badge.svg` |

### Common export mistakes

- **Exporting entire sections as SVG**: A 25MB full-page SVG or 360KB footer SVG cannot be used. Export individual elements.
- **Baked-in backgrounds**: White icons should have `fill="white"` or `fill="currentColor"`, not a dark background rectangle.
- **Unnamed layers**: Name your Figma layers descriptively. This makes it easier to find and export the right element.
- **Missing states**: If an FAQ has an expand/collapse icon, export both the + and X states (or describe them clearly).

### During the build

1. **Share one section at a time** with Claude Code, along with the screenshot of that section from the design.
2. **Review each section** before moving to the next. Fixing issues early is much easier than fixing them after the full page is built.
3. **Use the same viewport width** for comparison. Different viewport widths trigger responsive breakpoints and make everything look different.

### During QA

1. **Same viewport, same scroll position**: Always compare at the same width and position.
2. **Check mobile too**: Many layouts break at mobile widths even when desktop looks right.
3. **Look at spacing**: Padding differences are the most common and hardest to see in full-page screenshots.
4. **Check interactive states**: Hover effects, open/closed accordions, active tabs.

## What you can't fix with code alone

Some differences require asset exports from Figma:

- Custom illustrated icons (generic Heroicons are close but not identical)
- Brand-specific compliance badges (HIPAA, SOC 2, JCAHO)
- Custom social media icons

These are documented in [figma-export-checklist.md](figma-export-checklist.md). The page will look 95% right without them, but the last 5% requires the real assets.
