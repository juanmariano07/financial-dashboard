import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PricePoint } from '@/types/domain.types'
import { formatBRL, formatDate } from '@/utils/formatters'

interface PerformanceChartProps {
  ticker: string
  data: PricePoint[]
}

export function PerformanceChart({ ticker, data }: PerformanceChartProps) {
  const chartData = data.map((point) => ({
    date: formatDate(point.timestamp),
    close: point.close,
  }))

  return (
    <section className="panel panel--wide">
      <div className="panel__header">
        <div>
          <h2>Evolução de preço</h2>
          <span>Histórico + simulação acelerada</span>
        </div>
        <span>{ticker}</span>
      </div>

      <div className="chart chart--area">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#58a6ff" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#58a6ff" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border-subtle)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={72}
            />
            <Tooltip
              formatter={(value) => formatBRL(Number(value))}
              contentStyle={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
              }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#58a6ff"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
