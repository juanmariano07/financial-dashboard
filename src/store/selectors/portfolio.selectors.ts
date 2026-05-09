import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import type { AssetType } from '@/types/domain.types'

const selectPortfolioState = (state: RootState) => state.portfolio
const selectMarketState = (state: RootState) => state.market

export const selectPortfolio = createSelector(
  selectPortfolioState,
  (state) => state.portfolio,
)

export const selectPositions = createSelector(
  selectPortfolioState,
  (state) => state.portfolio?.positions ?? [],
)

export const selectSelectedPosition = createSelector(
  selectPortfolioState,
  (state) => {
    if (!state.selectedPositionId || !state.portfolio) return null
    return (
      state.portfolio.positions.find(
        (position) => position.id === state.selectedPositionId,
      ) ?? null
    )
  },
)

export const selectPositionsByType = createSelector(
  selectPositions,
  (positions) =>
    positions.reduce(
      (acc, position) => {
        const type = position.asset.type
        if (!acc[type]) acc[type] = []
        acc[type].push(position)
        return acc
      },
      {} as Record<AssetType, typeof positions>,
    ),
)

export const selectTopGainers = createSelector(selectPositions, (positions) =>
  [...positions]
    .sort((a, b) => b.unrealizedPnlPercent - a.unrealizedPnlPercent)
    .slice(0, 5),
)

export const selectTopLosers = createSelector(selectPositions, (positions) =>
  [...positions]
    .sort((a, b) => a.unrealizedPnlPercent - b.unrealizedPnlPercent)
    .slice(0, 5),
)

export const selectPortfolioLoading = createSelector(
  selectPortfolioState,
  (state) => state.loading.portfolio,
)

export const selectOrders = createSelector(
  selectPortfolioState,
  (state) => state.orders,
)

export const selectPriceHistory = (ticker: string) =>
  createSelector(
    selectPortfolioState,
    (state) => state.priceHistory[ticker] ?? [],
  )

export const selectMarketSummary = createSelector(
  selectMarketState,
  (state) => state.summary,
)

export const selectWatchlist = createSelector(
  selectMarketState,
  (state) => state.watchlist,
)
