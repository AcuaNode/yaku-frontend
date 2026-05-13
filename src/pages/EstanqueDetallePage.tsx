import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import DashboardLayout from '../layouts/DashboardLayout'
import GaugeChart from '../components/GaugeChart'
import { useEstanqueDetalle } from '../hooks/useEstanqueDetalle'
import { http } from '../lib/http'
import { API_ENDPOINTS } from '../config/api.config'
import type { EquipoAsignado, TelemetriaLectura, OperadorAsignado } from '../domain/estanque/Estanque'

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

interface EquipmentOption { id: number; name: string; physicalCode: string }
interface EquipmentResource { id: number; pondId: number; type: string; status: string; name: string; physicalCode: string }
interface UserOption { id: number; firstName: string; lastName: string; email: string; role: string }

function OperadorCard({ operador, desasignando, onAsignar, onDesasignar }: {
  operador: OperadorAsignado | null
  desasignando: boolean
  onAsignar: () => void
  onDesasignar: (id: string) => void
}) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Operador</h2>
        {!operador && (
          <button onClick={onAsignar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#38bdf8', fontSize: '13px', fontWeight: 600 }}>
            + Asignar
          </button>
        )}
      </div>
      {!operador ? (
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Sin operador asignado</p>
      ) : (
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
              {operador.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{operador.nombre}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{operador.email}</div>
            </div>
          </div>
          <button
            onClick={() => onDesasignar(operador.id)}
            disabled={desasignando}
            style={{ width: '100%', padding: '7px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#ef4444', fontSize: '12px', fontWeight: 600, cursor: desasignando ? 'not-allowed' : 'pointer', opacity: desasignando ? 0.6 : 1 }}
          >
            {desasignando ? 'Desasignando...' : 'Desasignar'}
          </button>
        </div>
      )}
    </div>
  )
}

interface IngestForm {
  temperature: string
  ph: string
  oxygen: string
}

export default function EstanqueDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const pondId = parseInt(id ?? '0', 10)
  const { detalle, loading, refetch } = useEstanqueDetalle(id ?? '')
  const [historialOpen, setHistorialOpen] = useState(true)

  // Modal: vincular equipo
  const [showVincular, setShowVincular] = useState(false)
  const [equiposDisponibles, setEquiposDisponibles] = useState<EquipmentOption[]>([])
  const [selectedEquipo, setSelectedEquipo] = useState('')
  const [vinculando, setVinculando] = useState(false)
  const [errorVincular, setErrorVincular] = useState<string | null>(null)

  // Modal: nuevo registro
  const [showRegistro, setShowRegistro] = useState(false)
  const [ingestForm, setIngestForm] = useState<IngestForm>({ temperature: '', ph: '', oxygen: '' })
  const [ingesting, setIngesting] = useState(false)
  const [errorIngest, setErrorIngest] = useState<string | null>(null)
  const [successIngest, setSuccessIngest] = useState(false)

  // Modal: editar estanque
  const [showEditar, setShowEditar] = useState(false)
  const [editForm, setEditForm] = useState({ nombre: '', species: '', volume: '' })
  const [editando, setEditando] = useState(false)
  const [errorEditar, setErrorEditar] = useState<string | null>(null)

  // Modal: asignar operador
  const [showAsignar, setShowAsignar] = useState(false)
  const [operadoresDisponibles, setOperadoresDisponibles] = useState<UserOption[]>([])
  const [selectedOperador, setSelectedOperador] = useState('')
  const [asignando, setAsignando] = useState(false)
  const [errorAsignar, setErrorAsignar] = useState<string | null>(null)
  const [desasignando, setDesasignando] = useState(false)

  async function abrirVincular() {
    setErrorVincular(null)
    setSelectedEquipo('')
    try {
      const { data } = await http.get<EquipmentResource[]>(API_ENDPOINTS.equipment.base)
      setEquiposDisponibles(data.filter(e => e.status === 'AVAILABLE'))
    } catch {
      setEquiposDisponibles([])
    }
    setShowVincular(true)
  }

  async function handleVincular() {
    if (!selectedEquipo) { setErrorVincular('Selecciona un equipo'); return }
    setVinculando(true); setErrorVincular(null)
    try {
      await http.post(API_ENDPOINTS.equipment.link(parseInt(selectedEquipo, 10), pondId), {})
      setShowVincular(false)
      refetch()
    } catch {
      setErrorVincular('No se pudo vincular el equipo. Intenta de nuevo.')
    } finally {
      setVinculando(false)
    }
  }

  async function handleIngest() {
    const temp = parseFloat(ingestForm.temperature)
    const ph   = parseFloat(ingestForm.ph)
    const o2   = parseFloat(ingestForm.oxygen)
    if (isNaN(temp) || isNaN(ph) || isNaN(o2)) {
      setErrorIngest('Todos los campos son requeridos y deben ser números válidos')
      return
    }
    const sensors = detalle?.equipos.filter(e => e.tipo === 'SENSOR') ?? []
    if (sensors.length === 0) {
      setErrorIngest('Este estanque no tiene sensores vinculados. Vincula al menos un sensor antes de registrar lecturas.')
      return
    }
    const sensorId = parseInt(sensors[0].id, 10)
    setIngesting(true); setErrorIngest(null)
    const now = new Date().toISOString()
    try {
      await Promise.all([
        http.post(API_ENDPOINTS.telemetry.ingest, { sensorId, pondId, sensorType: 'TEMPERATURE', value: temp, unit: '°C',   timestamp: now }),
        http.post(API_ENDPOINTS.telemetry.ingest, { sensorId, pondId, sensorType: 'PH',          value: ph,   unit: '',      timestamp: now }),
        http.post(API_ENDPOINTS.telemetry.ingest, { sensorId, pondId, sensorType: 'OXYGEN',      value: o2,   unit: 'mg/L', timestamp: now }),
      ])
      setSuccessIngest(true)
      setIngestForm({ temperature: '', ph: '', oxygen: '' })
      setTimeout(() => { setSuccessIngest(false); setShowRegistro(false); refetch() }, 1500)
    } catch {
      setErrorIngest('No se pudo registrar la lectura. Intenta de nuevo.')
    } finally {
      setIngesting(false)
    }
  }

  async function abrirAsignar() {
    setErrorAsignar(null)
    setSelectedOperador('')
    try {
      const { data } = await http.get<UserOption[]>(API_ENDPOINTS.users.base)
      setOperadoresDisponibles(Array.isArray(data) ? data.filter(u => u.role === 'OPERATOR') : [])
    } catch {
      setOperadoresDisponibles([])
    }
    setShowAsignar(true)
  }

  async function handleAsignar() {
    if (!selectedOperador) { setErrorAsignar('Selecciona un operador'); return }
    setAsignando(true); setErrorAsignar(null)
    try {
      await http.post(API_ENDPOINTS.ponds.assign(pondId), { operatorId: parseInt(selectedOperador, 10) })
      setShowAsignar(false)
      refetch()
    } catch {
      setErrorAsignar('No se pudo asignar el operador. Intenta de nuevo.')
    } finally {
      setAsignando(false)
    }
  }

  async function handleDesasignar(operadorId: string) {
    setDesasignando(true)
    try {
      await http.delete(API_ENDPOINTS.ponds.deassign(pondId, parseInt(operadorId, 10)))
      refetch()
    } catch {
      // silencioso — refetch de todas formas
    } finally {
      setDesasignando(false)
    }
  }

  function abrirEditar() {
    setEditForm({
      nombre: detalle?.nombre ?? '',
      species: '',
      volume: '',
    })
    setErrorEditar(null)
    setShowEditar(true)
  }

  async function handleEditarEstanque() {
    if (!editForm.nombre.trim()) { setErrorEditar('El nombre es requerido'); return }
    setEditando(true); setErrorEditar(null)
    try {
      await http.put(API_ENDPOINTS.ponds.byId(pondId), {
        name: editForm.nombre,
        species: editForm.species || undefined,
        volume: editForm.volume ? parseFloat(editForm.volume) : undefined,
      })
      setShowEditar(false)
      refetch()
    } catch {
      setErrorEditar('No se pudo guardar los cambios. Intenta de nuevo.')
    } finally {
      setEditando(false)
    }
  }

  function exportarCSV() {
    if (!detalle || detalle.historico.length === 0) return
    const headers = 'Fecha,Temperatura (°C),pH,Oxígeno (mg/L),Estado'
    const rows = detalle.historico.map(row => {
      const s = rowEstado(row.Temperatura, row.pH, row.Oxígeno)
      return `${row.tiempo},${row.Temperatura},${row.pH},${row.Oxígeno},${s.text}`
    })
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${detalle.nombre}_historico.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8' }}>{t('common.loading')}</div>
      </DashboardLayout>
    )
  }

  if (!detalle) return null

  function rowEstado(temp: number, ph: number, o2: number): { text: string; bg: string; color: string } {
    if (ph < 6.0 || ph > 9.0 || o2 < 3 || temp > 35) return { text: 'CRÍTICO', bg: '#fee2e2', color: '#ef4444' }
    if (ph < 6.5 || ph > 8.5 || o2 < 5 || temp > 30) return { text: 'ALERTA',  bg: '#fef3c7', color: '#f59e0b' }
    return { text: t('estanqueDetalle.optimal'), bg: '#ccfbf1', color: '#0d9488' }
  }

  const fechaInicio = detalle.historico[0]?.tiempo ?? '—'
  const fechaFin    = detalle.historico[detalle.historico.length - 1]?.tiempo ?? '—'

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
          <button
            onClick={abrirEditar}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t('estanqueDetalle.editPond')}
          </button>
          <button
            onClick={() => { setSuccessIngest(false); setErrorIngest(null); setIngestForm({ temperature: '', ph: '', oxygen: '' }); setShowRegistro(true) }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0f4c35', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
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
              <span>{fechaInicio}</span>
              <span style={{ color: '#94a3b8' }}>{t('estanqueDetalle.to')}</span>
              <span>{fechaFin}</span>
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

        {/* Columna derecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Equipos Asignados */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('estanqueDetalle.assignedEquipment')}</h2>
              <button
                onClick={abrirVincular}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#38bdf8', fontSize: '13px', fontWeight: 600 }}
              >
                {t('estanqueDetalle.linkButton')}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {detalle.equipos.length === 0
                ? <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Sin equipos asignados</p>
                : detalle.equipos.map(eq => <EquipoCard key={eq.id} equipo={eq} />)
              }
            </div>
          </div>

          {/* Operador Asignado */}
          <OperadorCard
            operador={detalle.operadorAsignado}
            desasignando={desasignando}
            onAsignar={abrirAsignar}
            onDesasignar={handleDesasignar}
          />

        </div>
      </div>

      {/* Historial de Lecturas */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div
          onClick={() => setHistorialOpen(o => !o)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', cursor: 'pointer' }}
        >
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('estanqueDetalle.readingHistory')}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={e => { e.stopPropagation(); exportarCSV() }}
              disabled={!detalle || detalle.historico.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer', opacity: (!detalle || detalle.historico.length === 0) ? 0.4 : 1 }}
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
        </div>

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
                        {(() => { const s = rowEstado(row.Temperatura, row.pH, row.Oxígeno); return (
                          <span style={{ backgroundColor: s.bg, color: s.color, fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>{s.text}</span>
                        )})()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Vincular equipo */}
      {showVincular && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('estanqueDetalle.linkButton').replace('+', '').trim()}</h2>
              <button onClick={() => setShowVincular(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '22px', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Equipo disponible</label>
                <select
                  value={selectedEquipo}
                  onChange={e => setSelectedEquipo(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', color: '#334155' }}
                >
                  <option value="">Seleccionar equipo...</option>
                  {equiposDisponibles.map(eq => (
                    <option key={eq.id} value={String(eq.id)}>{eq.name} — {eq.physicalCode}</option>
                  ))}
                </select>
                {equiposDisponibles.length === 0 && (
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>No hay equipos disponibles sin asignar.</p>
                )}
              </div>
              {errorVincular && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{errorVincular}</p>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button onClick={() => setShowVincular(false)} style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'transparent', fontSize: '13px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleVincular}
                  disabled={vinculando || !selectedEquipo}
                  style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#0f4c35', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: vinculando ? 'not-allowed' : 'pointer', opacity: vinculando ? 0.7 : 1 }}
                >
                  {vinculando ? 'Vinculando...' : 'Vincular'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nuevo Registro */}
      {showRegistro && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('estanqueDetalle.newRecord')}</h2>
              <button onClick={() => setShowRegistro(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '22px', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {([
                { key: 'temperature', label: 'Temperatura (°C)', placeholder: 'Ej: 25.5' },
                { key: 'ph',          label: 'pH',                placeholder: 'Ej: 7.2' },
                { key: 'oxygen',      label: 'Oxígeno (mg/L)',    placeholder: 'Ej: 6.8' },
              ] as const).map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>{field.label}</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={field.placeholder}
                    value={ingestForm[field.key]}
                    onChange={e => setIngestForm(p => ({ ...p, [field.key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box', color: '#334155' }}
                  />
                </div>
              ))}
              {errorIngest && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{errorIngest}</p>}
              {successIngest && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '13px', borderRadius: '8px', padding: '10px 12px' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  Lectura registrada correctamente.
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button onClick={() => setShowRegistro(false)} style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'transparent', fontSize: '13px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleIngest}
                  disabled={ingesting}
                  style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#0f4c35', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: ingesting ? 'not-allowed' : 'pointer', opacity: ingesting ? 0.7 : 1 }}
                >
                  {ingesting ? 'Guardando...' : t('common.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Asignar Operador */}
      {showAsignar && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Asignar Operador</h2>
              <button onClick={() => setShowAsignar(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '22px', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Operador disponible</label>
                <select
                  value={selectedOperador}
                  onChange={e => setSelectedOperador(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', color: '#334155' }}
                >
                  <option value="">Seleccionar operador...</option>
                  {operadoresDisponibles.map(op => (
                    <option key={op.id} value={String(op.id)}>{op.firstName} {op.lastName} — {op.email}</option>
                  ))}
                </select>
                {operadoresDisponibles.length === 0 && (
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>No hay operadores registrados.</p>
                )}
              </div>
              {errorAsignar && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{errorAsignar}</p>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button onClick={() => setShowAsignar(false)} style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'transparent', fontSize: '13px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleAsignar}
                  disabled={asignando || !selectedOperador}
                  style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#0f4c35', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: asignando ? 'not-allowed' : 'pointer', opacity: asignando ? 0.7 : 1 }}
                >
                  {asignando ? 'Asignando...' : 'Asignar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: editar estanque */}
      {showEditar && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>{t('estanqueDetalle.editPond')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Nombre *</label>
                <input
                  value={editForm.nombre}
                  onChange={e => setEditForm(f => ({ ...f, nombre: e.target.value }))}
                  style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }}
                  placeholder="Nombre del estanque"
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Especie</label>
                <input
                  value={editForm.species}
                  onChange={e => setEditForm(f => ({ ...f, species: e.target.value }))}
                  style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }}
                  placeholder="ej. Trucha, Salmón"
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>Volumen (m³)</label>
                <input
                  type="number"
                  value={editForm.volume}
                  onChange={e => setEditForm(f => ({ ...f, volume: e.target.value }))}
                  style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }}
                  placeholder="ej. 100"
                />
              </div>
              {errorEditar && <p style={{ margin: 0, fontSize: '13px', color: '#ef4444' }}>{errorEditar}</p>}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={() => setShowEditar(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#64748b' }}>
                  Cancelar
                </button>
                <button
                  onClick={handleEditarEstanque}
                  disabled={editando}
                  style={{ flex: 1, padding: '10px', backgroundColor: '#0f4c35', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: editando ? 'not-allowed' : 'pointer', color: '#fff', opacity: editando ? 0.7 : 1 }}
                >
                  {editando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}
