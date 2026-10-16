# Marketplace listing: ready to paste

| Field | Value |
|---|---|
| Name | Activate Top Candidates |
| Tagline | Search, shortlist, and pitch pre-vetted talent without leaving your chat. |
| Category | Productivity (alt: Sales) |
| Tags | mcp, model-context-protocol, recruiting, staffing, talent, sourcing, candidates, cursor-plugin |
| Website | https://topcandidates.activatetalent.app |
| Support email | jared@activatetalent.com |
| Repository | https://github.com/jared502/top-candidates-mcp |
| Logo (PNG 512×512) | https://raw.githubusercontent.com/jared502/top-candidates-mcp/main/assets/logo.png |
| Logo (SVG, 1:1) | https://raw.githubusercontent.com/jared502/top-candidates-mcp/main/assets/logo.svg |
| Transport / auth | stdio · no auth · Node.js ≥ 18.17 |
| License | MIT |

## Install command
```
npx -y github:jared502/top-candidates-mcp
```
MCP config:
```json
{ "mcpServers": { "activate-top-candidates": { "command": "npx", "args": ["-y", "github:jared502/top-candidates-mcp"] } } }
```
(npm package `@activatetalent/top-candidates-mcp`: coming soon.)

## Short description
Search, shortlist, and pitch Activate Talent's pre-vetted Top Candidates right from your AI assistant. Describe a role and get a ranked shortlist with profile links and a value-first pitch draft you review before anything goes out.

## Long description
Activate Top Candidates is a read-only MCP server for recruiters and account managers. Describe the role you're hiring for, like "Senior Meta media buyer for a DTC brand", and it runs several searches across Activate Talent's pre-vetted Top Candidates, merges and ranks the results, and gives you a shortlist with a why-fit line and a profile link for each candidate.

You can also search by skill or tool (Meta Ads, Klaviyo, Shopify, and more), browse 22 talent categories from Media Buyers to AI Specialists, and draft value-first candidate pitches that lead with outcomes. Every pitch is a draft for you to review. The server never sends anything, needs no credentials, and works in any MCP client, including Grok Bot, Cursor, and Claude Desktop.

## Privacy
Read-only, public data only. The server calls only Activate Talent's public search API and returns first name + last initial, role title, category, and profile link. It never returns pay rates or bill rates, full surnames, emails, phone numbers, addresses, LinkedIn, dates of birth, internal notes, past employers, or recruiter info, and it strips those fields even if the API sends them. It never crawls profile pages, needs no API keys or login, and never sends messages.

## Tools
| Tool | What it does |
|---|---|
| `match_role` | Turns a role brief into a ranked, deduped shortlist with why-fit lines. Start here. |
| `search_top_candidates` | Keyword search by role, skill, or tool (up to 25), with an optional category filter. |
| `list_categories` | All 22 category slugs, names, and browse URLs. |
| `get_candidate_link` | Builds a candidate's public profile URL (never fetches it). |
| `draft_candidate_pitch` | Value-first pitch draft for review. No client names, no rates. Sends nothing. |
| `get_top_candidate_profile_url` | Deprecated alias of `get_candidate_link`. |

## Example prompts
1. "Find me 5 Meta + TikTok media buyers for a DTC skincare brand, with profile links."
2. "Who does Activate have for a Shopify developer who knows Klaviyo?"
3. "Draft a value-first pitch for the top video editor for a short-form content role."

## Where to submit
- Grok Bot marketplace: https://x.ai/bot/marketplace/submit-a-plugin (org handle `activate-talent`)
- Cursor Marketplace: https://cursor.com/marketplace/publish. Submit the repo URL; the root has `.cursor-plugin/plugin.json`, `skills/`, `assets/`, `README.md`, `LICENSE`.

## Checklist
- [x] `npm test` green
- [x] `npx -y github:jared502/top-candidates-mcp` starts and lists tools
- [x] Repo public, logo URLs return 200
- [ ] npm org `@activatetalent` (optional, later)
