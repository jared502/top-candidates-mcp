<p align="center"><img src="assets/logo.svg" width="96" height="96" alt="Activate Top Candidates logo"></p>

# Activate Top Candidates

**Search, shortlist, and pitch Activate Talent's pre-vetted Top Candidates from Grok Bot, Cursor, or Claude, without leaving your chat.**

`@activatetalent/top-candidates-mcp` is a read-only [Model Context Protocol](https://modelcontextprotocol.io) server for recruiters and account managers. You describe the role and get back a ranked shortlist with profile links and a draft pitch you can review, built only from public data.

## What it does
- **Searches** Activate Talent's public Top Candidates by role, skill, or tool (Meta Ads, Klaviyo, Shopify, and more).
- **Matches a role brief** to a ranked, deduped shortlist, with a why-fit line for each candidate.
- **Browses 22 categories**, from Media Buyers to AI Specialists to Video Editors.
- **Drafts value-first pitches** that lead with outcomes, never price, and never name clients.
- **Shares profile links** for a human to open.

## What it never does
- Never sends email, Slack, or messages. Every pitch is a **draft for you to review**.
- Never reads private data: no surnames, contact details, LinkedIn, DOB, past employers, internal notes, or pay rates.
- Never crawls profile pages or scrapes the site.
- Never needs credentials. No API keys, no login, no database access.

## Install

Requires Node.js ≥ 18.17. Transport: stdio. Auth: none.

### Grok Bot
Ask Grok Bot:
> Add an MCP server named `activate-top-candidates` with command `npx -y @activatetalent/top-candidates-mcp`.

Or install it from the Grok Bot plugin marketplace once the listing is live.

### Cursor
- **Plugin:** install **Activate Top Candidates** from the Cursor Marketplace. It bundles the MCP server and two skills, and runs `node ${CURSOR_PLUGIN_ROOT}/index.js`.
- **Manual:** add to `~/.cursor/mcp.json`:
```json
{ "mcpServers": { "activate-top-candidates": { "command": "npx", "args": ["-y", "@activatetalent/top-candidates-mcp"] } } }
```

### Claude Desktop
Add to `claude_desktop_config.json`:
```json
{ "mcpServers": { "activate-top-candidates": { "command": "npx", "args": ["-y", "@activatetalent/top-candidates-mcp"] } } }
```

### From source
```bash
git clone https://github.com/jared502/top-candidates-mcp && cd top-candidates-mcp
npm install && npm test && node index.js
```

## Tools

| Tool | Purpose |
|---|---|
| `match_role(brief, category?, maxResults?)` | Turns a role brief into a ranked shortlist (1–3 merged searches, why-fit lines from the public title and category). **Start here.** |
| `search_top_candidates(query, category?, maxResults?)` | Keyword search, up to 25 results, with an optional category filter. Never returns rates. |
| `list_categories()` | All 22 category slugs, names, and browse URLs. |
| `get_candidate_link(id, from?)` | Builds a profile URL and never fetches it. |
| `draft_candidate_pitch(name, role, roleDescription, …)` | Value-first pitch **draft**: no client names, no price unless asked. |
| `get_top_candidate_profile_url(id, from?)` | Deprecated alias of `get_candidate_link`. |

## Bundled skills (Cursor / Grok Bot plugin)
- **activate-sourcing-shortlists:** brief → `match_role` → refine → ranked table with links.
- **activate-candidate-endorsements:** candidate → link → `draft_candidate_pitch` → a draft you review.

## Example prompts
- "Find me 5 Meta + TikTok media buyers for a DTC skincare brand, as a table with profile links."
- "Who does Activate have for a Shopify developer who knows Klaviyo?"
- "List the categories, then show executive assistants."
- "Draft a value-first pitch for the top media buyer for a performance marketing lead role."
- "Shortlist video editors for short-form social content."

## Privacy & data policy
- **Source:** only the public endpoint `https://topcandidates.activatetalent.app/api/top-candidates/search`.
- **Fields returned:** candidate id, first name + last initial (enforced even if the API returns more), role title, category, profile URL. Nothing else.
- **Never returned:** full surname, email, phone, address, LinkedIn, DOB, past employers, internal notes, recruiter/owner, pay rates, or bill rates (stripped from every tool output).
- **No crawling:** profile pages are never fetched. Opening one triggers an AI resume read, so links go to humans.
- **Storage:** search results are cached in memory for 10 minutes and nothing is written to disk. No telemetry.
- **Outbound:** nothing is sent anywhere. Pitches are drafts.

## Support
Built and maintained by **[Activate Talent](https://activatetalent.com)**.
- Product: <https://topcandidates.activatetalent.app>
- Contact: [jared@activatetalent.com](mailto:jared@activatetalent.com)
- Issues: <https://github.com/jared502/top-candidates-mcp/issues>

## Development
`npm test` runs an end-to-end stdio smoke test against the live public API. It checks for field leaks, the category filter, `match_role`, links, and that pitches contain no price.

## License
[MIT](LICENSE) © Activate Talent

## Changelog
- **1.0.0** (2026-10-15): Marketplace-ready release. Added `list_categories`, `match_role`, `get_candidate_link`, and `draft_candidate_pitch`; the category filter and `maxResults`; name and field sanitization; a 10-minute search cache; the Video Editors category; better role-phrase matching; two bundled skills; the Cursor plugin manifest; and polished docs and logo.
- **0.1.0**: Initial search and profile-URL tools.
