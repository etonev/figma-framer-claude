# Why Tailwind CSS for This Project

## Context

We're rebuilding a Framer-exported landing page from scratch using Claude Code. The target audience is a product designer learning to use Claude Code effectively.

## Decision

Use Tailwind CSS via CDN instead of plain CSS.

## Reasons

**One file to manage.** Styles live directly on HTML elements as utility classes. No separate CSS file to keep in sync. For a designer learning Claude Code, fewer files means less cognitive load.

**Claude Code is excellent at Tailwind.** It knows the utility class names well and produces accurate, idiomatic output. This means fewer corrections and faster iteration.

**Responsive design is intuitive.** Breakpoint prefixes like `md:grid-cols-2 lg:grid-cols-4` read naturally and are easy to adjust.

**Zero build step.** A single `<script>` tag in the `<head>` is all it takes. No npm, no bundler, no config files. Just open the HTML file in a browser.

**Design tokens in one place.** Custom colors, fonts, and spacing are defined once in a Tailwind config block and referenced everywhere as `bg-primary`, `text-dark-green`, etc.

## Trade-offs accepted

- HTML class strings get verbose. For a demo/reference project, this is acceptable.
- CDN version is not optimized for production (no tree-shaking). Fine for a demo.
- The designer needs to learn Tailwind's naming conventions to make edits. But the names are descriptive (`px-6`, `rounded-lg`, `font-bold`), and Claude Code can explain any class on request.

## Alternative considered

Plain CSS with custom properties. Rejected because it requires managing a separate file and Claude Code's output is slightly less consistent with custom CSS class naming than with Tailwind utilities.
