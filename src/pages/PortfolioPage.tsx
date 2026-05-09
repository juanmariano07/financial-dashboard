import { useEffect } from 'react'
import { AllocationChart } from '@/components/charts/AllocationChart'
import { PositionTable } from '@/components/portfolio/PositionTable'
import { StatCard } from '@/components/ui/StatCard'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import {
  selectPortfolio,
  selectPositions,
  selectSelectedPosition,
  selectTopGainers,
  selectTopLosers,
} from '@/store/selectors/portfolio.selectors'
import {
  fetchPortfolio,
  setSelectedPosition,
} from '@/store/slices/portfolio.slice'
import type { PortfolioPosition } from '@/types/domain.types'
import { formatBRL } from '@/utils/formatters'

const MAIN_PORTFOLIO_ID = 'portfolio-main'

export function PortfolioPage() {
  const dispatch = useAppDispatch()
  const portfolio = useAppSelector(selectPortfolio)
  const positions = useAppSelector(selectPositions)
  const selectedPosition = useAppSelector(selectSelectedPosition)
  const topGainers = useAppSelector(selectTopGainers)
  const topLosers = useAppSelector(selectTopLosers)

  useEffect(() => {
    if (!portfolio) {
      dispatch(fetchPortfolio(MAIN_PORTFOLIO_ID))
    }
  }, [dispatch, portfolio])

  function handleSelectPosition(position: PortfolioPosition) {
    dispatch(setSelectedPosition(position.id))
  }

  if (!portfolio) {
    return <div className="empty-state">Carregando carteira...</div>
  }

  return (
    <div className="dashboard">
      <section className="kpi-grid" aria-label="Detalhes da carteira">
        <StatCard
          label="Capital investido"
          value={formatBRL(portfolio.totalInvested)}
        />
        <StatCard label="Valor atual" value={formatBRL(portfolio.totalValue)} />
        <StatCard
          label="Maior alta"
          value={topGainers[0]?.asset.ticker ?? '-'}
          detail={
            topGainers[0]
              ? `${topGainers[0].unrealizedPnlPercent.toFixed(2)}%`
              : undefined
          }
        />
        <StatCard
          label="Maior queda"
          value={topLosers[0]?.asset.ticker ?? '-'}
          detail={
            topLosers[0]
              ? `${topLosers[0].unrealizedPnlPercent.toFixed(2)}%`
              : undefined
          }
        />
      </section>

      <section className="dashboard-grid dashboard-grid--portfolio">
        <PositionTable
          positions={positions}
          selectedId={selectedPosition?.id ?? null}
          onSelect={handleSelectPosition}
        />
        <AllocationChart positions={positions} />
      </section>
    </div>
  )
}
