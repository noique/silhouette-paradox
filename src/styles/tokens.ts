/**
 * Design tokens — luxury data aesthetic
 * Color system: Peach Fuzz warmth → gray luxury scale → burgundy/blood loss scale
 */

export const COLORS = {
  // Revenue / Brand warmth
  peach: '#FFBE98',
  gold: '#E8C57A',

  // Luxury neutral scale
  cream: '#F5F0EB',
  warmGray1: '#D3D3D3',
  warmGray2: '#A9A9A9',
  warmGray3: '#808080',

  // Loss escalation
  warning: '#FF6B6B',
  burgundy: '#722F37',
  blood: '#8B0000',
  abyss: '#800000',

  // Background
  bg: '#0A0A0A',
  bgWarm: '#1A1614',

  // Text
  textPrimary: '#F5F0EB',
  textSecondary: '#A9A9A9',
  textAccent: '#FFBE98',
} as const

/**
 * Luxury easing curves — silk unfolding, never bouncing
 */
export const EASE = {
  luxuryIn: 'cubic-bezier(0.22, 1, 0.36, 1)',
  luxuryOut: 'cubic-bezier(0.64, 0, 0.78, 0)',
  luxuryInOut: 'cubic-bezier(0.45, 0, 0.15, 1)',
  // GSAP-specific
  countUp: 'power2.out',
  fabricWave: 'sine.inOut',
  reveal: 'power3.out',
} as const

/**
 * Duration tokens (seconds)
 */
export const DURATION = {
  sectionTransition: 1.0,
  countUp: 1.8,
  stagger: 0.08,
  fadeIn: 0.8,
  sankeyReveal: 2.5,
} as const

/**
 * Spacing tokens (px, 8px grid)
 */
export const SPACING = {
  maxContentWidth: 1200,
  horizontalPadding: 80,
  sectionGap: 160,
  cardGap: 32,
} as const

/**
 * Sankey color mapping by link/node type
 */
export const SANKEY_COLORS = {
  revenue: COLORS.peach,
  expense: COLORS.warmGray2,
  loss: COLORS.burgundy,
  loss_critical: COLORS.blood,
  final: COLORS.warmGray3,
} as const

export type NodeType = keyof typeof SANKEY_COLORS
