import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '../layouts/DashboardLayout'
import { useEquipos } from '../hooks/useEquipos'
import type { Equipo, TipoEquipo } from '../domain/equipo/Equipo'

const TIPO_BADGE: Record<string, { bg: string; color: string }> = {
  SENSOR: { bg: '#0d9488', color: '#fff' },
  PUMP:   { bg: '#0d1b2e', color: '#fff' },
}

const ESTADO_BADGE: Record<string, { bg: string; color: string }> = {
  Asignado: { bg: '#dcfce7', color: '#16a34a' },
  Libre:    { bg: '#f1f5f9', color: '#64748b' },
}

function EquipoCard({ equipo, onEliminar }: { equipo: Equipo; onEliminar: (id: string) => void }) {
  const { t } = useTranslation()
  const tipo   = TIPO_BADGE[equipo.tipo]   ?? TIPO_BADGE.SENSOR
  const estado = ESTADO_BADGE[equipo.estado] ?? ESTADO_BADGE.Libre
  const esLibre = equipo.estado === 'Libre'
  const estadoLabel = esLibre ? t('estados.free') : t('estados.assigned')

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ backgroundColor: tipo.bg, color: tipo.color, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.04em' }}>
          {equipo.tipo}
        </span>
        <span style={{ backgroundColor: estado.bg, color: estado.color, fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px' }}>
          {estadoLabel}
        </span>
      </div>

      <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '4px', lineHeight: 1.3 }}>{equipo.nombre}</div>
      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>SN: {equipo.serialNumber}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: '#64748b' }}>{t('equipos.physicalCode')}</span>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{equipo.codigoFisico}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: '#64748b' }}>{t('equipos.location')}</span>
          <span style={{ color: '#334155', textAlign: 'right', maxWidth: '55%' }}>{equipo.ubicacion}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        {esLibre ? (
          <>
            <button style={{ flex: 1, backgroundColor: '#0f4c35', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0a3526')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0f4c35')}
            >
              {t('equipos.assignToPond')}
            </button>
            <button style={{ flex: 1, backgroundColor: 'transparent', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {t('common.edit')}
            </button>
          </>
        ) : (
          <>
            <button style={{ flex: 1, backgroundColor: 'transparent', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {t('common.edit')}
            </button>
            <button
              onClick={() => onEliminar(equipo.id)}
              style={{ backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fee2e2')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#fef2f2')}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function AddCard({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation()
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: '#fff', borderRadius: '12px', border: '2px dashed #cbd5e1', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', transition: 'border-color 0.15s', minHeight: '240px' }}
      onMouseOver={e => (e.currentTarget.style.borderColor = '#0d9488')}
      onMouseOut={e => (e.currentTarget.style.borderColor = '#cbd5e1')}
    >
      <svg width="36" height="36" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
      <span style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', lineHeight: 1.5, fontWeight: 500 }}>
        {t('equipos.addDevice')}
      </span>
    </button>
  )
}

export default function EquiposPage() {
  const { equipos, stats, loading, refetch } = useEquipos()
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ nombre: '', tipo: 'SENSOR' as TipoEquipo, codigoFisico: '', ubicacion: '' })

  function handleRegistrar() {
    // TODO: conectar con equipoService.registrar(form)
    setShowModal(false)
    setForm({ nombre: '', tipo: 'SENSOR', codigoFisico: '', ubicacion: '' })
    refetch()
  }

  function handleEliminar(_id: string) {
    // TODO: equipoService.eliminar(id).then(refetch)
  }

  const statItems = [
    { label: t('equipos.totalEquipment'),    value: stats?.totalEquipos ?? 0,        color: '#0f172a' },
    { label: t('equipos.activeSensors'),     value: stats?.sensoresActivos ?? 0,      color: '#0d9488' },
    { label: t('equipos.pumpsInOperation'),  value: stats?.bombasEnOperacion ?? 0,    color: '#0f172a' },
    { label: t('equipos.needsMaintenance'),  value: stats?.requiereMantension ?? 0,   color: '#ef4444' },
  ]

  return (
    <DashboardLayout>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{t('equipos.title')}</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{t('equipos.subtitle')}</p>
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
          {t('equipos.registerEquipment')}
        </button>
      </div>

      <div className="equipos-stats" style={{ marginBottom: '28px' }}>
        {statItems.map(s => (
          <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #f1f5f9', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {loading
        ? <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>{t('common.loading')}</div>
        : (
          <div className="equipos-grid">
            {equipos.map(eq => <EquipoCard key={eq.id} equipo={eq} onEliminar={handleEliminar} />)}
            <AddCard onClick={() => setShowModal(true)} />
          </div>
        )
      }

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px 20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('equipos.modalTitle')}</h2>
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{t('equipos.equipmentName')}</label>
                <input
                  type="text"
                  placeholder={t('equipos.equipmentNamePh')}
                  value={form.nombre}
                  onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box', color: '#0f172a' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{t('equipos.equipmentType')}</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {(['SENSOR', 'PUMP'] as TipoEquipo[]).map(t_ => (
                    <button
                      key={t_}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, tipo: t_ }))}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                        backgroundColor: form.tipo === t_ ? TIPO_BADGE[t_].bg : 'transparent',
                        color: form.tipo === t_ ? TIPO_BADGE[t_].color : '#64748b',
                        border: form.tipo === t_ ? `2px solid ${TIPO_BADGE[t_].bg}` : '2px solid #e2e8f0',
                      }}
                    >
                      {t_}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{t('equipos.physicalCodeLabel')}</label>
                <input
                  type="text"
                  placeholder={t('equipos.physicalCodePh')}
                  value={form.codigoFisico}
                  onChange={e => setForm(p => ({ ...p, codigoFisico: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box', color: '#0f172a' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{t('equipos.locationLabel')}</label>
                <input
                  type="text"
                  placeholder={t('equipos.locationPh')}
                  value={form.ubicacion}
                  onChange={e => setForm(p => ({ ...p, ubicacion: e.target.value }))}
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
                onClick={handleRegistrar}
                style={{ backgroundColor: '#0f4c35', color: '#fff', fontWeight: 600, fontSize: '14px', padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0a3526')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0f4c35')}
              >
                {t('equipos.registerEquipment')}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
