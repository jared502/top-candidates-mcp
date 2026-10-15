---
name: activate-sourcing-shortlists
description: Build candidate shortlists from Activate Talent Top Candidates for a role brief. Use when a recruiter asks to find, source, or shortlist candidates.
---
# Sourcing shortlists with Activate Top Candidates

1. Clarify the brief in one line (role + 2–3 must-haves). Strip client names before calling any tool.
2. Call `match_role` with the brief. If results are thin, call `search_top_candidates` with alternate titles/tools (e.g. "performance marketer", "Klaviyo") and an optional `category` from `list_categories`.
3. Present a ranked table: name (first + last initial), role, category, profile link, why-fit.
4. Why-fit must come only from public title + category. Never invent years, tools, brands, or results.
5. Do not open/crawl profile pages; share links via `get_candidate_link` (each open triggers an AI resume read).
6. Omit rates unless the user explicitly asks; then use `includeRate: true`.
7. Never request or show surnames, contact details, LinkedIn, DOB, past employers, internal notes, or recruiter/owner.
