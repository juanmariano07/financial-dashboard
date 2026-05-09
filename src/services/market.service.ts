import { httpClient } from './http.client'
import type { ApiResponseDTO, AssetDTO, MarketSummaryDTO } from '@/dtos/api.dtos'
import { mockApi } from '@/data/mockApi'
import {
  mapAssetDTOToAsset,
  mapMarketSummaryDTOToMarketSummary,
} from '@/mappers/portfolio.mappers'
import type { Asset, MarketSummary } from '@/types/domain.types'

const shouldUseMocks = import.meta.env.VITE_USE_MOCKS !== 'false'

export const marketService = {
  async getMarketSummary(): Promise<MarketSummary> {
    if (shouldUseMocks) {
      const data = await mockApi.getMarketSummary()
      return mapMarketSummaryDTOToMarketSummary(data.data)
    }

    const { data } =
      await httpClient.get<ApiResponseDTO<MarketSummaryDTO>>('/market/summary')
    return mapMarketSummaryDTOToMarketSummary(data.data)
  },

  async getAssets(tickers: string[]): Promise<Asset[]> {
    if (shouldUseMocks) {
      const data = await mockApi.getAssets(tickers)
      return data.data.map(mapAssetDTOToAsset)
    }

    const { data } = await httpClient.get<ApiResponseDTO<AssetDTO[]>>(
      '/assets',
      { params: { tickers: tickers.join(',') } },
    )
    return data.data.map(mapAssetDTOToAsset)
  },

  async searchAssets(query: string): Promise<Asset[]> {
    if (shouldUseMocks) {
      const data = await mockApi.searchAssets(query)
      return data.data.map(mapAssetDTOToAsset)
    }

    const { data } = await httpClient.get<ApiResponseDTO<AssetDTO[]>>(
      '/assets/search',
      { params: { q: query } },
    )
    return data.data.map(mapAssetDTOToAsset)
  },
}
