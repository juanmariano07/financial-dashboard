import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { PortfolioPosition } from '@/types/domain.types'
import { formatBRL } from '@/utils/formatters'

interface AllocationChartProps {
  positions: PortfolioPosition[]
}

const COLORS = ['#58a6ff', '#3fb950', '#d29922', '#f85149', '#a371f7']

export function AllocationChart({ positions }: AllocationChartProps) {
  const data = positions.map((position) => ({
    name: position.asset.ticker,
    value: position.currentValue,
    weight: position.weight,
  }))

  return (
    <section className="panel">
      <div className="panel__header">
        <h2>Alocação</h2>
        <span>Por valor atual</span>
      </div>

      <div className="chart chart--donut">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={96}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatBRL(Number(value))}
              contentStyle={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="legend-list">
        {data.map((item, index) => (
          <li key={item.name}>
            <span
              className="legend-list__dot"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{item.name}</span>
            <strong>{item.weight.toFixed(1)}%</strong>
          </li>
        ))}
      </ul>
    </section>
  )
}
