# Figma Export Checklist

This document lists every asset a designer needs to export from Figma so Claude Code can produce an exact match of the design. Each item includes what to export, the recommended format, and where to place it in the repo.

## How to export from Figma

1. Select the element in Figma
2. In the right panel under "Export", click "+"
3. Choose format (SVG for logos/icons, PNG @2x for photos)
4. Click "Export [element name]"
5. Rename the file using the naming convention below
6. Place it in `assets/images/`

## Naming convention

Use lowercase, hyphenated, descriptive names:

```
good:  clover-health-logo.svg, hero-couple.png, hipaa-badge.svg
bad:   32yEQtzFN2eAP3GfY0EV7fztsfI.png, Untitled.svg, image (1).png
```

## Assets already exported

These assets are in the repo and working:

| Asset | File | Status |
|---|---|---|
| HealthTap logo (white wordmark) | `healthtap-logo.svg` | Done |
| Clover Health logo (white text) | `clover-health-logo.svg` | Done |
| App Store badge | `app-store-badge.svg` | Done |
| Google Play badge | `google-play-badge.svg` | Done |
| Hero couple photo | `hero-couple.png` | Done |
| Isaac Weaver staff photo | `isaac-weaver.png` | Done |
| Testimonial woman photo | `testimonial-woman.png` | Done |
| Testimonial man photo | `testimonial-man.png` | Done |
| HealthTap app icon | `healthtap-app-icon.png` | Done |
| QR code | `qr-code.png` | Done |
| Favicon | `favicon.svg` | Done |

## Assets still needed

Export these from Figma to close the remaining visual gaps.

### 1. Compliance/trust badges (footer)

The footer in the Figma design shows three compliance badges below the HealthTap logo. These are the last major visual difference between our rebuild and the original.

| Badge | Export as | Save as |
|---|---|---|
| HIPAA Secure badge | SVG | `assets/images/hipaa-badge.svg` |
| SOC 2 Type II badge | SVG | `assets/images/soc2-badge.svg` |
| JCAHO Gold Seal badge | SVG | `assets/images/jcaho-badge.svg` |

**How to find them in Figma:** Scroll to the footer section. The badges are in the left column, below the HealthTap logo. Select each badge individually and export as SVG.

**Where they go in the page:** Below the HealthTap logo in the footer's first column (`page.html` line ~469). Claude Code will add them as a row of small images:

```html
<div class="flex items-center gap-3 mt-4">
  <img src="assets/images/hipaa-badge.svg" alt="HIPAA Secure" class="h-10">
  <img src="assets/images/soc2-badge.svg" alt="SOC 2 Type II" class="h-10">
  <img src="assets/images/jcaho-badge.svg" alt="JCAHO Gold Seal" class="h-10">
</div>
```

### 2. Section icons (optional, for pixel-perfect match)

The current page uses generic Heroicons as stand-ins for the custom icons in the Figma design. These are close enough for most purposes, but if you want an exact match, export the following:

#### "What is a LiveHealthy Visit?" section (3 icons)

| Icon | Description | Save as |
|---|---|---|
| Health review icon | Clipboard/checklist icon | `assets/images/icon-health-review.svg` |
| Medications icon | Pill bottle/prescription icon | `assets/images/icon-medications.svg` |
| Lab work icon | Document/referral icon | `assets/images/icon-lab-work.svg` |

**How to find:** In the "What is a LiveHealthy Visit?" section, each of the three cards has a circular icon above the text.

#### "Trusted care from real doctors" section (4 icons)

| Icon | Description | Save as |
|---|---|---|
| Board-certified icon | Shield/checkmark icon | `assets/images/icon-board-certified.svg` |
| Same-day icon | Calendar icon | `assets/images/icon-same-day.svg` |
| Private/secure icon | Lock icon | `assets/images/icon-private-secure.svg` |
| Compassionate icon | Heart icon | `assets/images/icon-compassionate.svg` |

**How to find:** In the "Trusted care from real doctors" section, each of the four feature cards has an icon to the left of the text.

#### Hero trust badges (3 small icons)

| Icon | Description | Save as |
|---|---|---|
| HIPAA badge icon | Lock/shield icon in hero trust badges | `assets/images/icon-trust-hipaa.svg` |
| Board-certified icon | Shield icon in hero trust badges | `assets/images/icon-trust-certified.svg` |
| 5-star icon | Star icon in hero trust badges | `assets/images/icon-trust-stars.svg` |

**How to find:** Below the hero CTA buttons, there are three small pill-shaped trust badges. Each has a small icon on the left.

### 3. Social media icons (optional)

The footer has LinkedIn and X/Twitter icons. We use standard SVG paths that look correct, but if the Figma design uses custom styled versions:

| Icon | Save as |
|---|---|
| LinkedIn icon | `assets/images/icon-linkedin.svg` |
| X/Twitter icon | `assets/images/icon-x-twitter.svg` |

## Export tips

- **SVG is preferred** for all logos, icons, and badges. It scales perfectly and keeps file sizes small.
- **PNG @2x** for photographs (hero image, staff photo, testimonial avatars). Export at 2x for retina screens.
- **Flatten complex icons** before exporting. In Figma: select the icon, right-click, "Flatten". This avoids nested groups and clip paths that bloat the SVG.
- **Export individual elements**, not entire sections. A full-page or full-section SVG export (like `Untitled.svg` at 25MB or `768-1023.svg` at 360KB) cannot be used. Claude Code needs individual, named assets.
- **Check the background.** If an icon is white-on-dark in Figma, make sure the SVG has `fill="white"` (not a dark background baked in). For icons used on light backgrounds, they should have `fill="currentColor"` or the appropriate color.

## After adding assets

Once you've exported and placed the files in `assets/images/`, tell Claude Code:

```
I added the following assets to assets/images/:
- hipaa-badge.svg
- soc2-badge.svg
- jcaho-badge.svg

Update page.html to use them.
```

Claude Code will update the HTML references and you can preview the result.
