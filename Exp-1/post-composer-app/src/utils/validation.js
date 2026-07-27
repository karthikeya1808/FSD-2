import { getPlatform } from '../config/platforms'

/**
 * Extracts hashtags (#word) from raw text.
 */
export function extractHashtags(text) {
  const matches = text.match(/#[A-Za-z0-9_]+/g)
  return matches ?? []
}

/**
 * Extracts @mentions from raw text.
 */
export function extractMentions(text) {
  const matches = text.match(/@[A-Za-z0-9_]+/g)
  return matches ?? []
}

/**
 * Core validation "strategy executor". Given post content, the target
 * platform id, and how many media attachments are staged, this returns a
 * structured result describing every rule that passed or failed.
 *
 * Returns:
 * {
 *   valid: boolean,
 *   errors: string[],
 *   warnings: string[],
 *   charCount: number,
 *   charLimit: number,
 *   remaining: number,
 *   percentUsed: number,
 *   hashtagCount: number,
 * }
 */
export function validatePost({ content = '', platformId, mediaCount = 0 }) {
  const platform = getPlatform(platformId)
  const errors = []
  const warnings = []

  if (!platform) {
    return {
      valid: false,
      errors: ['No platform selected.'],
      warnings: [],
      charCount: content.length,
      charLimit: 0,
      remaining: 0,
      percentUsed: 0,
      hashtagCount: 0,
    }
  }

  const trimmed = content.trim()
  const charCount = content.length
  const remaining = platform.charLimit - charCount
  const percentUsed = platform.charLimit === 0 ? 0 : charCount / platform.charLimit
  const hashtags = extractHashtags(content)

  if (trimmed.length === 0) {
    errors.push('Post content cannot be empty.')
  }

  if (charCount > platform.charLimit) {
    errors.push(
      `Content exceeds the ${platform.label} limit by ${charCount - platform.charLimit} character(s).`
    )
  } else if (percentUsed >= platform.warnThreshold) {
    warnings.push(`Approaching the ${platform.label} character limit.`)
  }

  if (hashtags.length > platform.maxHashtags) {
    errors.push(
      `Too many hashtags for ${platform.label} (max ${platform.maxHashtags}, found ${hashtags.length}).`
    )
  }

  if (mediaCount > platform.maxMedia) {
    errors.push(
      `Too many attachments for ${platform.label} (max ${platform.maxMedia}, found ${mediaCount}).`
    )
  }

  if (platform.mediaRequired && mediaCount === 0) {
    errors.push(`${platform.label} requires at least one media attachment.`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    charCount,
    charLimit: platform.charLimit,
    remaining,
    percentUsed,
    hashtagCount: hashtags.length,
  }
}

/**
 * Validates a post against MULTIPLE platforms at once (used when a draft is
 * cross-posted to more than one channel). Returns a map keyed by platform id.
 */
export function validatePostForPlatforms({ content, platformIds = [], mediaCount = 0 }) {
  return platformIds.reduce((acc, id) => {
    acc[id] = validatePost({ content, platformId: id, mediaCount })
    return acc
  }, {})
}
