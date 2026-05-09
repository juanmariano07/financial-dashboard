import { httpClient } from './http.client'
import type {
  ApiResponseDTO,
  OrderDTO,
  PaginatedDTO,
  PricePointDTO,
  PortfolioDTO,
} from '@/dtos/api.dtos'
import { mockApi } from '@/data/mockApi'
import {
  mapOrderDTOToOrder,
  mapPortfolioDTOToPortfolio,
  mapPricePointDTOToPricePoint,
} from '@/mappers/portfolio.mappers'
import type { Order, Portfolio, PricePoint } from '@/types/domain.types'

export interface CreateOrderPayload {
  portfolioId: string
  assetId: string
  side: 'BUY' | 'SELL'
  quantity: number
  price: number
}

export interface GetOrdersParams {
  portfolioId: string
  page?: number
  perPage?: number
}

export type PriceInterval = '1d' | '1w' | '1mo' | '3mo' | '1y'

const shouldUseMocks = import.meta.env.VITE_USE_MOCKS !== 'false'

export const portfolioService = {
  async getPortfolio(portfolioId: string): Promise<Portfolio> {
    if (shouldUseMocks) {
      const data = await mockApi.getPortfolio(portfolioId)
      return mapPortfolioDTOToPortfolio(data.data)
    }

    const { data } = await httpClient.get<ApiResponseDTO<PortfolioDTO>>(
      `/portfolios/${portfolioId}`,
    )
    return mapPortfolioDTOToPortfolio(data.data)
  },

  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    if (shouldUseMocks) {
      const data = await mockApi.getUserPortfolios()
      return data.data.map(mapPortfolioDTOToPortfolio)
    }

    const { data } = await httpClient.get<ApiResponseDTO<PortfolioDTO[]>>(
      `/users/${userId}/portfolios`,
    )
    return data.data.map(mapPortfolioDTOToPortfolio)
  },

  async getOrders(params: GetOrdersParams): Promise<PaginatedDTO<Order>> {
    const { portfolioId, page = 1, perPage = 20 } = params

    if (shouldUseMocks) {
      const data = await mockApi.getOrders(page, perPage)
      return {
        ...data.data,
        data: data.data.data.map(mapOrderDTOToOrder),
      }
    }

    const { data } = await httpClient.get<
      ApiResponseDTO<PaginatedDTO<OrderDTO>>
    >(`/portfolios/${portfolioId}/orders`, {
      params: { page, per_page: perPage },
    })

    return {
      ...data.data,
      data: data.data.data.map(mapOrderDTOToOrder),
    }
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    if (shouldUseMocks) {
      const data = await mockApi.createOrder({
        portfolio_id: payload.portfolioId,
        asset_id: payload.assetId,
        side: payload.side,
        qty: payload.quantity,
        price: payload.price,
      })
      return mapOrderDTOToOrder(data.data)
    }

    const { data } = await httpClient.post<ApiResponseDTO<OrderDTO>>(
      '/orders',
      {
        portfolio_id: payload.portfolioId,
        asset_id: payload.assetId,
        side: payload.side,
        qty: payload.quantity,
        price: payload.price,
      },
    )
    return mapOrderDTOToOrder(data.data)
  },

  async getPriceHistory(
    ticker: string,
    interval: PriceInterval = '1mo',
  ): Promise<PricePoint[]> {
    if (shouldUseMocks) {
      const data = await mockApi.getPriceHistory(ticker)
      return data.data.map(mapPricePointDTOToPricePoint)
    }

    const { data } = await httpClient.get<ApiResponseDTO<PricePointDTO[]>>(
      `/assets/${ticker}/history`,
      { params: { interval } },
    )
    return data.data.map(mapPricePointDTOToPricePoint)
  },
}
