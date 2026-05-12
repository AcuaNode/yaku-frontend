import type { LecturaEstanque } from '../domain/estanque/Estanque'

interface Props {
  data: LecturaEstanque[]
}

const HEADERS = ['ID ESTANQUE', 'TEMP (°C)', 'PH', 'OXÍGENO (MG/L)', 'ÚLTIMA LECTURA', 'ESTADO']

function EstadoBadge({ estado }: { estado: LecturaEstanque['estado'] }) {
  const isAlerta = estado === 'ALERTA'
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px',
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      color: isAlerta ? '#ef4444' : '#0d9488',
      backgroundColor: isAlerta ? '#fef2f2' : '#ccfbf1',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block', flexShrink: 0 }} />
      {estado}
    </span>
  )
}

export default function RealtimeTable({ data }: Props) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Lecturas en Tiempo Real</h2>
        <button style={{ fontSize: '12px', color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar CSV
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px', fontSize: '13px' }}>
          <thead>
            <tr>
              {HEADERS.map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '11px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '11px 12px', fontWeight: 700, color: '#0f172a' }}>{row.id}</td>
                <td style={{ padding: '11px 12px', color: '#475569' }}>{row.temp}</td>
                <td style={{ padding: '11px 12px', fontWeight: row.estado === 'ALERTA' ? 700 : 400, color: row.estado === 'ALERTA' ? '#ef4444' : '#475569' }}>{row.ph}</td>
                <td style={{ padding: '11px 12px', color: '#475569' }}>{row.o2}</td>
                <td style={{ padding: '11px 12px', color: '#94a3b8' }}>{row.lectura}</td>
                <td style={{ padding: '11px 12px' }}><EstadoBadge estado={row.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
