import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { createOrder } from '@/store/slices/portfolio.slice'
import type { PortfolioPosition } from '@/types/domain.types'
import { formatBRL } from '@/utils/formatters'

interface OrderTicketProps {
  positions: PortfolioPosition[]
}

export function OrderTicket({ positions }: OrderTicketProps) {
  const dispatch = useAppDispatch()
  const portfolio = useAppSelector((state) => state.portfolio.portfolio)
  const loading = useAppSelector((state) => state.portfolio.loading.createOrder)
  const [assetId, setAssetId] = useState(positions[0]?.asset.id ?? '')
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [quantity, setQuantity] = useState(10)
  const [feedback, setFeedback] = useState<string | null>(null)

  const selectedPosition = useMemo(
    () => positions.find((position) => position.asset.id === assetId),
    [assetId, positions],
  )

  useEffect(() => {
    if (!assetId && positions[0]) {
      setAssetId(positions[0].asset.id)
    }
  }, [assetId, positions])

  const price = selectedPosition?.asset.currentPrice ?? 0
  const total = quantity * price

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!portfolio || !selectedPosition || quantity <= 0) return

    if (side === 'SELL' && quantity > selectedPosition.quantity) {
      setFeedback(
        `Quantidade acima da posição disponível: ${selectedPosition.quantity}.`,
      )
      return
    }

    const result = await dispatch(
      createOrder({
        portfolioId: portfolio.id,
        assetId: selectedPosition.asset.id,
        side,
        quantity,
        price,
      }),
    )

    if (createOrder.fulfilled.match(result)) {
      setFeedback(
        `${side === 'BUY' ? 'Compra' : 'Venda'} de ${selectedPosition.asset.ticker} executada.`,
      )
    }
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <h2>Nova ordem</h2>
        <span>Simulada</span>
      </div>

      <form className="order-form" onSubmit={handleSubmit}>
        <label>
          Ativo
          <select value={assetId} onChange={(event) => setAssetId(event.target.value)}>
            {positions.map((position) => (
              <option key={position.asset.id} value={position.asset.id}>
                {position.asset.ticker}
              </option>
            ))}
          </select>
        </label>

        <div className="segmented-control">
          <button
            className={side === 'BUY' ? 'segmented-control__item--active' : ''}
            type="button"
            onClick={() => setSide('BUY')}
          >
            Compra
          </button>
          <button
            className={side === 'SELL' ? 'segmented-control__item--active' : ''}
            type="button"
            onClick={() => setSide('SELL')}
          >
            Venda
          </button>
        </div>

        <label>
          Quantidade
          <input
            min="0.01"
            max={side === 'SELL' ? selectedPosition?.quantity : undefined}
            step="0.01"
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
        </label>

        <div className="order-form__summary">
          <span>Preço estimado</span>
          <strong>{formatBRL(price)}</strong>
          <span>Total</span>
          <strong>{formatBRL(total)}</strong>
        </div>

        <button className="button button--primary" disabled={loading} type="submit">
          {loading ? 'Enviando...' : 'Enviar ordem'}
        </button>

        {feedback ? <p className="order-form__feedback">{feedback}</p> : null}
      </form>
    </section>
  )
}
