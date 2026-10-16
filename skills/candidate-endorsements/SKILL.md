---
name: activate-candidate-endorsements
description: Draft value-first candidate endorsements and intros from Activate Top Candidates for clients or account managers. Use when asked to pitch, endorse, introduce, or "write up" a candidate.
---
# Candidate endorsements

## When to use
- "Pitch…", "Endorse…", "Write an intro for…", "Draft a blurb on…" about a Top Candidate.
- If you don't have a candidate yet, use `activate-sourcing-shortlists` first.

## Tool order
1. **Find the candidate:** `search_top_candidates` or `match_role`. Use public fields only.
2. **Link:** take the `url` from the result, or call `get_candidate_link(id, from)`.
3. **Draft:** `draft_candidate_pitch(name, role, roleDescription, …)`. `roleDescription` must be generic, e.g. "paid social lead for a DTC skincare brand", never the client's name.
4. **Refine:** add only results the user has verified (interview notes, a profile a human reviewed). Leave gaps as `[add verified result]`.
5. **Return the DRAFT** to the user and label it "review before sending".

## Hard rules
- **Draft before sending:** never send email, Slack, SMS, or any other message yourself.
- **Never name clients**, past or current, in the pitch or the tool arguments.
- **Never lead with price.** Lead with value and outcomes. The tools never return or include pay or bill rates; rates are discussed directly by the recruiter.
- **Privacy:** public fields only (First L., role, category, link). No surnames, contact details, LinkedIn, DOB, past employers, or internal notes. Never crawl profile pages.
- **No fabrication:** claim nothing beyond the public role title and what the user verified.
