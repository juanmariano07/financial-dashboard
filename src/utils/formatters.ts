const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

const COMPACT = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatBRL(value: number): string {
  return BRL.format(value)
}

export function formatUSD(value: number): string {
  return USD.format(value)
}

export function formatCompact(value: number): string {
  return COMPACT.format(value)
}

export function formatPercent(value: number, decimals = 2): string {
  const formatted = value.toFixed(decimals)
  const sign = value >= 0 ? '+' : ''
  return `${sign}${formatted}%`
}

export function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}`
}

export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoString))
}

export function formatDateTime(isoString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString))
}

export function isPositive(value: number): boolean {
  return value > 0
}

export function isNegative(value: number): boolean {
  return value < 0
}

export function getPnlColor(value: number): string {
  if (value > 0) return 'var(--color-positive)'
  if (value < 0) return 'var(--color-negative)'
  return 'var(--color-neutral)'
}
