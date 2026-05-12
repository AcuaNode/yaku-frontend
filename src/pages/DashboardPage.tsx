import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '../layouts/DashboardLayout'
import StatCard from '../components/StatCard'
import AlertCard from '../components/AlertCard'
import RealtimeTable from '../components/RealtimeTable'
import SensorChart from '../components/SensorChart'
import { useEstanques } from '../hooks/useEstanques'
import { useAlertas } from '../hooks/useAlertas'
import { useSensores } from '../hooks/useSensores'
import type { CrearGranjaDTO } from '../domain/granja/Granja'

export default function DashboardPage() {
  const { lecturas, stats: estanqueStats } = useEstanques()
  const { alertas, noLeidas } = useAlertas()
  const { chartData, stats: sensorStats } = useSensores()
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState(false)
  const [granja, setGranja] = useState<CrearGranjaDTO>({ nombre: '', ubicacion: '' })

  const stats = [
    {
      label: t('dashboard.activePonds'),
      value: String(estanqueStats?.totalActivos ?? 0).padStart(2, '0'),
      sub: `↗ +${estanqueStats?.crecimientoMensual ?? 0} ${t('common.thisMonth')}`,
      subColor: '#22c55e',
    },
    {
      label: t('dashboard.connectedSensors'),
      value: String(sensorStats?.totalConectados ?? 0),
      sub: `${t('dashboard.sync')}: ${sensorStats?.sincronizacion ?? 0}%`,
      subColor: '#64748b',
    },
    {
      label: t('dashboard.unreadAlerts'),
      value: String(noLeidas).padStart(2, '0'),
      badge: t('dashboard.reviewBadge'),
      badgeColor: '#f59e0b',
      badgeBg: '#fef3c7',
    },
    {
      label: t('dashboard.avgQuality'),
      valueLarge: t('dashboard.goodQuality'),
      valueColor: '#0d9488',
      badge: t('dashboard.optimalBadge'),
      badgeColor: '#0d9488',
      badgeBg: '#ccfbf1',
    },
  ]

  function handleCrearGranja() {
    // TODO: conectar con granjaService.crear(granja)
    setShowModal(false)
    setGranja({ nombre: '', ubicacion: '' })
  }

  return (
    <DashboardLayout>

      <div className="stats-grid">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="main-grid">

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SensorChart data={chartData} />
          <RealtimeTable data={lecturas} />
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{t('dashboard.recentAlerts')}</h2>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff', backgroundColor: '#ef4444', padding: '2px 8px', borderRadius: '20px' }}>
              {noLeidas} {t('dashboard.newBadge')}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {alertas.map(alerta => <AlertCard key={alerta.id} {...alerta} />)}
          </div>

          <button
            style={{ marginTop: '16px', width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', fontWeight: 600, color: '#64748b', cursor: 'pointer', letterSpacing: '0.05em' }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {t('dashboard.viewHistory')}
          </button>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('dashboard.createFarm')}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '22px', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>{t('dashboard.farmName')}</label>
                <input
                  type="text"
                  placeholder={t('dashboard.farmNamePh')}
                  value={granja.nombre}
                  onChange={e => setGranja(p => ({ ...p, nombre: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>{t('dashboard.location')}</label>
                <input
                  type="text"
                  placeholder={t('dashboard.locationPh')}
                  value={granja.ubicacion}
                  onChange={e => setGranja(p => ({ ...p, ubicacion: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={handleCrearGranja}
                  style={{ backgroundColor: '#0f4c35', color: '#fff', fontWeight: 600, fontSize: '14px', padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0a3526')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0f4c35')}
                >
                  {t('dashboard.registerFarm')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
