import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import DashboardLayout from '../layouts/DashboardLayout'
import GaugeChart from '../components/GaugeChart'
import { useEstanqueDetalle } from '../hooks/useEstanqueDetalle'
import type { EquipoAsignado, TelemetriaLectura } from '../domain/estanque/Estanque'

const TIPO_STYLE: Record<string, { bg: string; color: string }> = {
  SENSOR: { bg: '#0d1b2e', color: '#fff' },
  PUMP:   { bg: '#0d6e4f', color: '#fff' },
}

function EquipoCard({ equipo }: { equipo: EquipoAsignado }) {
  const { t } = useTranslation()
  const badge = TIPO_STYLE[equipo.tipo] ?? TIPO_STYLE.SENSOR
  return (
    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ backgroundColor: badge.bg, color: badge.color, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>
          {equipo.tipo}
        </span>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
          {t('estanqueDetalle.unassign')}
        </button>
      </div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{equipo.nombre}</div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>SN: {equipo.serialNumber}</div>
      <div style={{ fontSize: '11px', color: '#94a3b8' }}>CÓD: {equipo.codigo}</div>
    </div>
  )
}

interface TelemetriaCardProps {
  label: string
  lectura: TelemetriaLectura
}

function TelemetriaCard({ label, lectura }: TelemetriaCardProps) {
  const { t } = useTranslation()
  const pct = (lectura.valor - lectura.rangoMin) / (lectura.rangoMax - lectura.rangoMin)
  const valueStr = `${lectura.valor}${lectura.unidad}`
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '16px' }}>{label}</div>
      <GaugeChart value={valueStr} status={lectura.estado} statusColor={lectura.estadoColor} pct={pct} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '14px' }}>
        <span style={{ fontSize: '12px', color: '#64748b' }}>{lectura.rangoMin}{lectura.unidad}</span>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t('estanqueDetalle.range')} {lectura.rangoMin}-{lectura.rangoMax}</span>
        <span style={{ fontSize: '12px', color: '#64748b' }}>{lectura.rangoMax}{lectura.unidad}</span>
      </div>
    </div>
  )
}

export default function EstanqueDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { detalle, loading } = useEstanqueDetalle(id ?? '')
  const [historialOpen, setHistorialOpen] = useState(true)

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8' }}>{t('common.loading')}</div>
      </DashboardLayout>
    )
  }

  if (!detalle) return null

  const tableHeaders = [
    t('estanqueDetalle.hDate'),
    t('estanqueDetalle.hTemperature'),
    t('estanqueDetalle.hPh'),
    t('estanqueDetalle.hOxygen'),
    t('estanqueDetalle.hStatus'),
  ]

  return (
    <DashboardLayout>

      <button
        onClick={() => navigate('/estanques')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '13px', fontWeight: 500, marginBottom: '16px', padding: 0 }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t('estanqueDetalle.backToPonds')}
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{detalle.nombre}</h1>
            <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.04em' }}>
              {detalle.activo ? t('estanqueDetalle.active') : t('estanqueDetalle.inactive')}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>ID: {detalle.pondId}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t('estanqueDetalle.editPond')}
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0f4c35', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0a3526')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0f4c35')}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            {t('estanqueDetalle.newRecord')}
          </button>
        </div>
      </div>

      {/* Telemetría */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '20px', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <svg width="16" height="16" fill="none" stroke="#0d9488" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('estanqueDetalle.telemetry')}</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0', marginTop: '8px' }}>
          <TelemetriaCard label={t('estanqueDetalle.temperature')} lectura={detalle.telemetria.temperatura} />
          <div style={{ width: '1px', backgroundColor: '#f1f5f9', alignSelf: 'stretch' }} />
          <TelemetriaCard label={t('estanqueDetalle.phWater')}     lectura={detalle.telemetria.ph} />
          <div style={{ width: '1px', backgroundColor: '#f1f5f9', alignSelf: 'stretch' }} />
          <TelemetriaCard label={t('estanqueDetalle.dissolvedOxygen')} lectura={detalle.telemetria.oxigeno} />
        </div>
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '20px', marginBottom: '20px' }}>

        {/* Análisis Histórico */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('estanqueDetalle.historicalAnalysis')}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px' }}>
              <span>10/20/2023</span>
              <span style={{ color: '#94a3b8' }}>{t('estanqueDetalle.to')}</span>
              <span>10/27/2023</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={detalle.historico} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
              <XAxis dataKey="tiempo" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              <Line type="monotone" dataKey="Temperatura" stroke="#0d9488" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pH"          stroke="#0f172a" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Oxígeno"     stroke="#94a3b8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Equipos Asignados */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('estanqueDetalle.assignedEquipment')}</h2>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#38bdf8', fontSize: '13px', fontWeight: 600 }}>{t('estanqueDetalle.linkButton')}</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {detalle.equipos.map(eq => <EquipoCard key={eq.id} equipo={eq} />)}
          </div>
        </div>
      </div>

      {/* Historial de Lecturas */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <button
          onClick={() => setHistorialOpen(o => !o)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('estanqueDetalle.readingHistory')}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={e => { e.stopPropagation() }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t('estanqueDetalle.exportCsv')}
            </button>
            <svg width="18" height="18" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ transform: historialOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {historialOpen && (
          <div style={{ padding: '0 24px 20px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {tableHeaders.map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detalle.historico.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px', color: '#64748b' }}>{row.tiempo}</td>
                      <td style={{ padding: '12px', color: '#0f172a', fontWeight: 600 }}>{row.Temperatura}°C</td>
                      <td style={{ padding: '12px', color: '#0f172a' }}>{row.pH}</td>
                      <td style={{ padding: '12px', color: '#0f172a' }}>{row.Oxígeno} mg/L</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ backgroundColor: '#ccfbf1', color: '#0d9488', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>{t('estanqueDetalle.optimal')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </DashboardLayout>
  )
}
