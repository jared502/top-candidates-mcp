#!/usr/bin/env node
/**
 * @activatetalent/top-candidates-mcp — read-only MCP for Activate Talent Top Candidates.
 * Uses ONLY the public search API. No auth, no DB/Clerk keys, no profile crawling.
 * Exposes public fields only: id, first name + last initial, role, category, profile URL.
 * NEVER returns pay rates, bill rates, full surnames, emails, phones, addresses, LinkedIn,
 * DOB, internal notes, past employers, or recruiter info, even if the API sends them.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const VERSION = "1.0.0";
const BASE = "https://topcandidates.activatetalent.app";
const SEARCH_URL = `${BASE}/api/top-candidates/search`;
const UA = `activate-top-candidates-mcp/${VERSION}`;
const MAX = 25;
const CACHE_TTL_MS = 10 * 60 * 1000;

export const CATEGORIES = [
  ["academy-graduates", "Activate Academy Graduates"],
  ["marketing-strategists", "Marketing Strategists"],
  ["operations-project-managers", "Operations & Project Managers"],
  ["ecommerce-managers", "Ecommerce Managers"],
  ["creative-design", "Creative & Design"],
  ["finance-accounting", "Finance & Accounting"],
  ["executive-virtual-assistants", "Executive & Virtual Assistants"],
  ["customer-service", "Customer Service"],
  ["video-content", "Video & Content"],
  ["affiliate-influencer-managers", "Affiliate & Influencer Managers"],
  ["social-media-managers", "Social Media Managers"],
  ["sales", "Sales"],
  ["logistics-supply-chain", "Logistics & Supply Chain"],
  ["data-analytics", "Data & Analytics"],
  ["media-buyers", "Media Buyers"],
  ["product-management", "Product Management"],
  ["developers", "Developers"],
  ["people-hr", "People & HR"],
  ["ai-specialists", "AI Specialists"],
  ["sustainability-impact-specialists", "Sustainability & Impact Specialists"],
  ["other-specialized", "Other / Specialized"],
  ["video-editor", "Video Editors"],
].map(([slug, name]) => ({ slug, name, url: `${BASE}/top-candidates/category/${slug}` }));
const CAT_NAME = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.name]));

const profileUrl = (id, from) =>
  `${BASE}/top-candidates/${encodeURIComponent(id)}${from ? `?from=${encodeURIComponent(from)}` : ""}`;

/** Whitelist public fields; enforce "First L." even if API ever returns more.
 *  Rates (pay/bill) and all other private fields are dropped here and never re-added. */
function sanitize(r) {
  const parts = String(r.name || "").trim().split(/\s+/).filter(Boolean);
  const name = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.` : parts[0] || "Candidate";
  const from = r.from || null;
  return {
    id: String(r.id), name, role: String(r.role || "").trim(),
    from, category: from ? CAT_NAME[from] || from : null, url: profileUrl(r.id, from),
  };
}

const cache = new Map();
async function search(q) {
  const key = q.trim().toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < CACHE_TTL_MS) return hit.v;
  const res = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(q.trim())}`, {
    headers: { Accept: "application/json", "User-Agent": UA }, signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Search API HTTP ${res.status}`);
  const data = await res.json();
  const v = (Array.isArray(data) ? data : data.results || []).slice(0, MAX).map(sanitize);
  cache.set(key, { t: Date.now(), v });
  return v;
}

const line = (c, i) =>
  `${i + 1}. ${c.name} — ${c.role}${c.category ? ` (${c.category})` : ""}\n   ${c.url}`;
const err = (e) => ({ content: [{ type: "text", text: `Error: ${e.message}` }], isError: true });
const publicOnly = ({ id, name, role, from, category, url }) => ({ id, name, role, from, category, url });

const STOP = new Set("a an and the for with of to in on at or who need needs needed looking someone must have has experience exp years year strong plus nice remote full time part role hire hiring candidate candidates we our is are be can will brand brands dtc ecommerce e-commerce company team their this that".split(" "));
const ROLE_PHRASES = [
  "media buyer", "performance marketer", "growth marketer", "project manager", "product manager",
  "account manager", "virtual assistant", "customer service", "social media", "community manager",
  "affiliate manager", "influencer manager", "creative director", "graphic designer", "video editor",
  "data analyst", "data scientist", "software engineer", "full stack", "fullstack", "front end",
  "frontend", "back end", "backend", "shopify developer", "klaviyo", "meta ads", "tiktok ads",
  "google ads", "paid social", "programmatic", "supply chain", "executive assistant",
];
function keywords(brief) {
  return [...new Set(brief.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w)))];
}
function buildQueries(brief) {
  const lower = brief.toLowerCase();
  const phrases = ROLE_PHRASES.filter((p) => lower.includes(p));
  const kw = keywords(brief);
  const out = [];
  for (const p of phrases) out.push(p);
  if (kw.length) out.push(kw.slice(0, 4).join(" "));
  if (kw.length >= 2) out.push(kw.slice(0, 2).join(" "));
  // Prefer a concrete noun phrase over a lone brand token
  const concrete = kw.find((w) => /buyer|manager|developer|designer|analyst|editor|assistant|specialist|engineer|marketer|director|strategist/.test(w));
  if (concrete) out.push(concrete);
  else if (kw[0] && kw[0].length > 3) out.push(kw[0]);
  return [...new Set(out.filter(Boolean))].slice(0, 3);
}

const server = new McpServer({ name: "activate-top-candidates", version: VERSION });

server.registerTool("search_top_candidates", {
  title: "Search Top Candidates",
  description: "Search Activate Talent's pre-vetted Top Candidates by role, skill, or tool (e.g. 'media buyer', 'Klaviyo', 'shopify developer'). Returns up to 25 results with public fields only: first name + last initial, role title, category, profile URL. Use `category` (a slug from list_categories) to narrow results. Report only returned candidates; never invent any.",
  inputSchema: {
    query: z.string().min(1).describe("Search words: role, skill, or tool"),
    category: z.string().optional().describe("Optional category slug filter, e.g. media-buyers"),
    maxResults: z.number().int().min(1).max(MAX).optional().describe("1–25, default 25"),
  },
}, async ({ query, category, maxResults = MAX }) => {
  try {
    let r = await search(query);
    if (category) r = r.filter((c) => c.from === category);
    r = r.slice(0, maxResults);
    const text = r.length
      ? `Top Candidates for "${query.trim()}"${category ? ` in ${CAT_NAME[category] || category}` : ""} (${r.length}):\n\n${r.map((c, i) => line(c, i)).join("\n")}`
      : `No matching candidates for "${query.trim()}"${category ? ` in ${category}` : ""}. Try broader words or browse list_categories.`;
    return { content: [{ type: "text", text }], structuredContent: { query: query.trim(), category: category || null, count: r.length, results: r.map((c) => publicOnly(c)) } };
  } catch (e) { return err(e); }
});

server.registerTool("list_categories", {
  title: "List Categories",
  description: "List every Top Candidates category with its slug, display name, and browse URL. Call this first when you need a valid `category` filter or `from` value.",
  inputSchema: {},
}, async () => ({
  content: [{ type: "text", text: CATEGORIES.map((c) => `- ${c.name} (${c.slug}): ${c.url}`).join("\n") }],
  structuredContent: { profileBaseUrl: `${BASE}/top-candidates/`, categories: CATEGORIES },
}));

server.registerTool("match_role", {
  title: "Match Role to Shortlist",
  description: "Turn a role brief into a ranked shortlist. Pass a one-line brief with must-haves and no client names (e.g. 'Meta + TikTok media buyer for DTC skincare'). Runs 1–3 searches, merges and dedupes them, and returns candidates with why-fit lines based ONLY on the public role title and category. Use this first for sourcing requests; tell the recruiter to verify fit on the profile.",
  inputSchema: {
    brief: z.string().min(3).describe("Role brief or must-haves"),
    category: z.string().optional().describe("Optional category slug to restrict to"),
    maxResults: z.number().int().min(1).max(MAX).optional().describe("Shortlist size, default 10"),
  },
}, async ({ brief, category, maxResults = 10 }) => {
  try {
    const kw = keywords(brief);
    const queries = buildQueries(brief);
    if (!queries.length) return err(new Error("Brief has no searchable keywords."));
    const lowerBrief = brief.toLowerCase();
    const seen = new Map();
    for (const q of queries) {
      const rs = await search(q).catch(() => []);
      rs.forEach((c, idx) => {
        const prev = seen.get(c.id) || { c, hits: 0, best: 99, qs: [] };
        prev.hits++; prev.best = Math.min(prev.best, idx); prev.qs.push(q);
        seen.set(c.id, prev);
      });
    }
    let list = [...seen.values()];
    if (category) list = list.filter((x) => x.c.from === category);
    for (const x of list) {
      const hay = `${x.c.role} ${x.c.category || ""} ${x.c.from || ""}`.toLowerCase();
      const phraseHits = ROLE_PHRASES.filter((p) => lowerBrief.includes(p) && hay.includes(p));
      x.matched = [...new Set([...phraseHits, ...kw.filter((k) => hay.includes(k))])];
      x.score = x.matched.length * 12 + phraseHits.length * 8 + x.hits * 3 - x.best * 0.2;
      if (category && x.c.from === category) x.score += 15;
    }
    list.sort((a, b) => b.score - a.score);
    list = list.slice(0, maxResults);
    const why = (x) => x.matched.length
      ? `Role title/category matches: ${x.matched.join(", ")} — "${x.c.role}"${x.c.category ? ` in ${x.c.category}` : ""}.`
      : `Surfaced by search "${x.qs[0]}"; title "${x.c.role}" — verify fit on profile.`;
    const text = list.length
      ? `Shortlist for: "${brief}"\nSearches run: ${queries.map((q) => `"${q}"`).join(", ")}\n\n${list.map((x, i) => `${line(x.c, i)}\n   Why: ${why(x)}`).join("\n")}\n\nFit notes use only public title + category. Open profiles to verify experience.`
      : `No matches for "${brief}" (searches: ${queries.join(", ")}). Try different keywords.`;
    return { content: [{ type: "text", text }], structuredContent: { brief, queries, count: list.length, shortlist: list.map((x) => ({ ...publicOnly(x.c), why: why(x), score: Math.round(x.score * 10) / 10 })) } };
  } catch (e) { return err(e); }
});

server.registerTool("get_candidate_link", {
  title: "Get Candidate Link",
  description: "Build a candidate's public profile URL from `id` and an optional category slug `from`. This never fetches the page, because opening a profile triggers an AI resume read. Share the link; do not crawl it.",
  inputSchema: { id: z.string().min(1), from: z.string().optional().describe("Optional category slug") },
}, async ({ id, from }) => {
  const url = profileUrl(id, from);
  return { content: [{ type: "text", text: url }], structuredContent: { id, from: from || null, url } };
});

server.registerTool("draft_candidate_pitch", {
  title: "Draft Candidate Pitch",
  description: "Draft a short, value-first candidate endorsement for the sender to review. Pass a generic `roleDescription` with no client name. The draft leads with outcomes tied to the public role title and never invents experience. It never includes pay or bill rates. Returns a DRAFT only; this tool sends nothing.",
  inputSchema: {
    name: z.string().describe("Public name (first name + last initial)"),
    role: z.string().describe("Public role title"),
    category: z.string().optional().describe("Category slug or name"),
    id: z.string().optional(),
    url: z.string().optional(),
    roleDescription: z.string().describe("Generic role description (no client names)"),
  },
}, async ({ name, role, category, id, url, roleDescription }) => {
  const first = sanitize({ id: id || "x", name }).name;
  const catName = category ? CAT_NAME[category] || category : null;
  const link = url || (id ? profileUrl(id, category && CAT_NAME[category] ? category : undefined) : null);
  const lines = [
    `Subject: Pre-vetted ${role} for your ${roleDescription.split(/[.,;]/)[0].trim()} role`,
    "",
    "Hi [Name],",
    "",
    `For the ${roleDescription.trim().replace(/\.$/, "")} role, I'd like to put forward ${first} — a pre-vetted ${role}${catName ? ` from our ${catName} bench` : ""}.`,
    "",
    `Why ${first.split(" ")[0]}: their focus as a ${role} lines up directly with what this role needs to deliver, and they've already cleared Activate Talent's vetting, so you can move straight to a conversation about outcomes.`,
    "",
    link ? `Profile: ${link}` : null,
    "",
    "Want me to set up a quick intro call this week?",
  ].filter((l) => l !== null);
  lines.push("", "Best,", "[Your name]");
  const text = `DRAFT — review before sending. Add verified results from the profile/interview; do not add claims you haven't confirmed.\n\n${lines.join("\n")}`;
  return { content: [{ type: "text", text }], structuredContent: { draft: lines.join("\n") } };
});

// Back-compat alias for existing configs
server.registerTool("get_top_candidate_profile_url", {
  title: "Get Profile URL (legacy)",
  description: "Deprecated alias of get_candidate_link, kept for older configs. Prefer get_candidate_link. Returns the URL only and never fetches it.",
  inputSchema: { id: z.string().min(1), from: z.string().optional() },
}, async ({ id, from }) => ({ content: [{ type: "text", text: profileUrl(id, from) }], structuredContent: { id, from: from || null, url: profileUrl(id, from) } }));

await server.connect(new StdioServerTransport());
