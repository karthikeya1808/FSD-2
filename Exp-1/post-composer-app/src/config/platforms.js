/**
 * PLATFORM STRATEGY CONFIGURATION
 * ---------------------------------------------------------------------------
 * This file is the backbone of the "Strategy Pattern" used throughout the
 * composer. Instead of writing `if (platform === 'twitter') {...} else if...`
 * branches all over the codebase, every platform-specific rule (character
 * limit, hashtag ceiling, media rules, tone) lives in ONE data structure.
 *
 * Consumers (validation.js, PlatformSelector, CharacterCounter, etc.) simply
 * look up `PLATFORMS[id]` and apply the relevant strategy. Adding a new
 * platform later means adding one object here — no other file needs to
 * change. This is what "modular design using software design patterns"
 * means in practice.
 */

export const PLATFORM_IDS = {
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  INSTAGRAM: 'instagram',
}

export const PLATFORMS = {
  [PLATFORM_IDS.TWITTER]: {
    id: PLATFORM_IDS.TWITTER,
    label: 'X / Twitter',
    shortLabel: 'X',
    charLimit: 280,
    maxHashtags: 5,
    maxMedia: 4,
    mediaRequired: false,
    accent: '#2B5876',
    glyph: '𝕏',
    tone: 'Short, punchy, wire-style bulletins.',
    warnThreshold: 0.9, // start warning at 90% of the limit
  },
  [PLATFORM_IDS.LINKEDIN]: {
    id: PLATFORM_IDS.LINKEDIN,
    label: 'LinkedIn',
    shortLabel: 'in',
    charLimit: 3000,
    maxHashtags: 10,
    maxMedia: 9,
    mediaRequired: false,
    accent: '#0A5C6B',
    glyph: 'in',
    tone: 'Professional dispatches, longer form allowed.',
    warnThreshold: 0.9,
  },
  [PLATFORM_IDS.INSTAGRAM]: {
    id: PLATFORM_IDS.INSTAGRAM,
    label: 'Instagram',
    shortLabel: 'IG',
    charLimit: 2200,
    maxHashtags: 30,
    maxMedia: 10,
    mediaRequired: true,
    accent: '#A6425A',
    glyph: '◎',
    tone: 'Caption-led, at least one attachment expected.',
    warnThreshold: 0.9,
  },
}

export const PLATFORM_LIST = Object.values(PLATFORMS)

export function getPlatform(id) {
  return PLATFORMS[id] ?? null
}
