export enum AssetType {
  STOCK = 'STOCK',
  FII = 'FII',
  CRYPTO = 'CRYPTO',
  FIXED_INCOME = 'FIXED_INCOME',
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  EXECUTED = 'EXECUTED',
  CANCELLED = 'CANCELLED',
}

export interface Asset {
  id: string
  ticker: string
  name: string
  type: AssetType
  currentPrice: number
  previousClose: number
  change: number
  changePercent: number
  volume: number
  marketCap: number | null
  logoUrl: string | null
}

export interface PortfolioPosition {
  id: string
  asset: Asset
  quantity: number
  averagePrice: number
  totalInvested: number
  currentValue: number
  unrealizedPnl: number
  unrealizedPnlPercent: number
  weight: number
}

export interface Portfolio {
  id: string
  userId: string
  name: string
  positions: PortfolioPosition[]
  totalValue: number
  totalInvested: number
  totalPnl: number
  totalPnlPercent: number
  dailyChange: number
  dailyChangePercent: number
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  portfolioId: string
  asset: Pick<Asset, 'id' | 'ticker' | 'name'>
  side: OrderSide
  quantity: number
  price: number
  total: number
  status: OrderStatus
  executedAt: string | null
  createdAt: string
}

export interface PricePoint {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface MarketSummary {
  ibovespa: MarketIndex
  sp500: MarketIndex
  btcusd: MarketIndex
  dolarBrl: MarketIndex
  selic: number
  ipca: number
  updatedAt: string
}

export interface MarketIndex {
  name: string
  value: number
  change: number
  changePercent: number
}

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}
