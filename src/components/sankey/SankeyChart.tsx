'use client'

import { useMemo, useCallback, useState, useRef } from 'react'
import {
  sankey,
  sankeyLinkHorizontal,
  sankeyLeft,
  type SankeyGraph,
} from 'd3-sankey'
import type { SankeyData, SankeyNode, SankeyLink } from '@/lib/supabase/types'
import { SANKEY_COLORS } from '@/styles/tokens'
import SankeyTooltip, { type TooltipData } from './SankeyTooltip'

interface SankeyChartProps {
  data: SankeyData
  revealProgress: number
}

const MARGIN = { top: 32, right: 260, bottom: 32, left: 160 }
const INNER_WIDTH = 840
const INNER_HEIGHT = 560
const FULL_WIDTH = INNER_WIDTH + MARGIN.left + MARGIN.right
const FULL_HEIGHT = INNER_HEIGHT + MARGIN.top + MARGIN.bottom
const NODE_WIDTH = 16
const NODE_PADDING = 32

type LayoutNode = SankeyNode & {
  x0: number
  x1: number
  y0: number
  y1: number
  value: number
  index: number
  depth: number
}
type LayoutLink = SankeyLink & {
  source: LayoutNode
  target: LayoutNode
  width: number
  y0: number
  y1: number
  index: number
}

/** Progressive reveal: links appear left-to-right by source depth */
function getLinkOpacity(link: LayoutLink, revealProgress: number): number {
  const depthProgress = link.source.depth / 4
  const fadeStart = revealProgress * 1.4 - 0.15
  return Math.min(1, Math.max(0, (fadeStart - depthProgress) * 4))
}

function getNodeOpacity(node: LayoutNode, revealProgress: number): number {
  const depthProgress = node.depth / 5
  const fadeStart = revealProgress * 1.4 - 0.1
  return Math.min(1, Math.max(0, (fadeStart - depthProgress) * 5))
}

/** Calculate % of $5M GMV */
function pctOfGMV(value: number): string {
  return `${((value / 5_000_000) * 100).toFixed(1)}%`
}

/** Format value as compact string */
function formatValue(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toLocaleString()}`
}

/** Contextual narrative per node type */
const FLOW_NARRATIVES: Record<string, string> = {
  'COGS': 'Raw materials, manufacturing, and freight — the unavoidable baseline.',
  'Gross Profit': 'What remains after production costs. Still looks healthy.',
  'Marketing / CAC': 'Meta CPMs up 47% YoY. Every customer costs more to acquire.',
  'Payment Processing': 'Stripe/Shopify Payments: 2.9% + $0.30 per transaction.',
  'Operating Margin': 'Before returns and fraud eat through it.',
  'Refunds Issued': '24.4% return rate — the shapewear sizing problem is structural.',
  'Return Processing': 'Shipping, inspection, repackaging. $30 average per return.',
  'Inventory Disposal': 'Returned shapewear cannot be resold. Hygiene regulations.',
  'Post-Return Margin': 'The thin remainder before fraud takes its cut.',
  'Chargeback Capital Loss': 'Direct capital loss from disputed transactions.',
  'Gateway Penalties': '$15 per chargeback + monitoring program fees.',
  'Friendly Fraud': '72% of chargebacks are "friendly" — customers who received the product.',
  'True Cost Multiplier': 'LexisNexis: every $1 of fraud costs $4.61 in total damage.',
  'Net Profit': 'What survives. 0.12% margin on $5M. $5,800.',
}

export default function SankeyChart({ data, revealProgress }: SankeyChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{
    data: TooltipData
    x: number
    y: number
    visible: boolean
  }>({ data: { label: '', amount: '', pctOfGMV: '', type: 'revenue' }, x: 0, y: 0, visible: false })
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [hoveredLink, setHoveredLink] = useState<number | null>(null)

  const { nodes, links } = useMemo(() => {
    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeAlign(sankeyLeft)
      .nodeWidth(NODE_WIDTH)
      .nodePadding(NODE_PADDING)
      .extent([
        [MARGIN.left, MARGIN.top],
        [MARGIN.left + INNER_WIDTH, MARGIN.top + INNER_HEIGHT],
      ])
      .nodeSort((a, b) => {
        const order = { revenue: 0, expense: 1, loss: 2, loss_critical: 3, final: 4 }
        return (order[a.nodeType] ?? 9) - (order[b.nodeType] ?? 9)
      })

    const graph = sankeyGenerator({
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({ ...d, value: Math.abs(d.value) })),
    })

    return graph as SankeyGraph<SankeyNode, SankeyLink>
  }, [data])

  const linkPath = sankeyLinkHorizontal()
  const typedNodes = nodes as unknown as LayoutNode[]
  const typedLinks = links as unknown as LayoutLink[]

  const getLabelSide = useCallback((node: LayoutNode): 'left' | 'right' => {
    if (node.depth === 0) return 'left'
    return 'right'
  }, [])

  const parseNodeLabel = useCallback(
    (name: string): { label: string; amount: string } => {
      const match = name.match(/^(.+?)\s*\((.+)\)$/)
      if (match) return { label: match[1], amount: match[2] }
      return { label: name, amount: '' }
    },
    []
  )

  /** Handle node hover */
  const handleNodeEnter = useCallback(
    (e: React.MouseEvent, node: LayoutNode, index: number) => {
      const { label } = parseNodeLabel(node.name)
      setHoveredNode(index)
      setTooltip({
        data: {
          label,
          amount: formatValue(node.value),
          pctOfGMV: pctOfGMV(node.value),
          type: node.nodeType,
          flow: FLOW_NARRATIVES[label],
        },
        x: e.clientX,
        y: e.clientY,
        visible: true,
      })
    },
    [parseNodeLabel]
  )

  /** Handle link hover */
  const handleLinkEnter = useCallback(
    (e: React.MouseEvent, link: LayoutLink, index: number) => {
      const srcLabel = parseNodeLabel(link.source.name).label
      const tgtLabel = parseNodeLabel(link.target.name).label
      setHoveredLink(index)
      setTooltip({
        data: {
          label: `${srcLabel} → ${tgtLabel}`,
          amount: formatValue(link.value as number),
          pctOfGMV: pctOfGMV(link.value as number),
          type: link.target.nodeType,
          flow: FLOW_NARRATIVES[tgtLabel],
        },
        x: e.clientX,
        y: e.clientY,
        visible: true,
      })
    },
    [parseNodeLabel]
  )

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (tooltip.visible) {
      setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))
    }
  }, [tooltip.visible])

  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null)
    setHoveredLink(null)
    setTooltip((prev) => ({ ...prev, visible: false }))
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <svg
        viewBox={`0 0 ${FULL_WIDTH} ${FULL_HEIGHT}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Sankey diagram showing $5M GMV profit destruction flow"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          {/* Per-link gradients: source color → target color */}
          {typedLinks.map((link, i) => {
            const sourceColor =
              SANKEY_COLORS[link.source.nodeType] || SANKEY_COLORS.expense
            const targetColor =
              SANKEY_COLORS[link.target.nodeType] || SANKEY_COLORS.expense
            return (
              <linearGradient
                key={`lg-${i}`}
                id={`link-gradient-${i}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor={sourceColor} />
                <stop offset="100%" stopColor={targetColor} />
              </linearGradient>
            )
          })}

          {/* Animated arterial bleed for loss_critical */}
          <linearGradient
            id="bleed-flow"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#8B0000" stopOpacity={0.7}>
              <animate
                attributeName="stopColor"
                values="#8B0000;#B22222;#8B0000"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#800000" stopOpacity={0.9}>
              <animate
                attributeName="stopColor"
                values="#800000;#A52A2A;#800000"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#722F37" stopOpacity={0.6}>
              <animate
                attributeName="stopColor"
                values="#722F37;#8B0000;#722F37"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          {/* Glow filter for Net Profit node */}
          <filter id="final-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Links layer */}
        <g className="sankey-links">
          {typedLinks.map((link, i) => {
            const opacity = getLinkOpacity(link, revealProgress)
            const isLossCritical = link.linkType === 'loss_critical'
            const isLoss = link.linkType === 'loss'
            const isHovered = hoveredLink === i
            const isRelated =
              hoveredNode !== null &&
              (link.source.index === hoveredNode || link.target.index === hoveredNode)

            const strokeColor = isLossCritical
              ? 'url(#bleed-flow)'
              : `url(#link-gradient-${i})`

            const baseOpacity = isLossCritical
              ? 0.7
              : isLoss
                ? 0.5
                : 0.35

            // Dim non-related links when hovering
            const hoverMod =
              hoveredNode !== null || hoveredLink !== null
                ? isHovered || isRelated
                  ? 1.4
                  : 0.15
                : 1

            return (
              <path
                key={i}
                d={linkPath(link as never) || ''}
                fill="none"
                stroke={strokeColor}
                strokeWidth={Math.max(1.5, link.width || 1)}
                strokeOpacity={opacity * baseOpacity * hoverMod}
                style={{
                  transition: 'stroke-opacity 0.3s cubic-bezier(0.45, 0, 0.15, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => handleLinkEnter(e, link, i)}
                onMouseLeave={handleMouseLeave}
              />
            )
          })}
        </g>

        {/* Nodes layer */}
        <g className="sankey-nodes">
          {typedNodes.map((node, i) => {
            const nodeOpacity = getNodeOpacity(node, revealProgress)
            const nodeColor =
              SANKEY_COLORS[node.nodeType] || SANKEY_COLORS.expense
            const nodeHeight = Math.max(3, node.y1 - node.y0)
            const isFinal = node.nodeType === 'final'
            const isRevenue = node.nodeType === 'revenue'
            const side = getLabelSide(node)
            const { label, amount } = parseNodeLabel(node.name)
            const isHovered = hoveredNode === i

            // Label positioning
            const labelX =
              side === 'left' ? node.x0 - 12 : node.x1 + 12
            const labelAnchor = side === 'left' ? 'end' : 'start'
            const labelY = (node.y0 + node.y1) / 2

            // Dim non-hovered nodes
            const hoverMod =
              hoveredNode !== null
                ? isHovered
                  ? 1
                  : 0.35
                : 1

            return (
              <g
                key={i}
                style={{
                  opacity: nodeOpacity * hoverMod,
                  transition:
                    'opacity 0.3s cubic-bezier(0.45, 0, 0.15, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => handleNodeEnter(e, node, i)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Node bar */}
                <rect
                  x={node.x0}
                  y={node.y0}
                  width={node.x1 - node.x0}
                  height={nodeHeight}
                  fill={nodeColor}
                  rx={2}
                  filter={isFinal ? 'url(#final-glow)' : undefined}
                />

                {/* Invisible hit area for narrow nodes */}
                <rect
                  x={node.x0 - 8}
                  y={node.y0 - 4}
                  width={node.x1 - node.x0 + 16}
                  height={nodeHeight + 8}
                  fill="transparent"
                />

                {/* Label: name */}
                <text
                  x={labelX}
                  y={labelY - (amount ? 6 : 0)}
                  dy="0.35em"
                  textAnchor={labelAnchor}
                  fill={
                    isFinal
                      ? '#F5F0EB'
                      : isRevenue
                        ? 'var(--color-cream)'
                        : 'var(--color-text-secondary)'
                  }
                  fontSize={isFinal ? 13 : 11}
                  fontWeight={isFinal ? 700 : isRevenue ? 500 : 400}
                  fontFamily="var(--font-sans)"
                >
                  {label}
                </text>

                {/* Label: amount + % */}
                {amount && (
                  <text
                    x={labelX}
                    y={labelY + 10}
                    dy="0.35em"
                    textAnchor={labelAnchor}
                    fill={
                      isFinal
                        ? '#FFBE98'
                        : node.nodeType === 'loss_critical'
                          ? '#FF6B6B'
                          : node.nodeType === 'loss'
                            ? '#A05050'
                            : 'var(--color-text-secondary)'
                    }
                    fontSize={10}
                    fontWeight={isFinal ? 600 : 400}
                    fontFamily="var(--font-sans)"
                    className="tabular-nums"
                    opacity={0.85}
                  >
                    {amount}
                    {node.value && node.depth > 0 && !isFinal && (
                      <tspan opacity={0.6}>
                        {' '}
                        · {pctOfGMV(node.value)} of GMV
                      </tspan>
                    )}
                  </text>
                )}

                {/* Final node: extra emphasis */}
                {isFinal && (
                  <>
                    <line
                      x1={node.x1 + 12}
                      y1={labelY + 24}
                      x2={node.x1 + 80}
                      y2={labelY + 24}
                      stroke="#FFBE98"
                      strokeWidth={1}
                      opacity={0.4}
                    />
                    <text
                      x={node.x1 + 12}
                      y={labelY + 40}
                      fill="#808080"
                      fontSize={9}
                      fontFamily="var(--font-sans)"
                      letterSpacing="0.05em"
                    >
                      ON $5,000,000 GROSS REVENUE
                    </text>
                  </>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      {/* Tooltip (DOM layer, outside SVG) */}
      <SankeyTooltip
        data={tooltip.data}
        x={tooltip.x}
        y={tooltip.y}
        visible={tooltip.visible}
      />
    </div>
  )
}
