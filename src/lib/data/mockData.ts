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
    source: 'National Retail Federation, 2025',
    benchmark: { healthy: '<$400B', industryAvg: '$743B (2024)' },
    implication:
      'Return infrastructure is now a larger cost center than marketing for most DTC brands.',
  },
  {
    value: 120,
    suffix: '%',
    prefix: '',
    label: 'CAC / AOV Ratio',
    sublabel: 'DTC Apparel Peak Season',
    source: 'Triple Whale, 8,000+ brands, 2024',
    benchmark: { healthy: '<60%', industryAvg: '85%' },
    implication:
      'Every new customer acquisition is a guaranteed loss on first purchase.',
  },
  {
    value: 72,
    suffix: '%',
    prefix: '',
    label: 'Friendly Fraud Rate',
    sublabel: 'Of All Chargebacks',
    source: 'Mastercard Global Chargeback Report, 2023',
    benchmark: { healthy: '<40%', industryAvg: '61%' },
    implication:
      'Three-quarters of chargebacks come from real customers — virtually unpreventable at scale.',
  },
  {
    value: 4.61,
    suffix: '×',
    prefix: '',
    label: 'True Cost Multiplier',
    sublabel: 'Per Dollar of Fraud',
    source: 'LexisNexis True Cost of Fraud, 2024',
    benchmark: { healthy: '<2.5×', industryAvg: '3.75×' },
    implication:
      'Each fraudulent dollar triggers a $4.61 cascade through fees, penalties, and lost merchandise.',
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

/**
 * Market Pulse — The DTC Growth Trap
 * Shows market-level metrics that reveal the CAC/AOV inversion
 */
export const MARKET_PULSE_DATA = {
  sectionLabel: 'Act I — The Illusion',
  title: 'The DTC Growth Trap',
  subtitle:
    'Revenue is climbing. Profitability is collapsing. The gap between them is where brands die.',
  metrics: [
    {
      label: 'DTC Apparel Market',
      value: 44.2,
      suffix: 'B',
      prefix: '$',
      growth: '+14.2%',
      context: 'YoY growth',
      barWidth: 100,
      color: 'var(--color-peach)',
    },
    {
      label: 'Meta CPM (Avg)',
      value: 14.08,
      suffix: '',
      prefix: '$',
      growth: '+47%',
      context: 'vs. 2021',
      barWidth: 85,
      color: 'var(--color-gold)',
    },
    {
      label: 'Average CAC',
      value: 82,
      suffix: '',
      prefix: '$',
      growth: '+61%',
      context: 'vs. 2021',
      barWidth: 72,
      color: 'var(--color-warning)',
    },
    {
      label: 'Average AOV',
      value: 68,
      suffix: '',
      prefix: '$',
      growth: '-3%',
      context: 'vs. 2021',
      barWidth: 58,
      color: 'var(--color-warm-gray-2)',
    },
  ],
  trendData: {
    years: ['2021', '2022', '2023', '2024', '2025F'] as readonly string[],
    cac: [51, 58, 68, 78, 82] as readonly number[],
    aov: [70, 69, 68, 68, 68] as readonly number[],
    crossoverYear: '2024',
    crossoverNote:
      'Q3 2024: For the first time in DTC apparel history, the average customer acquisition cost surpassed the average order value. The growth trap snapped shut.',
  },
  crossingInsight:
    'In Q3 2024, the average DTC apparel CAC crossed above AOV for the first time. Brands now pay more to acquire a customer than that customer spends.',
} as const

/**
 * Unit Economics — Anatomy of a single $68 shapewear order
 * Waterfall chart data showing progressive cost deductions
 */
export const UNIT_ECONOMICS_DATA = {
  sectionLabel: 'Act II — The Anatomy',
  title: 'One Order. $68. Dissected.',
  subtitle:
    'Follow a single shapewear order from checkout to true profit.',
  steps: [
    { label: 'Order Revenue', value: 68.0, type: 'positive' as const, running: 68.0 },
    { label: 'COGS', value: -23.8, type: 'negative' as const, running: 44.2 },
    { label: 'Payment Processing', value: -2.27, type: 'negative' as const, running: 41.93 },
    { label: 'Fulfillment', value: -6.5, type: 'negative' as const, running: 35.43 },
    { label: 'Marketing / CAC', value: -14.96, type: 'negative' as const, running: 20.47 },
    { label: 'Return Probability', value: -16.59, type: 'loss' as const, running: 3.88 },
    { label: 'Fraud Probability', value: -3.8, type: 'loss_critical' as const, running: 0.08 },
    { label: 'Contribution Margin', value: 0.08, type: 'final' as const, running: 0.08 },
  ],
  annotations: {
    'COGS': 'Nylon/spandex fabric, seamless knitting, QC, ocean freight.',
    'Marketing / CAC': 'Meta CPMs up 47% YoY. $14.96 per order on a $68 AOV.',
    'Return Probability': '24.4% chance this order comes back. Expected cost: $16.59.',
    'Fraud Probability': '2.1% chargeback risk \u00d7 $4.61 multiplier.',
    'Contribution Margin': '$0.08 per order. That is not a typo.',
  } as Record<string, string>,
} as const

/**
 * Return & Fraud Deep Dive — The 24.4% Tax
 * Proportion bars + cost breakdown
 */
export const RETURN_FRAUD_DATA = {
  sectionLabel: 'Act IV — The Tax',
  title: 'The 24.4% Tax',
  subtitle:
    'Returns and fraud are not line items. They are a structural disease.',
  returnDonut: {
    title: 'Why Shapewear Gets Returned',
    totalLabel: '24.4%',
    totalSublabel: 'Return Rate',
    segments: [
      { label: 'Sizing / Fit Issues', pct: 42, color: '#FFBE98' },
      { label: 'Compression Discomfort', pct: 23, color: '#E8C57A' },
      { label: 'Fabric Feel / Texture', pct: 15, color: '#D3D3D3' },
      { label: 'Color Mismatch', pct: 8, color: '#A9A9A9' },
      { label: 'Wardrobing / Intentional', pct: 12, color: '#722F37' },
    ],
  },
  fraudDonut: {
    title: 'Chargeback Anatomy',
    totalLabel: '2.1%',
    totalSublabel: 'Chargeback Rate',
    segments: [
      { label: 'Friendly Fraud', pct: 72, color: '#FF6B6B' },
      { label: 'True Fraud', pct: 18, color: '#8B0000' },
      { label: 'Merchant Error', pct: 10, color: '#A9A9A9' },
    ],
  },
  costPerReturn: [
    { label: 'Refund Amount', value: 68.0 },
    { label: 'Return Shipping', value: 8.5 },
    { label: 'Inspection + Repackaging', value: 12.0 },
    { label: 'Inventory Write-off', value: 10.2 },
  ],
  costPerReturnTotal: 98.7,
  costInsight: 'Every return costs 145% of the original order value.',
  costComparison: {
    orderValue: 68.0,
    returnCost: 98.7,
    multiplier: '145%',
    overage: 30.7,
    framing: 'Every return costs $30.70 MORE than the customer originally paid.',
  },
} as const

/**
 * The Verdict — Five Uncomfortable Truths
 * Animated insight cards with progressive revelation
 */
export const VERDICT_DATA = {
  sectionLabel: 'Act V — The Reckoning',
  title: 'Five Uncomfortable Truths',
  subtitle: 'What the pitch deck will never show the investors.',
  truths: [
    {
      number: '01',
      headline: 'You are paying $82 to acquire a customer worth $68.',
      body: 'The CAC/AOV inversion is not seasonal. It is structural. Meta CPMs rose 47% in three years while apparel AOV declined 3%.',
      metric: { value: '120%', label: 'CAC / AOV Ratio' },
      accentColor: '#FFBE98',
      cause: 'Meta CPM inflation compounding against a race-to-bottom AOV in commoditized DTC apparel.',
      implication: 'First-purchase profitability is structurally impossible without repeat purchases — but shapewear LTV is chronically low.',
      action: 'Shift 30%+ of acquisition spend to retention and loyalty programs to amortize CAC across lifetime value.',
    },
    {
      number: '02',
      headline: 'One in four orders comes back to destroy your margin.',
      body: 'Shapewear return rates run 24.4% — double the apparel average. Each return costs 145% of the order value when you include processing, shipping, and inventory write-offs.',
      metric: { value: '24.4%', label: 'Return Rate' },
      accentColor: '#E8C57A',
      cause: 'Compression garments have inherently unpredictable fit — online sizing tools cannot replicate the physical try-on experience.',
      implication: 'Every 4th order is not revenue. It is a $98.70 liability disguised as a sale.',
      action: 'Invest in virtual try-on technology and build granular size recommendation algorithms from return data.',
    },
    {
      number: '03',
      headline: '72% of your chargebacks are from real customers.',
      body: 'Friendly fraud — customers who received the product but dispute the charge — accounts for nearly three-quarters of all chargebacks. It is functionally unpreventable.',
      metric: { value: '72%', label: 'Friendly Fraud' },
      accentColor: '#FF6B6B',
      cause: 'Frictionless dispute processes at banks incentivize chargebacks over returns. The customer learns it is easier to dispute than to ship back.',
      implication: 'Traditional fraud prevention tools are useless — you cannot flag your own customers as fraudsters.',
      action: 'Implement rapid-refund workflows that preempt chargebacks, and build chargeback representation capabilities.',
    },
    {
      number: '04',
      headline: 'Every dollar of fraud costs you $4.61.',
      body: 'The LexisNexis True Cost of Fraud multiplier includes chargeback fees, gateway penalties, manual review labor, lost merchandise, and increased processing rates.',
      metric: { value: '4.61\u00d7', label: 'Cost Multiplier' },
      accentColor: '#722F37',
      cause: 'The fraud cost multiplier is not the fraud itself — it is the cascading penalty structure built by payment processors and card networks.',
      implication: 'A single $68 chargeback actually costs $313. At scale, this destroys post-return margin entirely.',
      action: 'Negotiate processor rates aggressively and maintain chargeback ratios below 0.65% to avoid penalty tiers.',
    },
    {
      number: '05',
      headline: 'Your real margin is 0.12%, not the 40% in your model.',
      body: 'After COGS, CAC, payment processing, returns, and fraud cascade through a $5M GMV brand, $5,800 survives. That is one month of a junior employee\u2019s salary.',
      metric: { value: '$5.8K', label: 'Net on $5M GMV' },
      accentColor: '#800000',
      cause: 'Financial models treat returns and fraud as line-item percentages. In reality, they compound through every layer of the P&L.',
      implication: 'Most DTC shapewear brands are operationally insolvent — surviving on venture capital and the illusion of gross margin.',
      action: 'Rebuild the P&L from contribution margin up, not gross margin down. Kill every SKU that cannot sustain a positive unit contribution.',
    },
  ],
} as const

/**
 * Closing section — Recommendations and final thesis
 */
export const CLOSING_DATA = {
  recommendations: [
    {
      number: '01',
      title: 'Radical SKU Rationalization',
      body: 'Every additional SKU multiplies your return surface area. Analyze per-SKU contribution margin after returns and fraud. The bottom 40% of SKUs by return rate are likely destroying more value than they create. Cut them. The brands that survive will be the ones that chose depth over breadth.',
    },
    {
      number: '02',
      title: 'Return-Proof the Product',
      body: 'Virtual try-on, AI-driven size recommendation engines, and detailed compression guides can reduce return rates by 8\u201312 percentage points. The ROI is not incremental — it is existential. Every prevented return saves $98.70 in fully-loaded cost.',
    },
    {
      number: '03',
      title: 'CAC Diversification Beyond Meta',
      body: 'When a single platform controls 60%+ of your acquisition and raises CPMs 47% in three years, you are not running a brand — you are renting one. Organic content, referral programs, wholesale B2B channels, and owned media reduce blended CAC and build defensibility.',
    },
  ],
} as const
