# ADR-0010 — AI-Generated Articles Published Without Mandatory Human Review Gate
> **Status**: accepted | **Date**: 2026-04-28 | **Author**: Pablo Cubides

## Context
AquatechIA uses AI coding agents (Claude Code, Copilot, Antigravity) to generate blog articles at scale. A decision was needed about whether AI-generated content requires mandatory human review before publishing, or whether automated validation is sufficient as the quality gate.

### Forces
- Solo developer: a mandatory review gate blocks publishing velocity when only one person manages the platform.
- Articles are technical and educational — factual accuracy is important, but errors can be corrected quickly via new commits.
- Zod schema validation + `content-lint.yml` catches structural errors (empty fields, wrong dates, missing alts) automatically.
- AI-generated content today (2026) is high-quality for technical topics the models are trained on (LLMs, AI tools, environmental science).
- The existing `write-ia-articles.js` pattern already published AI-generated content directly.
- Rollback is trivial: revert the commit or delete the article file.

## Decision
**AI-generated articles are published directly to production without a mandatory human review gate.** The safeguard is automated: Zod validation + `content-lint.yml` CI pipeline must pass before merge.

The author field identifies the authoring context (e.g., "Pablo Cubides" as responsible party, or in the future an explicit "AI-assisted" badge). Corrections are made by committing a new version of the article file.

## Consequences

### Positive
- High publishing velocity — new articles can go live same-day.
- Automated validation catches the most common errors (empty fields, broken links, wrong formats).
- Aligns with the existing workflow (AI has been generating articles without review already).
- Reduces bottleneck in a solo-developer workflow.

### Negative
- Factual errors can reach production undetected until noticed organically.
- No editorial review of tone, accuracy of novel claims, or regulatory statements (critical for environmental content).
- Reputational risk if AI produces confidently wrong technical content.

### Neutral
- This decision can be revisited when the team grows or if reputational incidents occur.
- A future ADR could introduce "flagged content" (e.g., articles about regulations or health advice) that requires review.

## Mitigations
- `content-lint.yml` enforces structural correctness.
- Articles generated from `.specify/instructions/content-generation.md` which bans unverified statistics.
- Corrections are fast: edit the TypeScript file, push, and Vercel auto-deploys within minutes.
- Consider adding a `reviewed: false` flag to the `BlogArticle` schema in a future spec for optional tracking.

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Mandatory human review before merge | Blocks publishing velocity; solo developer is the reviewer and author — no benefit |
| Draft/preview URL for review | Extra infrastructure; Vercel preview URLs already serve as informal review |
| AI confidence score gate | Not available in current tools; overengineered for current scale |

## Implementation Notes
- Constitution §7.2: "Published directly to production — no mandatory human review gate."
- Constitution §7.2: "Safeguard: Zod validation + `content-lint.yml` must pass in CI before merge."
- See SPEC-101 for the AI article generator spec.
- See `.specify/instructions/content-generation.md` for generation rules.
