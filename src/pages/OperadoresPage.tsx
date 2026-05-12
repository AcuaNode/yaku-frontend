import { useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { useOperadores } from '../hooks/useOperadores'
import type { Operador } from '../domain/operador/Operador'

const PAGE_SIZE = 3

function Avatar({ operador }: { operador: Operador }) {
  const iniciales = (operador.nombre[0] + operador.apellido[0]).toUpperCase()
  return (
    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: operador.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
      {iniciales}
    </div>
  )
}

function RolBadge({ rol }: { rol: string }) {
  return (
    <span style={{ backgroundColor: '#0d1b2e', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
      {rol}
    </span>
  )
}

function PaginationBtn({ active, children, onClick, disabled }: { active?: boolean; children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: '34px', height: '34px', padding: '0 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: active ? '#0f4c35' : 'transparent',
        color: active ? '#fff' : disabled ? '#cbd5e1' : '#475569',
        border: active ? 'none' : '1px solid #e2e8f0',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

export default function OperadoresPage() {
  const { operadores, stats, farmToken, loading, actualizarToken } = useOperadores()
  const [page, setPage] = useState(1)
  const [copied, setCopied] = useState(false)

  const totalPages = Math.ceil(operadores.length / PAGE_SIZE)
  const paginated = operadores.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function copyToken() {
    navigator.clipboard.writeText(farmToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleActualizarToken() {
    await actualizarToken()
  }

  const HEADERS = ['User ID', 'Nombre Completo', 'Email', 'Rol', 'Estanque Asignado', 'Fecha Registro', 'Acciones']

  return (
    <DashboardLayout>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Gestión de Operadores</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Administra los permisos y acceso del personal de campo.</p>
        </div>
        <button
          onClick={handleActualizarToken}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f4c35', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '11px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0a3526')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0f4c35')}
        >
          Actualizar Token
        </button>
      </div>

      {/* Stats card */}
      <div style={{ display: 'inline-block', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #f1f5f9', padding: '16px 24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Total Operadores</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontSize: '34px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{stats?.total ?? 0}</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d9488' }}>+{stats?.crecimientoMensual ?? 0} este mes</span>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '680px', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                {HEADERS.map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Cargando...</td></tr>
                : paginated.map(op => (
                  <tr key={op.id} style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fafbfc')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12px', fontWeight: 600 }}>{op.userId}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar operador={op} />
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{op.nombre} {op.apellido}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>{op.email}</td>
                    <td style={{ padding: '14px 16px' }}><RolBadge rol={op.rol} /></td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>{op.estanqueAsignado}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>{op.fechaRegistro}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0d9488', fontSize: '13px', fontWeight: 600, padding: 0 }}>[Editar]</button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0d9488', fontSize: '13px', fontWeight: 600, padding: 0 }}>[Ver perfil]</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #f8fafc', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Mostrando {Math.min(PAGE_SIZE, operadores.length - (page - 1) * PAGE_SIZE)} de {stats?.total ?? operadores.length} operadores
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PaginationBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</PaginationBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <PaginationBtn key={n} active={page === n} onClick={() => setPage(n)}>{n}</PaginationBtn>
            ))}
            <PaginationBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Siguiente</PaginationBtn>
          </div>
        </div>
      </div>

      {/* FarmToken card */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '24px', maxWidth: '560px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0d9488', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SEGURIDAD</span>
          <svg width="20" height="20" fill="none" stroke="#0d9488" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Tienes un FarmToken</h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px', lineHeight: 1.6 }}>
          Usa este código de invitación para nuevos piscicultores con permisos pre-configurados.
        </p>
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Código Activo</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.05em', fontFamily: 'monospace' }}>{farmToken}</span>
            <button
              onClick={copyToken}
              title={copied ? '¡Copiado!' : 'Copiar código'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#0d9488' : '#94a3b8', display: 'flex', padding: '4px', transition: 'color 0.15s' }}
            >
              {copied
                ? <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                : <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              }
            </button>
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}
