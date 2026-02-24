import type { SankeyData } from '@/lib/supabase/types'

/**
 * Industry baseline: $5M GMV DTC women's shapewear brand
 * Sources:
 * - 功能女装痛点与欺诈模型.pdf (financial_flow_model)
 * - 北美DTC电商的双重绞杀.pdf (CAC/CPM data)
 * - 北美DTC女装市场的供需撕裂矩阵.pdf (return rates)
 */

export const EXECUTIVE_STATS = [
  {
    value: 849.9,
    suffix: 'B',
    prefix: '$',
    label: 'Projected Retail Returns',
    sublabel: '2025 NRF Forecast',
    source: 'National Retail Federation',
  },
  {
    value: 120,
    suffix: '%',
    prefix: '',
    label: 'CAC / AOV Ratio',
    sublabel: 'DTC Apparel Peak Season',
    source: 'Triple Whale, 8000+ brands',
  },
  {
    value: 72,
    suffix: '%',
    prefix: '',
    label: 'Friendly Fraud Rate',
    sublabel: 'Of All Chargebacks',
    source: 'Mastercard 2023 Report',
  },
  {
    value: 4.61,
    suffix: '×',
    prefix: '',
    label: 'True Cost Multiplier',
    sublabel: 'Per Dollar of Fraud',
    source: 'LexisNexis True Cost of Fraud',
  },
] as const

/**
 * Sankey diagram data — $5M GMV profit destruction flow
 *
 * Flow: GMV → Net Revenue (after COGS + Platform Fees)
 *     → Marketing/CAC drain
 *     → Returns drain (refund + processing cost + inventory disposal)
 *     → Chargebacks drain (capital loss + gateway penalties + friendly fraud)
 *     → Final Net Profit (devastatingly thin)
 */
export const SANKEY_MOCK_DATA: SankeyData = {
  nodes: [
    // Layer 0: Source
    { name: 'Gross Revenue ($5.0M)', nodeType: 'revenue' },
    // Layer 1: First deductions
    { name: 'COGS ($1.75M)', nodeType: 'expense' },
    { name: 'Gross Profit ($3.25M)', nodeType: 'revenue' },
    // Layer 2: Operating costs
    { name: 'Marketing / CAC ($1.1M)', nodeType: 'expense' },
    { name: 'Payment Processing ($145K)', nodeType: 'expense' },
    { name: 'Operating Margin ($2.005M)', nodeType: 'revenue' },
    // Layer 3: The return black hole
    { name: 'Refunds Issued ($1.22M)', nodeType: 'loss' },
    { name: 'Return Processing ($366K)', nodeType: 'loss' },
    { name: 'Inventory Disposal ($183K)', nodeType: 'loss' },
    { name: 'Post-Return Margin ($236K)', nodeType: 'revenue' },
    // Layer 4: Fraud & chargebacks
    { name: 'Chargeback Capital Loss ($38K)', nodeType: 'loss_critical' },
    { name: 'Gateway Penalties ($5.7K)', nodeType: 'loss_critical' },
    { name: 'Friendly Fraud ($31.5K)', nodeType: 'loss_critical' },
    { name: 'True Cost Multiplier ($155K)', nodeType: 'loss_critical' },
    // Layer 5: Final — 0.12% margin on $5M, devastatingly thin
    { name: 'Net Profit ($5.8K — 0.12%)', nodeType: 'final' },
  ],
  links: [
    // GMV → COGS + Gross Profit
    { source: 0, target: 1, value: 1750000, linkType: 'expense' },
    { source: 0, target: 2, value: 3250000, linkType: 'revenue' },
    // Gross Profit → Marketing + Payment + Operating Margin
    { source: 2, target: 3, value: 1100000, linkType: 'expense' },
    { source: 2, target: 4, value: 145000, linkType: 'expense' },
    { source: 2, target: 5, value: 2005000, linkType: 'revenue' },
    // Operating Margin → Returns + Post-Return
    { source: 5, target: 6, value: 1220000, linkType: 'loss' },
    { source: 5, target: 7, value: 366000, linkType: 'loss' },
    { source: 5, target: 8, value: 183000, linkType: 'loss' },
    { source: 5, target: 9, value: 236000, linkType: 'revenue' },
    // Post-Return → Chargebacks + Net Profit (pathetic remainder)
    { source: 9, target: 10, value: 38000, linkType: 'loss_critical' },
    { source: 9, target: 11, value: 5700, linkType: 'loss_critical' },
    { source: 9, target: 12, value: 31500, linkType: 'loss_critical' },
    { source: 9, target: 13, value: 155000, linkType: 'loss_critical' },
    { source: 9, target: 14, value: 5800, linkType: 'final' },
  ],
}

/**
 * Hero section metadata
 */
export const HERO_CONTENT = {
  title: 'The Silhouette Paradox',
  subtitle: 'When luxury aesthetics mask financial hemorrhage',
  tagline: 'A data narrative on the hidden cost of beauty in DTC fashion',
} as const
