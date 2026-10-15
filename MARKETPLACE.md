# Marketplace submission kit

## xAI Grok Bot: https://x.ai/bot/marketplace/submit-a-plugin

| Field | Value |
|---|---|
| Plugin name | Activate Top Candidates |
| Org handle | `activate-talent` |
| Website | https://activatetalent.com |
| Product URL | https://topcandidates.activatetalent.app |
| Repository | https://github.com/jared502/top-candidates-mcp |
| Logotype (1:1 SVG) | `https://raw.githubusercontent.com/jared502/top-candidates-mcp/main/assets/logo.svg` (pattern: `https://raw.githubusercontent.com/<org>/<repo>/<branch>/assets/logo.svg`; update if the repo transfers) |
| Category | Productivity (alt: Sales) |
| Transport / auth | stdio · no auth |
| Contact | jared@activatetalent.com |

**Install command**
```
npx -y @activatetalent/top-candidates-mcp
```

**Short listing blurb (≤2 sentences)**
> Search, shortlist, and pitch Activate Talent's pre-vetted Top Candidates right from Grok Bot. Describe a role and get a ranked shortlist with profile links and a value-first pitch draft you review before anything goes out.

**Privacy blurb**
> Read-only and public data only. It calls only Activate Talent's public search API and returns first name + last initial, role, category, and profile link. It never crawls profiles, never handles contact details or private data, needs no credentials, and never sends messages. Every pitch is a draft.

**Example prompts**
1. "Find me 5 Meta + TikTok media buyers for a DTC skincare brand, with profile links."
2. "Who does Activate have for a Shopify developer who knows Klaviyo?"
3. "Draft a value-first pitch for the top video editor for a short-form content role."

## Cursor Marketplace: https://cursor.com/marketplace/publish
Submit the public repo URL. The root contains `.cursor-plugin/plugin.json`, `skills/`, `assets/logo.svg`, `README.md`, and `LICENSE`.

## Release steps (manual, not automated here)
```bash
npm test
gh repo create jared502/top-candidates-mcp --public --source . --push
npm publish --access public          # requires the @activatetalent npm org
git tag v1.0.0 && git push --tags
```
Optional: the MCP Registry as `io.github.jared502/top-candidates-mcp`, and cursor.directory.

## Checklist
- [ ] `npm test` green
- [ ] Version matches in package.json, plugin.json, index.js, and the README changelog
- [ ] `git grep -i -E "clerk|database_url|secret"` returns nothing
- [ ] Repo and npm package are public before submitting
