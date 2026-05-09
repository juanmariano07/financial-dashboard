import { OrderSide, OrderStatus } from '@/types/domain.types'
import { useAppSelector } from '@/hooks/useStore'
import { formatBRL, formatDateTime } from '@/utils/formatters'

export function RecentOrders() {
  const orders = useAppSelector((state) => state.portfolio.orders)

  return (
    <section className="panel">
      <div className="panel__header">
        <h2>Ordens recentes</h2>
        <span>{orders.length} registros</span>
      </div>

      <div className="order-list">
        {orders.map((order) => (
          <article className="order-list__item" key={order.id}>
            <div>
              <strong>{order.asset.ticker}</strong>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            <div>
              <span>{order.side === OrderSide.BUY ? 'Compra' : 'Venda'}</span>
              <strong>{formatBRL(order.total)}</strong>
            </div>
            <span className="badge badge--neutral">
              {order.status === OrderStatus.EXECUTED ? 'Executada' : 'Pendente'}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
