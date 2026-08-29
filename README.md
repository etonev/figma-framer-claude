# Figma to Code with Claude Code

A practical guide and demo showing how to turn Figma designs into clean, maintainable code using [Claude Code](https://claude.ai/code), instead of relying on design tool exports.

## The Problem

Design tools like Framer and Webflow generate machine-optimized code that is nearly impossible for humans or AI to edit: monolithic files, inline SVG blobs, cryptic asset names, scattered styles. This repo demonstrates the gap and provides a better approach.

## Live Demo

| Page | Description |
|---|---|
| [Clean rebuild](https://asivura.github.io/figma-framer-claude/page.html) | Built with Claude Code using Tailwind CSS (~28KB) |
| [Framer export](https://asivura.github.io/figma-framer-claude/index.html) | Original Framer-generated code (429KB) |
| [Framer site](https://intelligent-gecko-264478.framer.app/) | Live Framer-hosted version |

Same design. The rebuild is 15x smaller, fully readable, and easy to modify.

## The Workflow

1. **Design in Figma** (not export from it)
2. **Screenshot each section** and share with Claude Code
3. **Provide design tokens** (colors, fonts, spacing) up front
4. **Build section by section**, reviewing as you go
5. **Use descriptive asset names**, not auto-generated hashes

## Project Structure

```
page.html              Clean rebuild using Tailwind CSS
index.html             Original Framer export (before)
assets/
  images/              Renamed with descriptive filenames
  fonts/               Gilroy Bold woff2
docs/
  figma-to-code-with-claude.md   Complete guide for designers
  why-tailwind.md                CSS approach decision doc
  figma-mcp-guide.md             Figma MCP server options and comparison
  playwright-guide.md            Visual QA and browser automation
  session-log.md                 Step-by-step journal of the rebuild
```

## Documentation

- **[Guide: Building Pages with Claude Code](docs/figma-to-code-with-claude.md)** -- The main resource. Covers why Framer exports fail, the better workflow, prompt templates, and a summary table of dos and don'ts.

- **[Why Tailwind CSS](docs/why-tailwind.md)** -- Decision doc explaining why Tailwind was chosen over plain CSS for this project: fewer files, strong Claude Code compatibility, zero build step.

- **[Figma MCP Guide](docs/figma-mcp-guide.md)** -- Comparison of Figma MCP server options (Framelink, Figma Official, Full API wrapper, MCP Bridge). Pros, cons, setup instructions, and when to use each.

- **[Playwright Guide](docs/playwright-guide.md)** -- How to use Playwright for visual QA, responsive testing, cross-browser screenshots, interactive element testing, and more. No project setup required.

- **[Figma Export Checklist](docs/figma-export-checklist.md)** -- Exactly which assets a designer needs to export from Figma to achieve a pixel-perfect match. Lists what's done, what's missing, naming conventions, and export tips.

- **[Designer QA Workflow](docs/designer-qa-workflow.md)** -- Practical advice for getting a pixel-perfect match. Covers section-by-section comparison, common differences to watch for, and asset preparation tips. Based on 8 rounds of QA on this project.

- **[Session Log](docs/session-log.md)** -- Full journal of every step taken during the rebuild, from diagnosing the Framer export through Playwright visual QA. Includes before/after metrics and the asset identification table.

## Before / After

| Metric | Framer export | Claude Code rebuild |
|---|---|---|
| File size | 429KB | ~28KB |
| Lines of code | 841 | ~510 |
| Inline SVGs | ~105 path lines | Small icons only |
| JavaScript | Custom accordion script | None (native `<details>`) |
| CSS | 4+ `<style>` blocks | Tailwind utilities |
| Editable by AI | No | Yes |

## Design Tokens

The page uses these values from the Figma source:

```
Colors:      #0C847A (primary), #1B4332 (dark green), #FFF8F0 (cream), #C4922A (gold)
Fonts:       Gilroy Bold (headings), Noto Sans (body)
Max width:   1200px
```

## Credits

Original Figma design and Framer export by [Eugene Tonev](https://github.com/etonev).
