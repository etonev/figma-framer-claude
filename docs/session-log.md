# Session Log: Rebuilding a Framer Page with Claude Code

This documents every step taken during the session, start to finish. It serves as a walkthrough showing how a designer can use Claude Code to build a production landing page from a Figma design.

## Starting point

A product designer exported a page from Framer and tried to use Claude Code to modify it. It didn't work because:

- The export was a 429KB monolithic HTML file (841 lines)
- All SVGs (App Store badges, Google Play, social icons) were inlined as raw path data
- Asset filenames were cryptic hashes (`32yEQtzFN2eAP3GfY0EV7fztsfI.png`)
- Multiple scattered `<style>` blocks, no component structure
- Claude Code couldn't even read the full file in one pass

## Step 1: Diagnose the problem

Analyzed the Framer export to identify why it was hostile to AI editing. Examined file size, structure, inline SVGs, scattered styles, and cryptic filenames.

## Step 2: Write the guide

Created `figma-to-code-with-claude.md` with actionable advice:

- Why Framer exports fail
- The screenshot-first workflow
- Section-by-section iteration strategy
- Asset naming conventions
- Design tokens approach
- Quick-start prompt template

## Step 3: Choose CSS approach

Evaluated plain CSS vs Tailwind CSS. Chose Tailwind for this project because:

- One file to manage (styles live on HTML elements)
- Claude Code produces accurate Tailwind output
- Zero build step (CDN script tag)
- Design tokens configurable in one place
- Responsive breakpoints are intuitive

Documented reasoning in `why-tailwind.md`.

## Step 4: Extract content from the Framer export

Used a subagent to read the 841-line HTML file in chunks and extract all text content organized by section: headings, paragraphs, button labels, FAQ Q&As, testimonials, footer links, phone numbers, legal disclaimers.

## Step 5: Identify the design from Figma

The user shared:
- A full-page screenshot of the Figma design
- The Figma file URL: `https://www.figma.com/design/YkmnztEbHm01QcGirgkAW0/Untitled?node-id=0-303`
- The live Framer site: `https://intelligent-gecko-264478.framer.app/`

From the screenshot, identified 10 distinct sections:
1. Navbar (dark green, dual logos, phone + CTA)
2. Hero (headline, description, CTAs, couple photo, trust badges)
3. "What is a LiveHealthy Visit?" (3 icon cards)
4. "Earn $150 Rewards" (3-step process cards)
5. "Not sure about tech?" (staff photo + support info)
6. "Trusted care from real doctors" (4-feature grid)
7. Testimonials (star ratings, 2 member quotes with avatars)
8. Schedule CTA banner (dark green)
9. Common Questions (FAQ accordion, 10 items)
10. Footer (multi-column links, app badges, social icons, legal)

## Step 6: Build the full page

Created `page.html` with all 10 sections in a single pass, using:

- Tailwind CSS via CDN with custom config for design tokens
- Gilroy Bold font (from assets) + Noto Sans (Google Fonts)
- Custom colors: primary `#0C847A`, dark green `#1B4332`, cream `#FFF8F0`, gold `#C4922A`
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`, `<details>`
- Native `<details>/<summary>` for FAQ accordion (no JavaScript needed)
- Responsive grid layouts with Tailwind breakpoints

## Step 7: Set up branch and version control

- Created branch `docs/figma-to-code-guide` from main
- First commit: the guide document
- Second commit: page.html + CLAUDE.md + why-tailwind.md
- Pushed to origin for GitHub Pages deployment

## Step 8: Deploy to GitHub Pages

Enabled GitHub Pages via `gh api` pointing to the `docs/figma-to-code-guide` branch. The page went live at:

- Our rebuild: https://asivura.github.io/figma-framer-claude/page.html
- Original Framer export: https://asivura.github.io/figma-framer-claude/index.html

## Step 9: Visual QA with Playwright

Installed Playwright and took full-page screenshots of:
- Our page at desktop (1440x900) and mobile (375x812) viewports
- The live Framer original for comparison

First round of screenshots revealed all images were broken because we used descriptive filenames that didn't match the actual asset files.

## Step 10: Identify and rename assets

Opened each cryptic image file to identify its content:

| Hash filename | Content | New name |
|---|---|---|
| `32yEQtzFN2eAP3GfY0EV7fztsfI.png` | Elderly couple on couch | `hero-couple.png` |
| `51wT7lXn8kGfjdURvdPMsc9TKBs.png` | Elderly woman portrait | `testimonial-woman.png` |
| `cvooq4lbXtBxlurDToeYAfu7VJ0.png` | Isaac Weaver (HealthTap staff) | `isaac-weaver.png` |
| `xB7Ll8KOzkE1Kcm3zkDzlGLt5w.png` | Elderly man portrait | `testimonial-man.png` |
| `a2rv0CcxjZMAHU7DaNgQ9rhc4.png` | HealthTap app icon | `healthtap-app-icon.png` |
| `cd1BlyS1PwT8LKjfV8JxsFed1A.svg` | HealthTap cross favicon | `favicon.svg` |
| `OYCpJpkl187FuBl4zBfhUJrQ5Jg.png` | QR code | `qr-code.png` |

Copied files with descriptive names (kept originals for the Framer export to still work).

## Step 11: Fix image references in page.html

Updated all `<img>` tags to use the renamed files. For assets that didn't exist in the export (Clover/HealthTap logos, app store badges):
- Used text-based logos in the navbar
- Created styled button links for App Store/Google Play

## Step 12: Compare and refine (Round 1)

Took fresh Playwright screenshots and compared against the Framer original. Identified remaining differences:

- Step 3 ("Earn rewards") needed dark green background with gold accent to match the Figma highlight
- Testimonial cards needed avatar photos next to the names

Fixed both issues in a dedicated commit.

## Step 13: Add documentation for tools

Created two additional guides:

- `docs/figma-mcp-guide.md` -- Comparison of 4 Figma MCP server options (Framelink, Official, Full API, Bridge) with setup instructions, rate limits, and recommendations
- `docs/playwright-guide.md` -- How to use Playwright for visual QA and 7 additional use cases (responsive testing, cross-browser, interactive elements, slow network, broken resources, PDF generation)

Updated README with references to both.

## Step 14: Automated Playwright QA loop (Round 2)

Used Playwright to screenshot both the Framer original (`intelligent-gecko-264478.framer.app`) and our rebuild side by side, then systematically compared every section. Identified and fixed 5 differences:

1. **Hero trust badges** -- Were plain text with icons. Restyled as pill-shaped badges with borders and white backgrounds to match Framer.
2. **"Not sure about tech" section** -- Had one CTA button. Added a second dark green button for the phone number to match Framer's two-button layout.
3. **Trusted care grid** -- Was a 4-column layout with icons above text. Changed to 2x2 grid with icons left-aligned next to text, matching Framer.
4. **Testimonials** -- Avatars were beside names in cards. Moved avatars above names, centered layout, changed to cream background section.
5. **Section backgrounds** -- Trusted care was cream, testimonials was white. Swapped to match Framer's alternation.

## Step 15: Project housekeeping

- Moved all documentation into `docs/` directory
- Created README.md with live demo links, before/after table, and references to all guides
- Added .gitignore for screenshots, OS files, and editor files
- Created PR to upstream repo: https://github.com/etonev/figma-framer-claude/pull/1

## Final result

| Metric | Framer export | Our rebuild |
|---|---|---|
| File size | 429KB | ~28KB |
| Lines of code | 841 | ~520 |
| Files | 1 monolithic HTML | 1 HTML (with external Tailwind CDN) |
| Inline SVGs | ~105 SVG path lines | Small icons only (readable) |
| JavaScript | Custom accordion script | None (native `<details>` element) |
| CSS approach | 4+ scattered `<style>` blocks | Tailwind utilities inline |
| Responsive | Framer-generated | Tailwind breakpoints |
| Editable by AI | No (too large, no semantic structure) | Yes |

## Step 16: Figma asset export (Round 3)

The designer exported assets directly from Figma:

- `healthtap-logo.svg` -- HealthTap wordmark logo (white on transparent)
- `app-store-badge.svg` -- Official App Store download badge
- `google-play-badge.svg` -- Official Google Play download badge

These replaced the text-based placeholders in the navbar, footer, and download section. The page now uses real brand assets.

## QA Summary

| Round | Issues found | Fixed |
|---|---|---|
| 1 | Broken images, wrong card highlight, missing avatars | Renamed assets, styled step 3, added testimonial photos |
| 2 | Badge styling, button count, grid layout, section backgrounds, testimonial layout | Pill badges, 2-button tech section, 2x2 grid, avatar-above-name layout |
| 3 | Step progress line, missing connecting indicator | Added horizontal line between step circles |
| 4 | Text-based logos, placeholder app buttons | Real SVG logo and badge exports from Figma |

## Commits on the branch

1. `94601b0` - docs: add guide for building pages with Claude Code
2. `f7a0263` - feat: rebuild landing page with Tailwind CSS
3. `6ad2ed4` - fix: rename assets to descriptive names and fix image references
4. `cc5270c` - fix: match Figma design details
5. `ec662f9` - docs: add session log documenting the full rebuild process
6. `4f184b4` - docs: move documentation to docs/ and add README
7. `13169b9` - docs: add Figma MCP and Playwright guides
8. `9d59f5a` - fix: round 1 QA - match Framer layout more closely
9. `7fa294b` - fix: round 2 QA - add step progress line and gitignore
10. `3f2c0ec` - fix: round 3 QA - use real Figma-exported logo and badges

## Step 17: Clover Health logo and navbar styling (Round 5)

The designer exported the full-page SVG from Figma (`Untitled.svg`, 25MB) and a footer section SVG (`768-1023.svg`, 360KB). From the full-page SVG, extracted the Clover Health logo path data and created `assets/images/clover-health-logo.svg`.

Also updated the navbar to match Figma more closely:
- Replaced text "Clover Health" with the real SVG logo
- Phone number restyled as a teal-outlined rounded pill with phone icon
- "Schedule visit online" button restyled as white pill with teal text and calendar icon

The footer SVG is too large/complex to use directly (it's the entire footer as one image). The HIPAA/SOC 2/JCAHO badges would need to be exported individually from Figma.

## Step 18: Figma export checklist and cleanup

Created `docs/figma-export-checklist.md` listing every asset a designer needs to export from Figma, organized by priority:
- Compliance badges (HIPAA, SOC 2, JCAHO) - last major gap
- Section icons (7 custom icons) - optional for pixel-perfect match
- Social icons - optional

Also cleaned up stale root-level doc files (already moved to `docs/`), updated README with reference to the checklist, and updated PR description on the upstream repo.

## Step 19: Comprehensive visual QA - Round 6

Used a Playwright subagent to take side-by-side screenshots at 12 scroll positions across both pages. Identified and fixed 12 major differences:

1. **Sticky navbar** - Made navbar fixed to top on scroll
2. **Button icons** - Added phone/calendar icons to all CTA buttons throughout
3. **Heading colors** - Changed to gold for "Earn $150", Testimonials, Schedule CTA, FAQ headings
4. **Card borders** - Added to LiveHealthy Visit features, Trusted Care grid, testimonials
5. **Multi-color icons** - Pink for medications, emerald for lab work, gold for schedule/care
6. **Star rating color** - Changed from yellow to teal/primary
7. **"Not sure about tech"** - Restyled as white bordered card instead of dark teal button
8. **CTA banner buttons** - Both outline style with icons (matching Framer)
9. **FAQ icons** - Teal circular expand/collapse buttons
10. **FAQ first item** - Auto-expanded on page load
11. **FAQ count** - Reduced to match Framer (removed extra items)
12. **Footer download** - Added QR code alongside app badges

## Step 20: Fine-tuning - Round 7

Second detailed comparison pass, identifying spacing and content differences:

1. **Hero padding** - Reduced from py-12/py-20 to py-8/py-14 (Framer shows less whitespace)
2. **Section padding** - Reduced all sections from py-16/py-24 to py-12/py-20
3. **Feature cards** - Removed borders, added shadow-sm and white bg (match Framer's subtle card style)
4. **"$150" highlight** - Added gold dollar sign in earn rewards card
5. **Extra FAQ** - Removed "How long do appointments take?" to match Framer's 5 items
6. **"Still Have questions?"** - Fixed capitalization, left-aligned, added full contact text
7. **Disclaimer background** - Changed from dark charcoal to white (matching Framer)
8. **Footer download card** - Wrapped in bordered card container

## QA Summary

| Round | Issues found | Fixed |
|---|---|---|
| 1 | Broken images, wrong card highlight, missing avatars | Renamed assets, styled step 3, added testimonial photos |
| 2 | Badge styling, button count, grid layout, section backgrounds, testimonial layout | Pill badges, 2-button tech section, 2x2 grid, avatar-above-name layout |
| 3 | Step progress line, missing connecting indicator | Added horizontal line between step circles |
| 4 | Text-based logos, placeholder app buttons | Real SVG logo and badge exports from Figma |
| 5 | Clover Health logo was text, navbar buttons wrong style | Real Clover Health SVG logo, teal pill phone, white pill schedule button |
| 6 | 12 differences: sticky nav, button icons, heading colors, card borders, icon colors, star color, tech section, CTA buttons, FAQ icons, FAQ state, FAQ count, QR code | All 12 fixed |
| 7 | Excess spacing, card styling, $150 text, extra FAQ, disclaimer bg, footer download layout | All 8 fixed |
| 8 | Hero banner/heading/buttons, FAQ icons, card text weight, step shapes, section bgs, footer layout | All fixes below |

## Commits on the branch (continued)

11. `845f2b3` - docs: update session log with QA rounds 3-4 and final status
12. `c1f0d29` - fix: add Clover Health logo, improve navbar, add export checklist
13. `87ab8d8` - fix: round 6 QA - match Framer design closely
14. `8021934` - fix: round 7 QA - tighten spacing and match Framer details
15. `9c10abf` - docs: update session log with QA rounds 6-7 and steps 18-20
16. `b6b4919` - chore: add package.json and package-lock.json to gitignore
17. `bdf8c90` - chore: commit Playwright setup and add QA instructions to CLAUDE.md
18. `03ae27a` - docs: update session log with step 21 and latest commits
19. `7a7f431` - fix: FAQ icons show proper X when open, increase item spacing
20. `abc14ff` - fix: hero section - match Framer banner, heading, bold text, button styles
21. `aaee3c9` - fix: round 8 QA - section-by-section match with Framer

## Step 21: Project cleanup and contributor setup

Decided to commit `package.json` and `package-lock.json` (Playwright dependency) so other contributors can reproduce the QA workflow. Updated `CLAUDE.md` with:

- Playwright install instructions (`npm install`, `npx playwright install chromium`)
- Example screenshot commands for desktop (1440x900) and mobile (375x812) viewports
- Reference to the full Playwright guide in docs

Also updated the PR description with a QA rounds summary table and remaining differences section.

## Step 22: Section-by-section QA (Round 8)

Previous QA rounds compared full-page screenshots, which missed many details. This round used Playwright to take 10 individual section screenshots at the same 1440x900 viewport for both pages, enabling much more precise comparison.

### Hero fixes (pre-round 8)
- "GET $150" banner: changed from gold pill to white bordered card with green checkmark icon
- Heading color: changed from dark green to muted gray (`text-gray-500`)
- Bold text: "covered at no additional cost to you" now bold
- Phone CTA: changed from filled dark green to outlined with teal text/border
- FAQ icons: proper X when open (two separate SVGs with group-open toggle)
- FAQ item spacing: increased from py-4 to py-6

### Round 8 section-by-section fixes
1. **LiveHealthy cards**: removed bold from card text, changed from shadow to border styling
2. **Step indicators**: changed from circles with connecting lines to rounded squares without lines
3. **Trusted care section**: changed bg from cream to white, cards already white with borders
4. **Testimonials section**: changed bg from white to cream (matching Framer's alternation)
5. **FAQ content width**: widened from max-w-3xl to max-w-4xl
6. **Footer layout**: restructured from 5-column to Framer's layout (2+2 link columns left, download card right)
7. **Footer download card**: added app icon, moved Questions section inside card, centered social icons and legal links

## Step 23: Multi-round mobile + desktop QA (Rounds 9-11)

Continued section-by-section QA comparing both desktop (1440x900) and mobile (375x812) viewports using Playwright scroll-offset screenshots.

### Round 9 fixes
1. **Trusted care bg**: restored `bg-cream` (was wrongly changed to white in round 8)
2. **"Not sure about tech" heading**: changed to `text-gold` (was `text-dark-green`)
3. **"Want help" card**: styled with `border-l-4 border-primary bg-cream rounded-r-xl`
4. **Earn $150 phone button**: changed to outlined style with teal text/border
5. **Step indicators**: moved inside cards with `bg-primary/15 text-primary rounded-lg`
6. **FAQ icons**: plain teal `+` text when collapsed, circled X when expanded

### Round 10 fixes (mobile-focused)
1. **Hero trust badges (mobile)**: changed from stacked pills to 3-column grid with icon above text
2. **CTA banner buttons**: phone → teal filled, schedule → white with teal text (matching Framer)
3. **"Want help" card text**: added "Call HealthTap support:" prefix
4. **Trusted care "Schedule" text**: kept desktop text, not mobile variant

### Round 11 fixes (color audit)
1. **Hero heading color**: changed from `text-gray-500` to `text-dark-green` (matching Framer's dark heading)
2. **Trusted care icon backgrounds**: increased opacity from `/10` to `/20` for more visible icon backgrounds
3. **Full color/background audit**: verified all section backgrounds and heading colors match Framer

## QA Summary (updated)

| Round | Issues found | Fixed |
|---|---|---|
| 1 | Broken images, wrong card highlight, missing avatars | Renamed assets, styled step 3, added testimonial photos |
| 2 | Badge styling, button count, grid layout, section backgrounds, testimonial layout | Pill badges, 2-button tech section, 2x2 grid, avatar-above-name layout |
| 3 | Step progress line, missing connecting indicator | Added horizontal line between step circles |
| 4 | Text-based logos, placeholder app buttons | Real SVG logo and badge exports from Figma |
| 5 | Clover Health logo was text, navbar buttons wrong style | Real Clover Health SVG logo, teal pill phone, white pill schedule button |
| 6 | 12 differences: sticky nav, button icons, heading colors, card borders, icon colors, star color, tech section, CTA buttons, FAQ icons, FAQ state, FAQ count, QR code | All 12 fixed |
| 7 | Excess spacing, card styling, $150 text, extra FAQ, disclaimer bg, footer download layout | All 8 fixed |
| 8 | Hero banner/heading/buttons, FAQ icons, card text weight, step shapes, section bgs, footer layout | All fixed |
| 9 | Trusted care bg, heading colors, card styling, step indicators, FAQ icons, button styles | All 6 fixed |
| 10 | Mobile trust badges layout, CTA button colors, card text, schedule description | All 4 fixed |
| 11 | Hero heading gray→dark-green, trusted care icon opacity too light | All fixed, full color audit passed |

## Commits on the branch (continued, rounds 9-11)

22. `c1ce2aa` - fix: round 9 QA - restore backgrounds, fix heading colors, restyle cards
23. `3e69b62` - fix: round 10 QA - mobile trust badges layout, CTA button colors, text fixes
24. `4fea11e` - fix: round 11 QA - hero heading color, trusted care icon opacity, revert text

## Remaining minor differences

- HIPAA, SOC 2, JCAHO trust badges in footer (need individual SVG exports from Figma)
- Custom illustration-style icons in Figma vs generic Heroicons (need individual SVG exports)

## Live URLs

- **Our rebuild:** https://asivura.github.io/figma-framer-claude/page.html
- **Original Framer export:** https://asivura.github.io/figma-framer-claude/index.html
- **Live Framer site:** https://intelligent-gecko-264478.framer.app/
- **PR:** https://github.com/etonev/figma-framer-claude/pull/1
