/**
 * Shared Style Tokens
 *
 * Design-system–level class strings shared across all form components.
 * Centralizing these prevents silent divergence when one component is updated
 * and others are inadvertently left behind — a common source of visual debt.
 *
 * Usage:
 *   import { inputClass } from '../../utils/styles';
 */

// ─── Form Input ───────────────────────────────────────────────────────────────
// Standard text/select input surface: off-white fill, subtle border, blue focus ring.
// Applied to: text inputs, selects, dropdowns, and inline-editable triggers.
export const inputClass =
    'w-full bg-[#f5f5f7] dark:bg-[#2d2d2f] border border-[#d2d2d7] dark:border-[#424245] ' +
    'px-3 py-2.5 rounded-xl text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] ' +
    'focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all';
