import { describe, expect, it } from 'vitest'
import type { AssetDTO, PortfolioDTO } from '@/dtos/api.dtos'
import { mapAssetDTOToAsset, mapPortfolioDTOToPortfolio } from './portfolio.mappers'
import { AssetType } from '@/types/domain.types'

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
})
