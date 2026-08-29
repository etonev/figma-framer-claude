# Building Web Pages with Claude Code: A Guide for Designers

You designed a page in Framer, exported it, and tried to use Claude Code to modify the result. Here's why that didn't work and what to do instead.

## Why Framer exports don't work with Claude Code

Framer (and similar tools) generate machine-optimized code that is actively hostile to AI editing:

- **Massive single file.** Your export was 429KB of HTML, CSS, and inline SVGs in one file. Claude Code can't even read it in a single pass.
- **Inline SVG blobs.** App Store badges, Google Play badges, LinkedIn/X icons are all inlined as hundreds of characters of raw SVG path data. They have zero semantic meaning to an AI (or a human).
- **Cryptic filenames.** Assets named `32yEQtzFN2eAP3GfY0EV7fztsfI.png` give Claude Code no context about what the image contains.
- **Scattered styles.** Multiple `<style>` blocks spread throughout the file with no logical organization.
- **No component structure.** Everything is flat, non-semantic HTML with no clear sections.

This is code optimized for browsers to render, not for humans or AI to read and edit.

## The better workflow: Figma to Claude Code

### Step 1: Design visually in Figma

Use Figma for your design work. Don't export code from Figma or Framer. The export is the problem.

### Step 2: Give Claude Code screenshots of each section

Claude Code can read images. Take a screenshot of each section of your design and drop them into the conversation one at a time. For your HealthTap/Clover page, that would be:

1. **Navbar** - the dark green bar with Clover Health + HealthTap logos and phone/CTA
2. **Hero** - the "See a doctor from your favorite chair" section with the elderly couple photo
3. **What is a LiveHealthy Visit** - the explainer with 3 icon cards (review health, get medications, order lab work)
4. **Earn $150 Rewards** - the 3-step process (Schedule, Complete visit, Earn rewards)
5. **Not sure about tech?** - the section with the doctor photo and help links
6. **Trusted care from real doctors** - the 4-feature grid (board-certified, your schedule, private/secure, extra care)
7. **Testimonials** - the star ratings and member quotes (Katherine M., Darrell S.)
8. **Schedule CTA banner** - the dark green call-to-action strip
9. **Common Questions** - the FAQ accordion
10. **Footer** - HealthTap logo, links, app store badges, social icons

Pair each screenshot with a brief description of the content and any specific details (exact colors, font names, spacing).

### Step 3: Let Claude Code write clean code from scratch

Ask Claude Code to build the page from your screenshots. It will produce:

- Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`)
- Clean, organized CSS (or Tailwind if you prefer)
- Proper image references you can swap in
- Accessible markup (ARIA attributes, proper heading hierarchy)

This code will be 5-10x smaller and actually maintainable.

### Step 4: Use real asset names

Before starting, rename your exported assets to something meaningful:

| Instead of | Use |
|---|---|
| `32yEQtzFN2eAP3GfY0EV7fztsfI.png` | `hero-couple.png` |
| `cvooq4lbXtBxlurDToeYAfu7VJ0.png` | `doctor-portrait.png` |
| `51wT7lXn8kGfjdURvdPMsc9TKBs.png` | `app-screenshot.png` |
| `xB7Ll8KOzkE1Kcm3zkDzlGLt5w.png` | `rewards-steps.png` |
| `cd1BlyS1PwT8LKjfV8JxsFed1A.svg` | `favicon.svg` |

Claude Code can reason about `hero-couple.png`. It can't reason about a hash.

### Step 5: Iterate section by section

Don't ask for the entire page in one prompt. Build it up:

```
Prompt 1: "Build the navbar. Dark green (#1B4332) background, Clover Health logo on
           the left, HealthTap logo next to it, phone number and green CTA button
           on the right."

Prompt 2: "Add the hero section. Headline: 'See a doctor from your favorite chair'.
           Subtext about Clover Health plan. Two green buttons (phone number + schedule).
           Photo of elderly couple on the right. Cream/beige background."

Prompt 3: "Add the 'What is a LiveHealthy Visit?' section with 3 icon cards..."

...and so on for each section.
```

Review each section before moving on. This gives you control and keeps Claude Code focused.

### Step 6: Keep files separated

Ask Claude Code to organize the project with separate files:

```
index.html            -- semantic HTML only
css/styles.css        -- all styles in one place
assets/images/        -- properly named images
  hero-couple.png
  doctor-portrait.png
  app-screenshot.png
  clover-logo.svg
  healthtap-logo.svg
assets/fonts/         -- web fonts
  gilroy-bold.woff2
```

This makes future edits trivial. Need to change a color? Edit one CSS file. Need to swap an image? Replace one file.

### Step 7: Provide design tokens up front

Give Claude Code the key design values from your Figma file in the first prompt. This avoids constant back-and-forth corrections:

```
Colors:
- Primary green: #0C847A
- Dark green (navbar/CTA banner): #1B4332
- Cream background: #FFF8F0
- White: #FFFFFF
- Dark text: #1A1A1A
- Gray text: #6B7280

Fonts:
- Headings: Gilroy Bold
- Body: Noto Sans, 400/700

Spacing:
- Section padding: 80px vertical
- Max content width: 1200px
```

## Advanced: Figma MCP server

For a repeatable workflow, consider setting up a Figma MCP server. This gives Claude Code direct access to your Figma files through the API, so it can extract exact colors, spacing, font sizes, and layout data programmatically instead of eyeballing screenshots.

Setup requires a [Figma API token](https://www.figma.com/developers/api) and adding the MCP server to your Claude Code config.

## Quick-start prompt template

Here's a prompt you can copy and adapt for the first message:

> I'm a designer building a landing page. I have a Figma design, here are screenshots of each section.
>
> Design tokens:
> - Primary: #0C847A, Dark: #1B4332, Background: #FFF8F0
> - Fonts: Gilroy Bold (headings), Noto Sans (body)
> - Max width: 1200px
>
> Please build this as a clean, single-page site using semantic HTML and a separate CSS file. Use placeholder `<img>` tags with descriptive filenames that I'll swap in later. Make it responsive. Start with just the navbar and hero section.

Then attach your screenshot.

## Summary

| Don't | Do |
|---|---|
| Export from Framer and ask Claude Code to edit it | Give Claude Code screenshots and let it write clean code |
| Put everything in one giant HTML file | Separate HTML, CSS, and assets |
| Use cryptic auto-generated filenames | Rename assets to be descriptive |
| Ask for the whole page at once | Build section by section, review as you go |
| Inline SVGs for icons and badges | Reference external SVG/image files |
| Let Claude Code guess your colors and fonts | Provide design tokens from Figma up front |
| Say "make it look like the design" | Describe specific details: colors, spacing, content |
