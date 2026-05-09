import { configureStore } from '@reduxjs/toolkit'
import portfolioReducer from './slices/portfolio.slice'
import marketReducer from './slices/market.slice'
import uiReducer from './slices/ui.slice'

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    market: marketReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types (e.g. dates stored as strings are fine)
        ignoredActions: ['portfolio/setPortfolio'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
