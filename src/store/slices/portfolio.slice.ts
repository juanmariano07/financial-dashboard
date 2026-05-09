import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { portfolioService } from '@/services/portfolio.service'
import type {
  CreateOrderPayload,
  PriceInterval,
} from '@/services/portfolio.service'
import type { Order, Portfolio, PricePoint } from '@/types/domain.types'

interface PortfolioState {
  portfolio: Portfolio | null
  orders: Order[]
  priceHistory: Record<string, PricePoint[]>
  selectedPositionId: string | null
  loading: {
    portfolio: boolean
    orders: boolean
    priceHistory: boolean
    createOrder: boolean
  }
  error: string | null
}

const initialState: PortfolioState = {
  portfolio: null,
  orders: [],
  priceHistory: {},
  selectedPositionId: null,
  loading: {
    portfolio: false,
    orders: false,
    priceHistory: false,
    createOrder: false,
  },
  error: null,
}

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (portfolioId: string, { rejectWithValue }) => {
    try {
      return await portfolioService.getPortfolio(portfolioId)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const fetchOrders = createAsyncThunk(
  'portfolio/fetchOrders',
  async (portfolioId: string, { rejectWithValue }) => {
    try {
      const result = await portfolioService.getOrders({ portfolioId })
      return result.data
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const fetchPriceHistory = createAsyncThunk(
  'portfolio/fetchPriceHistory',
  async (
    { ticker, interval }: { ticker: string; interval: PriceInterval },
    { rejectWithValue },
  ) => {
    try {
      const data = await portfolioService.getPriceHistory(ticker, interval)
      return { ticker, data }
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const createOrder = createAsyncThunk(
  'portfolio/createOrder',
  async (payload: CreateOrderPayload, { dispatch, rejectWithValue }) => {
    try {
      const order = await portfolioService.createOrder(payload)
      dispatch(fetchPortfolio(payload.portfolioId))
      return order
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setSelectedPosition(state, action: PayloadAction<string | null>) {
      state.selectedPositionId = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading.portfolio = true
        state.error = null
      })
      .addCase(fetchPortfolio.fulfilled, (state, { payload }) => {
        state.loading.portfolio = false
        state.portfolio = payload
      })
      .addCase(fetchPortfolio.rejected, (state, { payload }) => {
        state.loading.portfolio = false
        state.error = payload as string
      })

    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading.orders = true
      })
      .addCase(fetchOrders.fulfilled, (state, { payload }) => {
        state.loading.orders = false
        state.orders = payload
      })
      .addCase(fetchOrders.rejected, (state, { payload }) => {
        state.loading.orders = false
        state.error = payload as string
      })

    builder
      .addCase(fetchPriceHistory.pending, (state) => {
        state.loading.priceHistory = true
      })
      .addCase(fetchPriceHistory.fulfilled, (state, { payload }) => {
        state.loading.priceHistory = false
        state.priceHistory[payload.ticker] = payload.data
      })
      .addCase(fetchPriceHistory.rejected, (state) => {
        state.loading.priceHistory = false
      })

    builder
      .addCase(createOrder.pending, (state) => {
        state.loading.createOrder = true
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.loading.createOrder = false
        state.orders.unshift(payload)
      })
      .addCase(createOrder.rejected, (state, { payload }) => {
        state.loading.createOrder = false
        state.error = payload as string
      })
  },
})

export const { setSelectedPosition, clearError } = portfolioSlice.actions
export default portfolioSlice.reducer
