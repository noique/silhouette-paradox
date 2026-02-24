/**
 * Supabase database types for 《轮廓悖论》
 */

export type NodeType = 'revenue' | 'expense' | 'loss' | 'loss_critical' | 'final'
export type LinkType = NodeType

export interface FinancialFlowNode {
  id: string
  scenario_id: string
  period: string
  node_key: string
  label: string
  node_type: NodeType
  sort_order: number
}

export interface FinancialFlowLink {
  id: string
  scenario_id: string
  period: string
  source_key: string
  target_key: string
  value: number
  link_type: LinkType
  meta: Record<string, unknown>
}

/**
 * Transformed types for visx/sankey rendering
 */
export interface SankeyNode {
  name: string
  nodeType: NodeType
}

export interface SankeyLink {
  source: number | string
  target: number | string
  value: number
  linkType: LinkType
}

export interface SankeyData {
  nodes: SankeyNode[]
  links: SankeyLink[]
}
