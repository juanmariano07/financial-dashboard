import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { marketService } from '@/services/market.service'
import type { Asset, MarketSummary } from '@/types/domain.types'

interface MarketState {
  summary: MarketSummary | null
  watchlist: Asset[]
  loading: boolean
  error: string | null
}

const initialState: MarketState = {
  summary: null,
  watchlist: [],
  loading: false,
  error: null,
}

export const fetchMarketSummary = createAsyncThunk(
  'market/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      return await marketService.getMarketSummary()
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const fetchWatchlist = createAsyncThunk(
  'market/fetchWatchlist',
  async (tickers: string[], { rejectWithValue }) => {
    try {
      return await marketService.getAssets(tickers)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMarketSummary.fulfilled, (state, { payload }) => {
        state.loading = false
        state.summary = payload
      })
      .addCase(fetchMarketSummary.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })
      .addCase(fetchWatchlist.fulfilled, (state, { payload }) => {
        state.watchlist = payload
      })
  },
})

export default marketSlice.reducer
