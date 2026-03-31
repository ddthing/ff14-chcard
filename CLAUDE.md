# CLAUDE.md
# FF14 Character Card Generator - Claude Behavior Rules
# Based on: https://github.com/drona23/claude-token-efficient
# Profile: Universal + Coding
# User instructions always override this file.

---

## Approach
- Think before acting. Read existing files before writing code.
- Be concise in output but thorough in reasoning.
- Prefer editing over rewriting whole files.
- Do not re-read files you have already read unless the file may have changed.
- Test your code before declaring done.
- No sycophantic openers or closing fluff.
- Keep solutions simple and direct. No over-engineering.
- If unsure: say so. Never guess or invent file paths.

## Efficiency
- Read before writing. Understand the problem before coding.
- No redundant file reads. Read each file once.
- One focused coding pass. Avoid write-delete-rewrite cycles.
- Test once, fix if needed, verify once. No unnecessary iterations.
- Budget: 50 tool calls maximum. Work efficiently.

## Output
- Return code first. Explanation after, only if non-obvious.
- No inline prose. Use comments sparingly - only where logic is unclear.
- No boilerplate unless explicitly requested.

## Code Rules
- Simplest working solution. No over-engineering.
- No abstractions for single-use operations.
- No speculative features or "you might also want..."
- Read the file before modifying it. Never edit blind.
- No docstrings or type annotations on code not being changed.
- No error handling for scenarios that cannot happen.
- Three similar lines is better than a premature abstraction.

## Review Rules
- State the bug. Show the fix. Stop.
- No suggestions beyond the scope of the review.
- No compliments on the code before or after the review.

## Debugging Rules
- Never speculate about a bug without reading the relevant code first.
- State what you found, where, and the fix. One pass.
- If cause is unclear: say so. Do not guess.

## ASCII Only
- No em dashes, smart quotes, Unicode bullets.
- Plain hyphens and straight quotes only.
- Code output must be copy-paste safe.

---

## Project Context
- Stack: React + TypeScript + Vite + Tailwind CSS v4
- Dev server: npm run dev (localhost:5173)
- Key files:
  - src/App.tsx - root state, download logic
  - src/components/CardForm.tsx - 4-tab form (basic/job/style/design)
  - src/components/CardPreview.tsx - card render + image crop
  - src/components/MainLayout.tsx - sidebar + preview panel layout
  - src/utils/i18n.ts - KO/EN/JA translations
  - src/data/jobs.ts - FF14 job definitions
  - src/data/servers.ts - world/datacenter data
- Languages: ko (default), en, ja
- Never modify image export logic (html-to-image) without careful testing.
- Fonts are loaded via CSS class names (font-pretendard, font-paperozi, etc.)
