import clsx from 'clsx'
import { formatPercent, isNegative, isPositive } from '@/utils/formatters'

interface ChangeBadgeProps {
  value: number
  variant?: 'percent' | 'currency'
}

export function ChangeBadge({ value, variant = 'percent' }: ChangeBadgeProps) {
  const label =
    variant === 'percent'
      ? formatPercent(value)
      : `${value >= 0 ? '+' : ''}${value.toFixed(2)}`

  return (
    <span
      className={clsx('badge', {
        'badge--positive': isPositive(value),
        'badge--negative': isNegative(value),
        'badge--neutral': !isPositive(value) && !isNegative(value),
      })}
    >
      {label}
    </span>
  )
}
