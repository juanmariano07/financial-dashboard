import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  valueClassName?: string
  detail?: string
  trend?: ReactNode
}

export function StatCard({
  label,
  value,
  valueClassName,
  detail,
  trend,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <span className="stat-card__label">{label}</span>
      <strong className={`stat-card__value ${valueClassName ?? ''}`}>
        {value}
      </strong>
      <div className="stat-card__footer">
        {detail ? <span>{detail}</span> : <span />}
        {trend}
      </div>
    </article>
  )
}
