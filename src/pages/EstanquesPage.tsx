import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '../layouts/DashboardLayout'
import { useEstanques } from '../hooks/useEstanques'
import type { EstadoEstanque } from '../domain/estanque/Estanque'

const SENSOR_COLOR: Record<string, { bg: string; color: string }> = {
  O2:   { bg: '#e0f2fe', color: '#0369a1' },
  pH:   { bg: '#ede9fe', color: '#6d28d9' },
  TEMP: { bg: '#fef3c7', color: '#92400e' },
}

function SensorBadge({ sensor }: { sensor: string }) {
  const style = SENSOR_COLOR[sensor] ?? { bg: '#f1f5f9', color: '#475569' }
  return (
    <span style={{ backgroundColor: style.bg, color: style.color, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.02em' }}>
      {sensor}
    </span>
  )
}

const ESTADO_STYLE: Record<EstadoEstanque, { bg: string; color: string; icon: React.ReactNode }> = {
  'ÓPTIMO': {
    bg: '#ccfbf1', color: '#0d9488',
    icon: <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  'CRÍTICO': {
    bg: '#fef2f2', color: '#ef4444',
    icon: <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>,
  },
  'ALERTA': {
    bg: '#fef3c7', color: '#f59e0b',
    icon: <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  'INACTIVO': {
    bg: '#f1f5f9', color: '#94a3b8',
    icon: <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
  },
}

const DOT_COLOR: Record<EstadoEstanque, string> = {
  'ÓPTIMO': '#22c55e', 'CRÍTICO': '#ef4444', 'ALERTA': '#f59e0b', 'INACTIVO': '#94a3b8',
}

function EstadoBadge({ estado }: { estado: EstadoEstanque }) {
  const { t } = useTranslation()
  const s = ESTADO_STYLE[estado]
  const labelMap: Record<EstadoEstanque, string> = {
    'ÓPTIMO':   t('estados.optimal'),
    'ALERTA':   t('estados.alert'),
    'CRÍTICO':  t('estados.critical'),
    'INACTIVO': t('estados.inactive'),
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: s.bg, color: s.color, fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
      {s.icon} {labelMap[estado]}
    </span>
  )
}

export default function EstanquesPage() {
  const { listItems, stats, loading } = useEstanques()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ nombre: '', tipoCultivo: 'Tilapia', capacidad: '' })

  function handleCrear() {
    // TODO: conectar con estanqueService.crear(form)
    setShowModal(false)
    setForm({ nombre: '', tipoCultivo: 'Tilapia', capacidad: '' })
  }

  const HEADERS = [
    t('estanques.hId'),
    t('estanques.hName'),
    t('estanques.hSensors'),
    t('estanques.hLastReading'),
    t('estanques.hStatus'),
    t('estanques.hActions'),
  ]

  return (
    <DashboardLayout>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{t('estanques.title')}</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{t('estanques.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f4c35', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '11px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0a3526')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0f4c35')}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          {t('estanques.newPond')}
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                {HEADERS.map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', borderBottom: '1px solid #f1f5f9' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px' }}>{t('common.loading')}</td></tr>
                : listItems.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fafbfc')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#64748b', fontSize: '12px' }}>{item.id}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: DOT_COLOR[item.estado], flexShrink: 0 }} />
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {item.sensores.length > 0
                        ? <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{item.sensores.map(s => <SensorBadge key={s} sensor={s} />)}</div>
                        : <span style={{ color: '#94a3b8', fontSize: '12px' }}>{t('estanques.noSensors')}</span>
                      }
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>{item.ultimaLectura}</td>
                    <td style={{ padding: '14px 16px' }}><EstadoBadge estado={item.estado} /></td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => navigate(`/estanques/${item.id.replace('#', '')}`)}
                          style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', backgroundColor: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                          onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          {t('estanques.viewDetails')}
                        </button>
                        <button style={{ color: '#64748b', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
                          onMouseOver={e => (e.currentTarget.style.color = '#0f172a')}
                          onMouseOut={e => (e.currentTarget.style.color = '#64748b')}
                        >
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Stat card */}
      <div style={{ display: 'inline-block', backgroundColor: '#0d1b2e', borderRadius: '12px', padding: '20px 24px', minWidth: '220px' }}>
        <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24" style={{ marginBottom: '10px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>{t('estanques.totalPonds')}</div>
        <div style={{ fontSize: '40px', fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: '8px' }}>{stats?.totalEstanques ?? 0}</div>
        <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>↗ +{stats?.crecimientoMensual ?? 0} {t('common.thisMonth')}</div>
      </div>

      {/* Modal nuevo estanque */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px 20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('estanques.modalTitle')}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: '2px' }}
                onMouseOver={e => (e.currentTarget.style.color = '#0f172a')}
                onMouseOut={e => (e.currentTarget.style.color = '#94a3b8')}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '0 28px 28px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{t('estanques.pondName')}</label>
                <input
                  type="text"
                  placeholder={t('estanques.pondNamePh')}
                  value={form.nombre}
                  onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box', color: '#0f172a' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{t('estanques.cultureType')}</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={form.tipoCultivo}
                    onChange={e => setForm(p => ({ ...p, tipoCultivo: e.target.value }))}
                    style={{ width: '100%', padding: '10px 36px 10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', color: '#0f172a', appearance: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <option>Tilapia</option>
                    <option>Trucha</option>
                    <option>Camarón</option>
                    <option>Salmón</option>
                    <option>Carpa</option>
                    <option>{t('estanques.other')}</option>
                  </select>
                  <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{t('estanques.capacity')}</label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={form.capacidad}
                  onChange={e => setForm(p => ({ ...p, capacidad: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box', color: '#0f172a' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', padding: '16px 28px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ fontSize: '14px', fontWeight: 500, padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#64748b', cursor: 'pointer' }}
                onMouseOver={e => (e.currentTarget.style.color = '#0f172a')}
                onMouseOut={e => (e.currentTarget.style.color = '#64748b')}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleCrear}
                style={{ backgroundColor: '#0f4c35', color: '#fff', fontWeight: 600, fontSize: '14px', padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0a3526')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0f4c35')}
              >
                {t('estanques.registerPond')}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
