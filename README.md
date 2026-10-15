# Activate Top Candidates MCP

`@activatetalent/top-candidates-mcp` — a read-only [MCP](https://modelcontextprotocol.io) server that lets recruiters search, shortlist, and pitch Activate Talent's pre-vetted Top Candidates from Grok Bot, Cursor, Claude, or any MCP client.

Uses only the public search API (`/api/top-candidates/search`). No auth, no keys.

## Install

**npx (any MCP client):**
```json
{ "mcpServers": { "activate-top-candidates": { "command": "npx", "args": ["-y", "@activatetalent/top-candidates-mcp"] } } }
```

**Grok Bot (AddMcpServer):** ask Grok Bot to add an MCP server named `top-candidates` with command
`npx -y @activatetalent/top-candidates-mcp` (or locally `node /path/to/top-candidates/index.js`).

**Local:** `git clone … && npm install && node index.js` (stdio). Node ≥ 18.17.

## Tools

| Tool | What it does |
|---|---|
| `search_top_candidates(query, category?, maxResults?, includeRate?)` | Keyword search (≤25), optional client-side category filter. Rate hidden unless `includeRate`. |
| `list_categories()` | 22 public category slugs, display names, browse URLs. |
| `match_role(brief, category?, maxResults?)` | 1–3 searches from a brief, merged/deduped, ranked shortlist with title/category-based why-fit lines. |
| `get_candidate_link(id, from?)` | Profile URL only — never fetches. |
| `draft_candidate_pitch(name, role, roleDescription, …)` | Value-first pitch DRAFT; no client names, no price unless asked. |
| `get_top_candidate_profile_url` | Legacy alias of `get_candidate_link`. |

## Privacy rules

- Exposes only: id, first name + last initial, role title, category, profile URL, and public billRate (only on explicit request).
- Never exposes pay rates, full surnames, email, phone, address, LinkedIn, DOB, internal notes, past employers, or recruiter/owner.
- Never crawls profile pages (opening one triggers an AI resume read). Search results cached in-memory for 10 min.
- Pitches never name clients and never lead with price. Nothing is sent — drafts only.

## Example prompts for Grok Bot

- "Find me 5 Meta/TikTok media buyers for a DTC skincare brand."
- "Shortlist Shopify developers and give me profile links in a table."
- "Show executive assistants in the executive-virtual-assistants category."
- "Draft a pitch for Victor C. for a performance marketing lead role."
- "What categories does Activate have?"

## Development

`npm test` runs a stdio client smoke test against the live API.

## Changelog

- **1.0.0** (2026-10-15) — Store-ready release: `list_categories`, `match_role`, `get_candidate_link`, `draft_candidate_pitch`; category filter + maxResults; name/field sanitization; rate opt-in; 10-min search cache; skills + Cursor plugin manifest.
- **0.1.0** — Initial search + profile URL tools.
