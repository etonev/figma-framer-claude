# Figma MCP Servers: Connecting Figma to Claude Code

MCP (Model Context Protocol) servers let Claude Code access your Figma files directly through the API, so it can extract exact colors, spacing, fonts, and layout data programmatically instead of eyeballing screenshots.

## Options

### 1. Framelink (Recommended)

The most popular option (13.6k GitHub stars). Framework-agnostic, intelligently simplifies Figma data to reduce token bloat.

**Setup:**

Get a [Figma Personal Access Token](https://www.figma.com/developers/api#access-tokens) with "File content" and "Dev resources" read scopes, then:

```bash
claude mcp add framelink -- npx -y figma-developer-mcp --figma-api-key=YOUR_KEY --stdio
```

Or add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "framelink": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_KEY", "--stdio"]
    }
  }
}
```

**Usage:** Paste a Figma URL into the chat. Claude Code will call `get_figma_data` to fetch simplified layout/styling metadata.

**Tools:**
- `get_figma_data` -- fetches and simplifies layout/styling metadata for a Figma node
- `download_figma_images` -- exports images from Figma

### 2. Figma Official MCP

Hosted by Figma. Richest feature set (12 tools), includes Code Connect integration and can write back to Figma.

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

No API token needed (uses OAuth browser login).

**The catch:** Severe rate limits on free/cheap plans (6 tool calls per month on Starter). Dev or Full seats on Professional+ plans get reasonable limits.

### 3. thirdstrandstudio/mcp-figma (Full API wrapper)

Thin wrapper around the entire Figma REST API (31 tools). Useful if you need comments, webhooks, or library analytics.

```bash
claude mcp add figma-full -- npx -y @thirdstrandstudio/mcp-figma --figma-token=YOUR_KEY
```

**Warning:** No intelligent simplification. Raw API responses can be huge and blow context windows.

### 4. Figma MCP Bridge (Plugin-based)

Uses a Figma plugin + WebSocket instead of the REST API. Bypasses rate limits entirely, including the 6/month free tier limit. More involved setup.

**Repo:** [gethopp/figma-mcp-bridge](https://github.com/gethopp/figma-mcp-bridge)

## Comparison

| | Framelink | Figma Official | Full API Wrapper | MCP Bridge |
|---|---|---|---|---|
| **Setup** | API token | OAuth | API token | Plugin + WebSocket |
| **Tools** | 2 | 12 | 31 | Varies |
| **Context simplification** | Yes | Yes | No | Varies |
| **Rate limits** | Figma API limits | 6/month (free) | Figma API limits | None |
| **Write back to Figma** | No | Yes | Yes (comments) | Yes |
| **Framework assumption** | None | React + Tailwind | None | None |
| **GitHub stars** | 13.6k | 378 | 64 | 62 |

## Pros of Using Figma MCP for This Project

- **Exact design tokens.** No guessing colors from screenshots. The MCP returns precise hex values, font sizes, spacing, border radii.
- **Faster iteration.** Instead of screenshotting each section, paste the Figma URL and Claude Code reads the design data directly.
- **Handles updates.** When the designer changes something in Figma, Claude Code picks up the new values automatically.
- **Image export.** The `download_figma_images` tool can pull assets directly from Figma, avoiding the cryptic hash filename problem entirely.

## Cons of Using Figma MCP for This Project

- **Extra setup.** Need a Figma API token and MCP server configuration. For a one-off page, screenshots are faster to get started.
- **Rate limits.** The Official server's free tier (6 calls/month) is unusable for real work. Even Framelink is subject to Figma's API rate limits.
- **Context bloat.** Complex Figma files with many layers can produce large responses that consume Claude Code's context window, even with Framelink's simplification.
- **Not visual.** MCP returns structural/styling data, not a visual rendering. Claude Code still benefits from seeing a screenshot to understand the overall layout and feel.
- **Learning curve.** The designer needs to understand MCP configuration, API tokens, and how to reference specific Figma nodes.

## When to Use What

| Approach | Best for |
|---|---|
| **Screenshots only** | One-off pages, quick prototypes, designers new to Claude Code |
| **Framelink MCP** | Repeated design-to-code workflows, pixel-accurate builds, design systems |
| **Figma Official MCP** | Teams with Dev seats, projects needing Code Connect integration |
| **Screenshots + MCP** | Best of both worlds: visual context + precise data |

## Recommendation

For most designers starting out, **screenshots are sufficient**. Add Framelink MCP when you find yourself going back and forth on exact values (colors, spacing, font sizes) or when you're building multiple pages from the same design system.

The ideal workflow combines both: a screenshot for visual context, plus MCP for precise token extraction.
