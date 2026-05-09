export interface AssetDTO {
  id: string
  ticker: string
  company_name: string
  asset_type: string
  price: number
  previous_close: number
  volume: number
  market_cap: number | null
  logo_url: string | null
}

export interface PortfolioPositionDTO {
  id: string
  asset: AssetDTO
  qty: number
  avg_cost: number
}

export interface PortfolioDTO {
  id: string
  user_id: string
  name: string
  positions: PortfolioPositionDTO[]
  created_at: string
  updated_at: string
}

export interface OrderDTO {
  id: string
  portfolio_id: string
  asset_id: string
  asset_ticker: string
  asset_name: string
  side: string
  qty: number
  price: number
  status: string
  executed_at: string | null
  created_at: string
}

export interface PricePointDTO {
  t: string
  o: number
  h: number
  l: number
  c: number
  v: number
}

export interface MarketSummaryDTO {
  ibov: { value: number; change: number; change_pct: number }
  spx: { value: number; change: number; change_pct: number }
  btc: { value: number; change: number; change_pct: number }
  usd_brl: { value: number; change: number; change_pct: number }
  selic_rate: number
  ipca_rate: number
  updated_at: string
}

export interface PaginatedDTO<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface ApiResponseDTO<T> {
  success: boolean
  data: T
  message: string | null
  errors: string[] | null
}
