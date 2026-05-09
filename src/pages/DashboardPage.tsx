import { useEffect, useMemo } from 'react'
import { AllocationChart } from '@/components/charts/AllocationChart'
import { PerformanceChart } from '@/components/charts/PerformanceChart'
import { OrderTicket } from '@/components/portfolio/OrderTicket'
import { PositionTable } from '@/components/portfolio/PositionTable'
import { RecentOrders } from '@/components/portfolio/RecentOrders'
import { ChangeBadge } from '@/components/ui/ChangeBadge'
import { StatCard } from '@/components/ui/StatCard'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import {
  selectMarketSummary,
  selectPortfolio,
  selectPortfolioLoading,
  selectPositions,
  selectPriceHistory,
  selectSelectedPosition,
  selectWatchlist,
} from '@/store/selectors/portfolio.selectors'
import { fetchMarketSummary, fetchWatchlist } from '@/store/slices/market.slice'
import {
  fetchOrders,
  fetchPortfolio,
  fetchPriceHistory,
  setSelectedPosition,
} from '@/store/slices/portfolio.slice'
import type { Asset, PortfolioPosition } from '@/types/domain.types'
import {
  formatBRL,
  formatDateTime,
  formatPercent,
  isPositive,
} from '@/utils/formatters'

const MAIN_PORTFOLIO_ID = 'portfolio-main'
const DEFAULT_WATCHLIST = ['PETR4', 'VALE3', 'ITUB4', 'KNRI11', 'BTC']
const LIVE_REFRESH_MS = 5000

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const portfolio = useAppSelector(selectPortfolio)
  const positions = useAppSelector(selectPositions)
  const selectedPosition = useAppSelector(selectSelectedPosition)
  const loading = useAppSelector(selectPortfolioLoading)
  const marketSummary = useAppSelector(selectMarketSummary)
  const watchlist = useAppSelector(selectWatchlist)
  const selectedTicker =
    selectedPosition?.asset.ticker ?? positions[0]?.asset.ticker ?? 'PETR4'
  const priceHistorySelector = useMemo(
    () => selectPriceHistory(selectedTicker),
    [selectedTicker],
  )
  const priceHistory = useAppSelector(priceHistorySelector)

  useEffect(() => {
    dispatch(fetchPortfolio(MAIN_PORTFOLIO_ID))
    dispatch(fetchOrders(MAIN_PORTFOLIO_ID))
    dispatch(fetchMarketSummary())
    dispatch(fetchWatchlist(DEFAULT_WATCHLIST))
  }, [dispatch])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      dispatch(fetchPortfolio(MAIN_PORTFOLIO_ID))
      dispatch(fetchMarketSummary())
      dispatch(fetchWatchlist(DEFAULT_WATCHLIST))
      dispatch(fetchPriceHistory({ ticker: selectedTicker, interval: '1mo' }))
    }, LIVE_REFRESH_MS)

    return () => window.clearInterval(intervalId)
  }, [dispatch, selectedTicker])

  useEffect(() => {
    if (!selectedPosition && positions[0]) {
      dispatch(setSelectedPosition(positions[0].id))
    }
  }, [dispatch, positions, selectedPosition])

  useEffect(() => {
    if (selectedTicker) {
      dispatch(fetchPriceHistory({ ticker: selectedTicker, interval: '1mo' }))
    }
  }, [dispatch, selectedTicker])

  function handleSelectPosition(position: PortfolioPosition) {
    dispatch(setSelectedPosition(position.id))
  }

  if (loading && !portfolio) {
    return <div className="empty-state">Carregando carteira...</div>
  }

  if (!portfolio) {
    return (
      <div className="empty-state">Não foi possível carregar a carteira.</div>
    )
  }

  return (
    <div className="dashboard">
      <section className="kpi-grid" aria-label="Resumo da carteira">
        <StatCard
          label="Valor total"
          value={formatBRL(portfolio.totalValue)}
          detail={portfolio.name}
          trend={<ChangeBadge value={portfolio.totalPnlPercent} />}
        />
        <StatCard
          label="Resultado acumulado"
          value={formatBRL(portfolio.totalPnl)}
          detail={
            isPositive(portfolio.totalPnl)
              ? 'Carteira no positivo'
              : 'Abaixo do custo'
          }
          trend={<span>{formatPercent(portfolio.totalPnlPercent)}</span>}
        />
        <StatCard
          label="Variação diária"
          value={formatBRL(portfolio.dailyChange)}
          detail="Marcação a mercado"
          trend={<ChangeBadge value={portfolio.dailyChangePercent} />}
        />
        <StatCard
          label="Última atualização"
          value={formatDateTime(portfolio.updatedAt)}
          valueClassName="stat-card__value--datetime"
          detail={`${positions.length} posições monitoradas`}
        />
      </section>

      <section className="live-status" aria-label="Status da simulação">
        <span className="live-status__dot" />
        <strong>Simulação acelerada de mercado</strong>
        <span>Atualiza a cada {LIVE_REFRESH_MS / 1000}s</span>
      </section>

      <section className="market-strip" aria-label="Mercado">
        {marketSummary ? (
          <>
            <MarketPill
              label="IBOV"
              value={marketSummary.ibovespa.value.toLocaleString('pt-BR')}
              change={marketSummary.ibovespa.changePercent}
            />
            <MarketPill
              label="S&P 500"
              value={marketSummary.sp500.value.toLocaleString('pt-BR')}
              change={marketSummary.sp500.changePercent}
            />
            <MarketPill
              label="BTC"
              value={formatBRL(marketSummary.btcusd.value)}
              change={marketSummary.btcusd.changePercent}
            />
            <MarketPill
              label="USD/BRL"
              value={marketSummary.dolarBrl.value.toFixed(2)}
              change={marketSummary.dolarBrl.changePercent}
            />
            <MarketPill label="Selic" value={`${marketSummary.selic.toFixed(2)}%`} />
            <MarketPill label="IPCA" value={`${marketSummary.ipca.toFixed(2)}%`} />
          </>
        ) : (
          <span>Carregando mercado...</span>
        )}
      </section>

      <section className="dashboard-grid">
        <PerformanceChart ticker={selectedTicker} data={priceHistory} />
        <AllocationChart positions={positions} />
        <PositionTable
          positions={positions}
          selectedId={selectedPosition?.id ?? null}
          onSelect={handleSelectPosition}
        />
        <aside className="side-stack">
          <OrderTicket positions={positions} />
          <WatchlistPanel assets={watchlist} />
          <RecentOrders />
        </aside>
      </section>
    </div>
  )
}

interface MarketPillProps {
  label: string
  value: string
  change?: number
}

function MarketPill({ label, value, change }: MarketPillProps) {
  return (
    <article className="market-pill">
      <span>{label}</span>
      <strong>{value}</strong>
      {typeof change === 'number' ? <ChangeBadge value={change} /> : null}
    </article>
  )
}

interface WatchlistPanelProps {
  assets: Asset[]
}

function WatchlistPanel({ assets }: WatchlistPanelProps) {
  return (
    <section className="panel">
      <div className="panel__header">
        <h2>Lista de observação</h2>
        <span>{assets.length} ativos</span>
      </div>

      <div className="watchlist">
        {assets.map((asset) => (
          <article className="watchlist__item" key={asset.id}>
            <div>
              <strong>{asset.ticker}</strong>
              <span>{asset.name}</span>
            </div>
            <div>
              <strong>{formatBRL(asset.currentPrice)}</strong>
              <ChangeBadge value={asset.changePercent} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
