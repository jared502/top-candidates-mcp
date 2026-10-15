# Publishing Activate Top Candidates

## 0. Prereqs
- GitHub org/repo: `github.com/jared502/top-candidates-mcp` (public). Confirm with Tj the org name.
- npm org `@activatetalent` (create at https://www.npmjs.com/org/create) so `npx -y @jared502/top-candidates-mcp` works.

## 1. Publish code
```bash
cd /home/box/agent-data/mcp-servers/top-candidates
git init && printf "node_modules\n" > .gitignore && git add . && git commit -m "v1.0.0"
gh repo create jared502/top-candidates-mcp --public --source . --push
npm test && npm login && npm publish --access public
git tag v1.0.0 && git push --tags
```

## 1b. Plugin install note
Marketplace installs run `node ${CURSOR_PLUGIN_ROOT}/index.js` from the cloned repo (no npm required for Cursor/Grok install). Publish to npm anyway so `npx -y @jared502/top-candidates-mcp` works for Claude Desktop and other clients.

## 2. Cursor Marketplace
- Repo root contains `.cursor-plugin/plugin.json`, `skills/`, README, LICENSE.
- Submit at https://cursor.com/marketplace/publish (sign in, paste the public repo URL). Review typically checks manifest validity, README, and license.
- Optional: also list on https://cursor.directory and the official MCP registry (`npx @modelcontextprotocol/publisher` / https://registry.modelcontextprotocol.io) with server name `io.github.jared502/top-candidates-mcp`.

## 3. xAI Grok Bot marketplace
- Provide: public repo URL, npm package name, install command `npx -y @jared502/top-candidates-mcp`, transport stdio, no auth, display name "Activate Top Candidates", category Productivity, short description, privacy statement (copy README "Privacy rules"), example prompts.
- Submit at https://x.ai/bot/marketplace/submit-a-plugin (org handle, website, 1:1 logo URL, listing targets). Repo + npm must be public first.

## 4. Release checklist
- [ ] `npm test` green
- [ ] Version bumped in package.json, plugin.json, index.js, README changelog
- [ ] No secrets in repo (`git grep -i -E "clerk|database_url|secret"` empty)
