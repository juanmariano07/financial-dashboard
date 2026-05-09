import type {
  ApiResponseDTO,
  AssetDTO,
  MarketSummaryDTO,
  OrderDTO,
  PaginatedDTO,
  PortfolioDTO,
  PricePointDTO,
} from '@/dtos/api.dtos'

const assetDtos: AssetDTO[] = [
  {
    id: 'asset-petr4',
    ticker: 'PETR4',
    company_name: 'Petrobras PN',
    asset_type: 'stock',
    price: 38.92,
    previous_close: 37.84,
    volume: 68230000,
    market_cap: 515000000000,
    logo_url: null,
  },
  {
    id: 'asset-vale3',
    ticker: 'VALE3',
    company_name: 'Vale ON',
    asset_type: 'stock',
    price: 61.4,
    previous_close: 62.12,
    volume: 43120000,
    market_cap: 278000000000,
    logo_url: null,
  },
  {
    id: 'asset-itub4',
    ticker: 'ITUB4',
    company_name: 'Itau Unibanco PN',
    asset_type: 'stock',
    price: 34.18,
    previous_close: 33.51,
    volume: 35500000,
    market_cap: 331000000000,
    logo_url: null,
  },
  {
    id: 'asset-knri11',
    ticker: 'KNRI11',
    company_name: 'Kinea Renda Imobiliaria',
    asset_type: 'fii',
    price: 161.85,
    previous_close: 160.92,
    volume: 84600,
    market_cap: 4800000000,
    logo_url: null,
  },
  {
    id: 'asset-btc',
    ticker: 'BTC',
    company_name: 'Bitcoin',
    asset_type: 'crypto',
    price: 342500,
    previous_close: 336800,
    volume: 128000000,
    market_cap: 6700000000000,
    logo_url: null,
  },
]

const portfolioDto: PortfolioDTO = {
  id: 'portfolio-main',
  user_id: 'user-1',
  name: 'Carteira Principal',
  created_at: '2025-01-10T10:00:00.000Z',
  updated_at: new Date().toISOString(),
  positions: [
    { id: 'pos-petr4', asset: assetDtos[0], qty: 180, avg_cost: 32.1 },
    { id: 'pos-vale3', asset: assetDtos[1], qty: 120, avg_cost: 68.2 },
    { id: 'pos-itub4', asset: assetDtos[2], qty: 210, avg_cost: 29.4 },
    { id: 'pos-knri11', asset: assetDtos[3], qty: 44, avg_cost: 149.8 },
    { id: 'pos-btc', asset: assetDtos[4], qty: 0.08, avg_cost: 291000 },
  ],
}

const ordersDto: OrderDTO[] = [
  {
    id: 'order-1001',
    portfolio_id: 'portfolio-main',
    asset_id: 'asset-itub4',
    asset_ticker: 'ITUB4',
    asset_name: 'Itau Unibanco PN',
    side: 'buy',
    qty: 40,
    price: 33.7,
    status: 'executed',
    executed_at: '2026-05-08T16:12:00.000Z',
    created_at: '2026-05-08T16:10:00.000Z',
  },
  {
    id: 'order-1000',
    portfolio_id: 'portfolio-main',
    asset_id: 'asset-vale3',
    asset_ticker: 'VALE3',
    asset_name: 'Vale ON',
    side: 'sell',
    qty: 25,
    price: 62.05,
    status: 'executed',
    executed_at: '2026-05-06T13:22:00.000Z',
    created_at: '2026-05-06T13:19:00.000Z',
  },
]

const marketSummaryDto: MarketSummaryDTO = {
  ibov: { value: 133842.19, change: 879.31, change_pct: 0.66 },
  spx: { value: 5788.42, change: -18.72, change_pct: -0.32 },
  btc: { value: 342500, change: 5700, change_pct: 1.69 },
  usd_brl: { value: 5.07, change: -0.03, change_pct: -0.59 },
  selic_rate: 10.5,
  ipca_rate: 3.9,
  updated_at: new Date().toISOString(),
}

const MAX_HISTORY_POINTS = 24

const priceHistoryDtos: Record<string, PricePointDTO[]> = {
  PETR4: buildHistory('2026-04-08', 35.8, [
    0.2, 0.8, -0.4, 1.1, 0.5, 0.9, -0.2, 1.4, 0.7, 0.1, 1.2, -0.3,
  ]),
  VALE3: buildHistory('2026-04-08', 65.1, [
    -0.6, -0.8, 0.4, -1.2, 0.3, -0.7, -0.4, 0.5, -0.9, 0.2, -0.5, -0.2,
  ]),
  ITUB4: buildHistory('2026-04-08', 31.2, [
    0.3, 0.2, 0.5, -0.1, 0.6, 0.4, -0.2, 0.7, 0.2, 0.5, 0.3, 0.1,
  ]),
  KNRI11: buildHistory('2026-04-08', 158.2, [
    0.4, -0.1, 0.2, 0.3, 0.1, 0.5, -0.2, 0.4, 0.1, 0.3, 0.2, 0.1,
  ]),
  BTC: buildHistory('2026-04-08', 310000, [
    4200, -2800, 5300, 2100, -1600, 7600, -4300, 9100, 3200, -2200, 6800, 4100,
  ]),
}

function buildHistory(
  startDate: string,
  initialClose: number,
  movements: number[],
): PricePointDTO[] {
  return movements.reduce<PricePointDTO[]>((points, movement, index) => {
    const previous = points[index - 1]?.c ?? initialClose
    const close = Number((previous + movement).toFixed(2))
    const open = Number((previous - movement * 0.2).toFixed(2))
    const high = Number(
      (Math.max(open, close) + Math.abs(movement) * 0.6).toFixed(2),
    )
    const low = Number(
      (Math.min(open, close) - Math.abs(movement) * 0.4).toFixed(2),
    )
    const date = new Date(startDate)
    date.setDate(date.getDate() + index * 2)

    points.push({
      t: date.toISOString(),
      o: open,
      h: high,
      l: low,
      c: close,
      v: 1000000 + index * 83000,
    })
    return points
  }, [])
}

function respond<T>(data: T): Promise<ApiResponseDTO<T>> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({ success: true, data, message: null, errors: null })
    }, 250)
  })
}

export const mockApi = {
  async getMarketSummary() {
    return respond(marketSummaryDto)
  },

  async getAssets(tickers: string[]) {
    const normalizedTickers = tickers.map((ticker) => ticker.toUpperCase())
    return respond(
      assetDtos.filter((asset) => normalizedTickers.includes(asset.ticker)),
    )
  },

  async searchAssets(query: string) {
    const normalizedQuery = query.trim().toLowerCase()
    return respond(
      assetDtos.filter(
        (asset) =>
          asset.ticker.toLowerCase().includes(normalizedQuery) ||
          asset.company_name.toLowerCase().includes(normalizedQuery),
      ),
    )
  },

  async getPortfolio(portfolioId: string) {
    if (portfolioId !== portfolioDto.id) {
      throw new Error('Portfólio não encontrado')
    }
    simulateMarketTick()
    return respond(portfolioDto)
  },

  async getUserPortfolios() {
    return respond([portfolioDto])
  },

  async getOrders(page = 1, perPage = 20) {
    const start = (page - 1) * perPage
    const paginated: PaginatedDTO<OrderDTO> = {
      data: ordersDto.slice(start, start + perPage),
      total: ordersDto.length,
      page,
      per_page: perPage,
      total_pages: Math.ceil(ordersDto.length / perPage),
    }
    return respond(paginated)
  },

  async createOrder(payload: {
    portfolio_id: string
    asset_id: string
    side: string
    qty: number
    price: number
  }) {
    const asset = assetDtos.find((item) => item.id === payload.asset_id)
    if (!asset) {
      throw new Error('Ativo não encontrado')
    }

    applyOrderToPortfolio(payload, asset)

    const order: OrderDTO = {
      id: `order-${Date.now()}`,
      portfolio_id: payload.portfolio_id,
      asset_id: asset.id,
      asset_ticker: asset.ticker,
      asset_name: asset.company_name,
      side: payload.side.toLowerCase(),
      qty: payload.qty,
      price: payload.price,
      status: 'executed',
      executed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    ordersDto.unshift(order)
    return respond(order)
  },

  async getPriceHistory(ticker: string) {
    return respond(
      priceHistoryDtos[ticker.toUpperCase()] ?? priceHistoryDtos.PETR4,
    )
  },
}

function applyOrderToPortfolio(
  payload: {
    asset_id: string
    side: string
    qty: number
    price: number
  },
  asset: AssetDTO,
) {
  const position = portfolioDto.positions.find(
    (item) => item.asset.id === payload.asset_id,
  )
  const normalizedSide = payload.side.toUpperCase()

  if (normalizedSide === 'BUY') {
    if (!position) {
      portfolioDto.positions.push({
        id: `pos-${asset.ticker.toLowerCase()}`,
        asset,
        qty: roundQuantity(payload.qty),
        avg_cost: roundCurrency(payload.price),
      })
      portfolioDto.updated_at = new Date().toISOString()
      return
    }

    const currentCost = position.qty * position.avg_cost
    const orderCost = payload.qty * payload.price
    const nextQuantity = position.qty + payload.qty

    position.qty = roundQuantity(nextQuantity)
    position.avg_cost = roundCurrency((currentCost + orderCost) / nextQuantity)
    portfolioDto.updated_at = new Date().toISOString()
    return
  }

  if (normalizedSide === 'SELL' && position) {
    position.qty = roundQuantity(Math.max(position.qty - payload.qty, 0))
    portfolioDto.positions = portfolioDto.positions.filter(
      (item) => item.qty > 0,
    )
    portfolioDto.updated_at = new Date().toISOString()
  }
}

function simulateMarketTick() {
  const now = new Date().toISOString()

  assetDtos.forEach((asset) => {
    const volatility = asset.asset_type === 'crypto' ? 0.018 : 0.006
    const movement = 1 + (Math.random() - 0.5) * volatility
    asset.price = roundCurrency(Math.max(asset.price * movement, 0.01))
    asset.volume = Math.max(1, Math.round(asset.volume * (1 + Math.random() * 0.02)))

    const tickerHistory = priceHistoryDtos[asset.ticker] ?? []
    const previousClose =
      tickerHistory[tickerHistory.length - 1]?.c ?? asset.price
    const open = previousClose
    const close = asset.price
    const spread = Math.abs(close - open)

    const nextPoint = {
      t: now,
      o: open,
      h: roundCurrency(Math.max(open, close) + spread * 0.4),
      l: roundCurrency(Math.max(Math.min(open, close) - spread * 0.4, 0.01)),
      c: close,
      v: asset.volume,
    }

    const lastPoint = tickerHistory[tickerHistory.length - 1]
    if (lastPoint && isSameDay(lastPoint.t, now)) {
      tickerHistory[tickerHistory.length - 1] = {
        ...nextPoint,
        o: lastPoint.o,
        h: Math.max(lastPoint.h, nextPoint.h),
        l: Math.min(lastPoint.l, nextPoint.l),
      }
    } else {
      tickerHistory.push(nextPoint)
    }

    priceHistoryDtos[asset.ticker] = tickerHistory.slice(-MAX_HISTORY_POINTS)
  })

  updateMarketIndex(marketSummaryDto.ibov, 0.004)
  updateMarketIndex(marketSummaryDto.spx, 0.003)
  updateMarketIndex(marketSummaryDto.usd_brl, 0.002)
  marketSummaryDto.btc.value =
    assetDtos.find((asset) => asset.ticker === 'BTC')?.price ??
    marketSummaryDto.btc.value
  marketSummaryDto.btc.change = roundCurrency(
    marketSummaryDto.btc.value - assetDtos[4].previous_close,
  )
  marketSummaryDto.btc.change_pct = roundPercent(
    (marketSummaryDto.btc.change / assetDtos[4].previous_close) * 100,
  )
  marketSummaryDto.updated_at = now
  portfolioDto.updated_at = now
}

function updateMarketIndex(
  index: { value: number; change: number; change_pct: number },
  volatility: number,
) {
  const previous = index.value
  index.value = roundCurrency(
    index.value * (1 + (Math.random() - 0.5) * volatility),
  )
  index.change = roundCurrency(index.value - previous + index.change * 0.92)
  index.change_pct = roundPercent((index.change / (index.value - index.change)) * 100)
}

function roundCurrency(value: number): number {
  return Number(value.toFixed(2))
}

function roundPercent(value: number): number {
  return Number(value.toFixed(2))
}

function roundQuantity(value: number): number {
  return Number(value.toFixed(8))
}

function isSameDay(left: string, right: string): boolean {
  return left.slice(0, 10) === right.slice(0, 10)
}
