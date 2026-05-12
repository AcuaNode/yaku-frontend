import { useState, useMemo } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { useNotificaciones } from '../hooks/useNotificaciones'
import type { Notificacion, TipoNotificacion } from '../domain/notificacion/Notificacion'

const PAGE_SIZE = 4
const TOTAL_MOCK = 128

// ── Icons ──────────────────────────────────────────────────────────────────
const TIPO_CONFIG: Record<TipoNotificacion, { iconBg: string; iconColor: string; icon: React.ReactNode }> = {
  ALERTA: {
    iconBg: '#fff7ed', iconColor: '#ef4444',
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>,
  },
  TEMPERATURA: {
    iconBg: '#ccfbf1', iconColor: '#0d9488',
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>,
  },
  MANTENIMIENTO: {
    iconBg: '#f1f5f9', iconColor: '#94a3b8',
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  OPERADOR: {
    iconBg: '#f1f5f9', iconColor: '#94a3b8',
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
  },
}

// ── Notification item ───────────────────────────────────────────────────────
function NotificacionItem({ n }: { n: Notificacion }) {
  const cfg = TIPO_CONFIG[n.tipo]
  const esLeida = n.estado === 'LEIDA'
  const badgeBg = esLeida ? '#f1f5f9' : (n.esCritica ? '#ef4444' : '#0d9488')
  const badgeColor = esLeida ? '#94a3b8' : '#fff'
  const badgeText = esLeida ? 'LEÍDA' : 'NO LEÍDA'
  const tagColor = esLeida ? '#94a3b8' : '#0d9488'
  const tagBorder = esLeida ? '1px solid #e2e8f0' : '1px solid #99f6e4'
  const tagBg = esLeida ? 'transparent' : '#f0fdf9'

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '22px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
      {/* Icon */}
      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: cfg.iconBg, color: cfg.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '15px', fontWeight: esLeida ? 500 : 700, color: esLeida ? '#64748b' : '#0f172a' }}>{n.titulo}</span>
          <span style={{ backgroundColor: badgeBg, color: badgeColor, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            {badgeText}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: esLeida ? '#94a3b8' : '#475569', margin: '0 0 12px', lineHeight: 1.6 }}>{n.descripcion}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: tagColor, backgroundColor: tagBg, border: tagBorder, borderRadius: '20px', padding: '2px 10px', fontWeight: 500 }}>
            <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {n.estanque}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#94a3b8' }}>
            <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {n.tiempo}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
type FiltroEstado = 'todas' | 'no_leidas' | 'leidas'

export default function NotificacionesPage() {
  const { notificaciones, loading, marcarTodasLeidas } = useNotificaciones()
  const [estanqueFiltro, setEstanqueFiltro] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todas')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [page, setPage] = useState(1)

  const estanques = useMemo(() => ['todos', ...Array.from(new Set(notificaciones.map(n => n.estanque)))], [notificaciones])

  const filtradas = useMemo(() => {
    return notificaciones.filter(n => {
      if (estanqueFiltro !== 'todos' && n.estanque !== estanqueFiltro) return false
      if (filtroEstado === 'no_leidas' && n.estado !== 'NO_LEIDA') return false
      if (filtroEstado === 'leidas' && n.estado !== 'LEIDA') return false
      return true
    })
  }, [notificaciones, estanqueFiltro, filtroEstado])

  const totalPages = Math.max(1, Math.ceil(filtradas.length / PAGE_SIZE))
  const paginated = filtradas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function limpiarFiltros() {
    setEstanqueFiltro('todos')
    setFiltroEstado('todas')
    setFechaDesde('')
    setFechaHasta('')
    setPage(1)
  }

  function cambiarFiltroEstado(f: FiltroEstado) {
    setFiltroEstado(f)
    setPage(1)
  }

  const inputStyle: React.CSSProperties = { padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#334155', backgroundColor: '#fff', outline: 'none', width: '130px' }
  const labelStyle: React.CSSProperties = { fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }

  return (
    <DashboardLayout>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Notificaciones</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Monitoreo de alertas críticas y eventos del sistema en tiempo real.</p>
        </div>
        <button
          onClick={marcarTodasLeidas}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f4c35', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '11px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0a3526')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0f4c35')}
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Marcar todas como leídas
        </button>
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '20px 24px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>

          {/* Estanque */}
          <div>
            <label style={labelStyle}>Estanque</label>
            <div style={{ position: 'relative' }}>
              <select
                value={estanqueFiltro}
                onChange={e => { setEstanqueFiltro(e.target.value); setPage(1) }}
                style={{ ...inputStyle, width: '180px', appearance: 'none', paddingRight: '32px', cursor: 'pointer' }}
              >
                <option value="todos">Todos los estanques</option>
                {estanques.filter(e => e !== 'todos').map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <svg width="14" height="14" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Rango de fecha */}
          <div>
            <label style={labelStyle}>Rango de Fecha</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} style={inputStyle} />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>al</span>
              <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Estado */}
          <div>
            <label style={labelStyle}>Estado</label>
            <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              {([['todas', 'Todas'], ['no_leidas', 'No leídas'], ['leidas', 'Leídas']] as [FiltroEstado, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => cambiarFiltroEstado(val)}
                  style={{
                    padding: '9px 14px', fontSize: '13px', fontWeight: filtroEstado === val ? 700 : 400, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                    backgroundColor: filtroEstado === val ? '#0f172a' : '#fff',
                    color: filtroEstado === val ? '#fff' : '#64748b',
                    borderRight: val !== 'leidas' ? '1px solid #e2e8f0' : 'none',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Limpiar */}
          <button
            onClick={limpiarFiltros}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#0d9488', fontSize: '13px', fontWeight: 600, padding: '0 0 2px', marginBottom: '2px' }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '0 24px', marginBottom: '0' }}>
        {loading
          ? <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Cargando...</div>
          : paginated.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px' }}>No hay notificaciones con los filtros seleccionados.</div>
            : paginated.map(n => <NotificacionItem key={n.id} n={n} />)
        }

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', flexWrap: 'wrap', gap: '10px', borderTop: paginated.length > 0 ? '1px solid #f8fafc' : 'none' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Mostrando {paginated.length} de {TOTAL_MOCK} notificaciones
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </PageBtn>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(n => (
              <PageBtn key={n} active={page === n} onClick={() => setPage(n)}>{n}</PageBtn>
            ))}
            <PageBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </PageBtn>
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}

function PageBtn({ active, children, onClick, disabled }: { active?: boolean; children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '32px', height: '32px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: active ? '#0f4c35' : 'transparent',
        color: active ? '#fff' : disabled ? '#cbd5e1' : '#475569',
        border: active ? 'none' : '1px solid #e2e8f0',
      }}
    >
      {children}
    </button>
  )
}
