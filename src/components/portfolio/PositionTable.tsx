import clsx from 'clsx'
import type { PortfolioPosition } from '@/types/domain.types'
import { ChangeBadge } from '@/components/ui/ChangeBadge'
import { formatBRL, formatCompact } from '@/utils/formatters'

interface PositionTableProps {
  positions: PortfolioPosition[]
  selectedId: string | null
  onSelect: (position: PortfolioPosition) => void
}

export function PositionTable({
  positions,
  selectedId,
  onSelect,
}: PositionTableProps) {
  return (
    <section className="panel panel--wide position-panel">
      <div className="panel__header">
        <h2>Posições</h2>
        <span>{positions.length} ativos</span>
      </div>

      <div className="table-scroll">
        <table className="position-table">
          <thead>
            <tr>
              <th>Ativo</th>
              <th>Quantidade</th>
              <th>Preço médio</th>
              <th>Valor atual</th>
              <th>Resultado</th>
              <th>Peso</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr
                key={position.id}
                className={clsx({
                  'position-table__row--active': selectedId === position.id,
                })}
                onClick={() => onSelect(position)}
              >
                <td data-label="Ativo">
                  <div className="position-table__asset">
                    <strong>{position.asset.ticker}</strong>
                    <span>{position.asset.name}</span>
                  </div>
                </td>
                <td data-label="Quantidade">{position.quantity}</td>
                <td data-label="Preço médio">
                  {formatBRL(position.averagePrice)}
                </td>
                <td data-label="Valor atual">
                  {formatBRL(position.currentValue)}
                </td>
                <td data-label="Resultado">
                  <div className="position-table__result">
                    <strong>{formatBRL(position.unrealizedPnl)}</strong>
                    <ChangeBadge value={position.unrealizedPnlPercent} />
                  </div>
                </td>
                <td data-label="Peso">{position.weight.toFixed(1)}%</td>
                <td data-label="Volume">{formatCompact(position.asset.volume)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
