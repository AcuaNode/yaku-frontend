import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import yakuLogo from '../assets/yaku-logo.jpeg'
import '../styles/dashboard.css'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )},
  { path: '/estanques', label: 'Estanques', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.778l.707-.707M18.364 5.636l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  )},
  { path: '/equipos', label: 'Equipos', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
    </svg>
  )},
  { path: '/operadores', label: 'Operadores', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
  { path: '/notificaciones', label: 'Notificaciones', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )},
  { path: '/configuracion', label: 'Configuración', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
]

const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '10px 20px',
  color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
  backgroundColor: isActive ? 'rgba(56,189,248,0.15)' : 'transparent',
  borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
  textDecoration: 'none', fontSize: '14px',
  fontWeight: isActive ? 600 : 400,
  transition: 'all 0.15s',
})

interface Props { children: React.ReactNode }

export default function DashboardLayout({ children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  const navLinks = (
    <nav style={{ flex: 1, padding: '12px 0' }}>
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => setDrawerOpen(false)}
          style={({ isActive }) => navLinkStyle(isActive)}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  )

  const logoBlock = (
    <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <img src={yakuLogo} alt="YacuControl" style={{ width: '130px', mixBlendMode: 'lighten', opacity: 0.9 }} />
    </div>
  )

  return (
    <div className="dash-root">

      {/* Sidebar fijo — visible en desktop via CSS */}
      <aside className="dash-sidebar">
        {logoBlock}
        {navLinks}
      </aside>

      {/* Drawer — visible en mobile via CSS */}
      {drawerOpen && <div className="dash-overlay" onClick={() => setDrawerOpen(false)} />}
      <aside className={`dash-sidebar-drawer ${drawerOpen ? 'open' : 'closed'}`}>
        {logoBlock}
        {navLinks}
      </aside>

      {/* Main */}
      <div className="dash-main">

        {/* Topbar */}
        <header className="dash-topbar">

          {/* Hamburger — solo mobile via CSS */}
          <button
            className="dash-hamburger"
            onClick={() => setDrawerOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', alignItems: 'center', padding: '4px' }}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: '380px', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', gap: '8px', backgroundColor: '#f8fafc' }}>
            <svg width="15" height="15" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar estanque o alerta..."
              style={{ border: 'none', outline: 'none', fontSize: '13px', color: '#334155', backgroundColor: 'transparent', width: '100%' }}
            />
          </div>

          {/* User */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="user-name" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Admin Principal</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>SUPERUSUARIO</div>
            </div>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
              A
            </div>
            <button onClick={() => navigate('/')} title="Cerrar sesión" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: '4px' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="dash-content">
          {children}
        </main>
      </div>
    </div>
  )
}
