import { describe, expect, it } from 'vitest'
import type { AssetDTO, OrderDTO, PortfolioDTO } from '@/dtos/api.dtos'
import {
  mapAssetDTOToAsset,
  mapOrderDTOToOrder,
  mapPortfolioDTOToPortfolio,
} from './portfolio.mappers'
import { AssetType, OrderSide, OrderStatus } from '@/types/domain.types'

const assetDto: AssetDTO = {
  id: 'asset-1',
  ticker: 'ITUB4',
  company_name: 'Itau Unibanco PN',
  asset_type: 'stock',
  price: 34,
  previous_close: 32,
  volume: 1000,
  market_cap: 1000000,
  logo_url: null,
}

describe('portfolio mappers', () => {
  it('maps an API asset DTO to a domain asset', () => {
    const asset = mapAssetDTOToAsset(assetDto)

    expect(asset).toMatchObject({
      id: 'asset-1',
      ticker: 'ITUB4',
      name: 'Itau Unibanco PN',
      type: AssetType.STOCK,
      currentPrice: 34,
      change: 2,
      changePercent: 6.25,
    })
  })

  it('calculates portfolio totals and position weights', () => {
    const dto: PortfolioDTO = {
      id: 'portfolio-1',
      user_id: 'user-1',
      name: 'Carteira teste',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-02T00:00:00.000Z',
      positions: [
        { id: 'pos-1', asset: assetDto, qty: 10, avg_cost: 30 },
        {
          id: 'pos-2',
          asset: { ...assetDto, id: 'asset-2', ticker: 'PETR4', price: 20 },
          qty: 5,
          avg_cost: 18,
        },
      ],
    }

    const portfolio = mapPortfolioDTOToPortfolio(dto)

    expect(portfolio.totalValue).toBe(440)
    expect(portfolio.totalInvested).toBe(390)
    expect(portfolio.totalPnl).toBe(50)
    expect(portfolio.positions[0].weight).toBe(77.27)
  })

  it('guards asset percentage change when previous close is zero', () => {
    const asset = mapAssetDTOToAsset({
      ...assetDto,
      previous_close: 0,
    })

    expect(asset.change).toBe(34)
    expect(asset.changePercent).toBe(0)
  })

  it('falls back to stock when asset type is unknown', () => {
    const asset = mapAssetDTOToAsset({
      ...assetDto,
      asset_type: 'unknown_type',
    })

    expect(asset.type).toBe(AssetType.STOCK)
  })

  it('handles empty portfolios without division errors', () => {
    const portfolio = mapPortfolioDTOToPortfolio({
      id: 'portfolio-empty',
      user_id: 'user-1',
      name: 'Carteira vazia',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-02T00:00:00.000Z',
      positions: [],
    })

    expect(portfolio.positions).toEqual([])
    expect(portfolio.totalValue).toBe(0)
    expect(portfolio.totalInvested).toBe(0)
    expect(portfolio.totalPnlPercent).toBe(0)
  })

  it('maps unknown order status to pending as a safe default', () => {
    const dto: OrderDTO = {
      id: 'order-1',
      portfolio_id: 'portfolio-1',
      asset_id: 'asset-1',
      asset_ticker: 'ITUB4',
      asset_name: 'Itau Unibanco PN',
      side: 'sell',
      qty: 3,
      price: 34,
      status: 'unexpected_status',
      executed_at: null,
      created_at: '2026-01-02T00:00:00.000Z',
    }

    const order = mapOrderDTOToOrder(dto)

    expect(order.side).toBe(OrderSide.SELL)
    expect(order.status).toBe(OrderStatus.PENDING)
    expect(order.total).toBe(102)
  })
})
