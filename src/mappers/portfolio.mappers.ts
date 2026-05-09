import type {
  AssetDTO,
  MarketSummaryDTO,
  OrderDTO,
  PortfolioDTO,
  PortfolioPositionDTO,
  PricePointDTO,
} from '@/dtos/api.dtos'
import { AssetType, OrderSide, OrderStatus } from '@/types/domain.types'
import type {
  Asset,
  MarketIndex,
  MarketSummary,
  Order,
  Portfolio,
  PortfolioPosition,
  PricePoint,
} from '@/types/domain.types'

const ASSET_TYPE_MAP: Record<string, AssetType> = {
  stock: AssetType.STOCK,
  fii: AssetType.FII,
  crypto: AssetType.CRYPTO,
  fixed_income: AssetType.FIXED_INCOME,
}

const ORDER_SIDE_MAP: Record<string, OrderSide> = {
  buy: OrderSide.BUY,
  sell: OrderSide.SELL,
}

const ORDER_STATUS_MAP: Record<string, OrderStatus> = {
  pending: OrderStatus.PENDING,
  executed: OrderStatus.EXECUTED,
  cancelled: OrderStatus.CANCELLED,
}

export function mapAssetDTOToAsset(dto: AssetDTO): Asset {
  const change = dto.price - dto.previous_close
  const changePercent =
    dto.previous_close > 0 ? (change / dto.previous_close) * 100 : 0

  return {
    id: dto.id,
    ticker: dto.ticker,
    name: dto.company_name,
    type: ASSET_TYPE_MAP[dto.asset_type.toLowerCase()] ?? AssetType.STOCK,
    currentPrice: dto.price,
    previousClose: dto.previous_close,
    change: roundCurrency(change),
    changePercent: roundPercent(changePercent),
    volume: dto.volume,
    marketCap: dto.market_cap,
    logoUrl: dto.logo_url,
  }
}

export function mapPositionDTOToPosition(
  dto: PortfolioPositionDTO,
  portfolioTotalValue: number,
): PortfolioPosition {
  const asset = mapAssetDTOToAsset(dto.asset)
  const totalInvested = dto.qty * dto.avg_cost
  const currentValue = dto.qty * asset.currentPrice
  const unrealizedPnl = currentValue - totalInvested
  const unrealizedPnlPercent =
    totalInvested > 0 ? (unrealizedPnl / totalInvested) * 100 : 0
  const weight =
    portfolioTotalValue > 0 ? (currentValue / portfolioTotalValue) * 100 : 0

  return {
    id: dto.id,
    asset,
    quantity: dto.qty,
    averagePrice: dto.avg_cost,
    totalInvested: roundCurrency(totalInvested),
    currentValue: roundCurrency(currentValue),
    unrealizedPnl: roundCurrency(unrealizedPnl),
    unrealizedPnlPercent: roundPercent(unrealizedPnlPercent),
    weight: roundPercent(weight),
  }
}

export function mapPortfolioDTOToPortfolio(dto: PortfolioDTO): Portfolio {
  const rawPositions = dto.positions.map((position) => ({
    dto: position,
    currentValue: position.qty * position.asset.price,
    totalInvested: position.qty * position.avg_cost,
  }))

  const totalValue = rawPositions.reduce(
    (sum, position) => sum + position.currentValue,
    0,
  )
  const totalInvested = rawPositions.reduce(
    (sum, position) => sum + position.totalInvested,
    0,
  )
  const totalPnl = totalValue - totalInvested
  const totalPnlPercent =
    totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0
  const dailyChange = rawPositions.reduce(
    (sum, position) =>
      sum +
      (position.dto.asset.price - position.dto.asset.previous_close) *
        position.dto.qty,
    0,
  )
  const previousTotalValue = totalValue - dailyChange
  const dailyChangePercent =
    previousTotalValue > 0 ? (dailyChange / previousTotalValue) * 100 : 0

  return {
    id: dto.id,
    userId: dto.user_id,
    name: dto.name,
    positions: dto.positions.map((position) =>
      mapPositionDTOToPosition(position, totalValue),
    ),
    totalValue: roundCurrency(totalValue),
    totalInvested: roundCurrency(totalInvested),
    totalPnl: roundCurrency(totalPnl),
    totalPnlPercent: roundPercent(totalPnlPercent),
    dailyChange: roundCurrency(dailyChange),
    dailyChangePercent: roundPercent(dailyChangePercent),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

export function mapOrderDTOToOrder(dto: OrderDTO): Order {
  return {
    id: dto.id,
    portfolioId: dto.portfolio_id,
    asset: {
      id: dto.asset_id,
      ticker: dto.asset_ticker,
      name: dto.asset_name,
    },
    side: ORDER_SIDE_MAP[dto.side.toLowerCase()] ?? OrderSide.BUY,
    quantity: dto.qty,
    price: dto.price,
    total: roundCurrency(dto.qty * dto.price),
    status: ORDER_STATUS_MAP[dto.status.toLowerCase()] ?? OrderStatus.PENDING,
    executedAt: dto.executed_at,
    createdAt: dto.created_at,
  }
}

export function mapPricePointDTOToPricePoint(dto: PricePointDTO): PricePoint {
  return {
    timestamp: dto.t,
    open: dto.o,
    high: dto.h,
    low: dto.l,
    close: dto.c,
    volume: dto.v,
  }
}

export function mapMarketSummaryDTOToMarketSummary(
  dto: MarketSummaryDTO,
): MarketSummary {
  return {
    ibovespa: mapIndex('IBOVESPA', dto.ibov),
    sp500: mapIndex('S&P 500', dto.spx),
    btcusd: mapIndex('BTC/USD', dto.btc),
    dolarBrl: mapIndex('USD/BRL', dto.usd_brl),
    selic: dto.selic_rate,
    ipca: dto.ipca_rate,
    updatedAt: dto.updated_at,
  }
}

function mapIndex(
  name: string,
  raw: { value: number; change: number; change_pct: number },
): MarketIndex {
  return {
    name,
    value: raw.value,
    change: raw.change,
    changePercent: raw.change_pct,
  }
}

function roundCurrency(value: number): number {
  return Number(value.toFixed(2))
}

function roundPercent(value: number): number {
  return Number(value.toFixed(2))
}
