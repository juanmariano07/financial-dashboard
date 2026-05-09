import { NavLink, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore'
import { toggleTheme } from '@/store/slices/ui.slice'

export function AppLayout() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.ui.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand__mark">FD</span>
          <div>
            <strong>Financial Desk</strong>
            <span>Análise de carteira</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Navegação principal">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/portfolio">Carteira</NavLink>
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <span className="topbar__eyebrow">Home broker interno</span>
            <h1>Dashboard Financeiro</h1>
          </div>

          <button
            className="icon-button"
            type="button"
            title="Alternar tema"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'dark' ? 'L' : 'D'}
          </button>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
