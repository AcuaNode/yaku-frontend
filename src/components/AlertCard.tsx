import type { Alerta } from '../domain/alerta/Alerta'

type Props = Pick<Alerta, 'estanqueId' | 'tiempo' | 'titulo' | 'descripcion' | 'prioridad'>

export default function AlertCard({ estanqueId, tiempo, titulo, descripcion, prioridad }: Props) {
  const isCritica = prioridad === 'CRITICA'

  return (
    <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', borderLeft: `3px solid ${isCritica ? '#ef4444' : '#e2e8f0'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: isCritica ? '#ef4444' : '#0f172a' }}>{estanqueId}</span>
        <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '8px' }}>{tiempo}</span>
      </div>
      <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', margin: '0 0 2px' }}>{titulo}</p>
      <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', margin: 0 }}>{descripcion}</p>
    </div>
  )
}
