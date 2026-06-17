# CLAUDE.md - Project Architecture & Context

## 🎯 Project Overview
- **Goal**: Final Fantasy XIV Screenshot-based Character Card Generator
- **Tech Stack**: React 18+ / TypeScript / Vite / Tailwind CSS
- **Deployment**: Cloudflare Pages
- **Primary Languages**: Korean (ko), English (en), Japanese (ja)

## 🏗️ Folder Structure (Target Architecture)
This project adheres to a strict, modular, and feature-focused architecture suitable for scalable frontend apps.

```text
src/
├── assets/        # Static assets (images, fonts, icons)
├── components/    # Reusable React components
│   ├── common/    # Generic UI elements (Buttons, Inputs, Modals, Tabs)
│   ├── card/      # Domain-specific: Card rendering & preview logic
│   └── layout/    # Page layout structures (Sidebar, Header)
├── constants/     # Global constants, default values, and configuration
├── contexts/      # React Context providers (Global state management)
├── data/          # Static domain data (FF14 Jobs, Servers, Roles)
├── hooks/         # Custom React hooks (e.g., useCardExport, useI18n)
├── types/         # TypeScript interfaces and type definitions
├── utils/         # Helper functions (e.g., image processing, formatting)
├── App.tsx        # Main application layout and state composition
├── index.css      # Global styles, Tailwind directives, and CSS variables
└── main.tsx       # Entry point
```

## 📐 Naming Conventions
- **Components/Interfaces/Types**: `PascalCase` (e.g., `CardPreview.tsx`, `CharacterData`)
- **Hooks**: `camelCase` starting with `use` (e.g., `useCardExport.ts`)
- **Functions/Variables/Instances**: `camelCase` (e.g., `handleDownload`, `selectedJob`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_IMAGE_SIZE`, `DEFAULT_THEME`)
- **Files/Directories (Non-Component)**: `kebab-case` or `camelCase` (e.g., `image-utils.ts`, `data/`)

## 🛠️ Coding Standards
1. **Component Design**: 
   - Use purely functional components with Hooks.
   - Maintain a separation of concerns: decouple business logic (hooks/utils) from presentation (components).
2. **TypeScript Strictness**:
   - `any` is strictly prohibited. Define explicit interfaces in `src/types/`.
   - Prefer `unknown` with type guards if the payload is dynamic.
3. **Styling & UI/UX**:
   - Strictly use Tailwind CSS utility classes. Avoid inline styles unless absolutely necessary for dynamic bounds.
   - For recurring complex patterns, extract to `components/common/` or use Tailwind `@apply` in `index.css`.
   - Implement seamless mobile-responsiveness and high-end visual design aesthetics (Discord-like blurple/green accents if specified).
4. **State Management**:
   - Keep local state close to where it's used. Lift state up or use Context API for global settings (e.g., active language, user preferences).
5. **Image Processing**:
   - Care should be taken with `html-to-image` rendering logic. Avoid transform and font-rendering (blurriness) issues. Ensure pixel-perfect scaling.
6. **Localization (i18n)**:
   - Hardcoded user-facing strings are strictly forbidden. Use the `src/utils/i18n.ts` dictionary system.
7. **Cloudflare Deployment**:
   - Ensure the Vite build strictly outputs to `dist/`.
   - Keep `.env` variables secure and rely on Cloudflare Pages environment variables for production.

## ⚡ User Global Rule: RTK (Rust Token Killer)
- **Usage**: Token-optimized CLI proxy (60-90% savings on dev operations). All commands are automatically rewritten by the hook.
- **Meta Commands**:
  - `rtk gain` / `rtk gain --history`
  - `rtk discover`
  - `rtk proxy <cmd>`
- **Note**: Ensure RTK is active; if `rtk gain` fails, there is a name collision.

## 🤖 Claude Agent Behaviors
- **Analyze First**: Read relevant code completely before modifying. No blind edits.
- **One-Pass Precision**: State the issue, show the fix, verify. Minimize iteration cycles.
- **No Boilerplate**: Provide the simplest working solution. Do not abstract prematurely.
- **Use Skills**: Check `.agent/skills/` locally when needing advanced UI/UX or architectural advice.
