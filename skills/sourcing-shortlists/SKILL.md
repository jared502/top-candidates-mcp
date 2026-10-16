---
name: activate-sourcing-shortlists
description: Build ranked candidate shortlists from Activate Talent's Top Candidates for a role brief. Use when a recruiter or account manager asks to find, source, or shortlist candidates, or asks who Activate has for a role.
---
# Sourcing shortlists

## When to use
- "Find me…", "Who do we have for…", "Shortlist…", "Source a…" for any role, skill, or tool.
- Not for writing pitches. Use `activate-candidate-endorsements` for that.

## Tool order
1. **Brief:** restate the role in one line (title + 2–3 must-haves). Remove any client or company name.
2. **`match_role(brief)`:** always call this first.
3. **If you get fewer than 3 good fits:** call `list_categories`, then `search_top_candidates(query, category)` with alternate titles or tools (e.g. "performance marketer", "Klaviyo").
4. **Links:** use the profile `url` from the results, or `get_candidate_link(id, from)`.
5. **Present** a ranked table: Name (First L.) | Role | Category | Why fit | Profile link.

## Privacy rules (always)
- Show only the public fields: first name + last initial, role, category, profile link.
- Never open or crawl profile pages. Each open triggers an AI resume read. Share links instead.
- Never request or show surnames, email, phone, address, LinkedIn, DOB, past employers, internal notes, or recruiter/owner.
- Leave rates out. The tools never return pay or bill rates.
- Why-fit lines come only from the public title and category. Never invent years, tools, brands, or results.

## Communication rules
- Never name clients in briefs, tool calls, or output meant for anyone outside Activate Talent.
- Any outgoing message is a draft for the sender to review. Never send it yourself.
- Lead with value and fit, never price.
