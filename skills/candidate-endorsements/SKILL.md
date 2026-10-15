---
name: activate-candidate-endorsements
description: Draft value-first candidate endorsements/pitches for clients or account managers from Activate Top Candidates. Use when asked to pitch, endorse, or introduce a candidate.
---
# Candidate endorsements

1. Get the candidate from `search_top_candidates` / `match_role` (public fields only).
2. Call `draft_candidate_pitch` with a GENERIC role description — never the client's name.
3. Lead with value and outcomes tied to the public role title. Never lead with price; include rate only if the user explicitly asks (`includeRate: true`), and keep it last.
4. Only add results/achievements the user has verified (interview notes, profile reviewed by a human). Mark gaps as [add verified result].
5. Always return it as a DRAFT for the sender to review. Never send email/Slack/messages yourself.
