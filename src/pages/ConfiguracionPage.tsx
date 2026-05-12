import { useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'

// ── Toggle switch ──────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: on ? '#0d9488' : '#e2e8f0', cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s', flexShrink: 0 }}
    >
      <div style={{ position: 'absolute', top: '2px', left: on ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
    </div>
  )
}

// ── Password input ─────────────────────────────────────────────────────────
function PasswordInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc', padding: '10px 12px', gap: '8px' }}>
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#334155', backgroundColor: 'transparent' }}
      />
      <button type="button" onClick={() => setShow(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {show
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
          }
        </svg>
      </button>
    </div>
  )
}

// ── Preference row ─────────────────────────────────────────────────────────
function PrefRow({ icon, label, sub, right }: { icon: React.ReactNode; label: string; sub: string; right: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ color: '#64748b' }}>{icon}</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{label}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{sub}</div>
        </div>
      </div>
      {right}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ConfiguracionPage() {
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirmar, setPasswordConfirmar] = useState('')
  const [modoOscuro, setModoOscuro] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  function handleActualizarPassword() {
    // TODO: PATCH /api/auth/change-password
    setSuccessMsg('Contraseña actualizada correctamente.')
    setPasswordActual(''); setPasswordNueva(''); setPasswordConfirmar('')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <DashboardLayout>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Configuración del Perfil</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Administra tu información personal, seguridad y suscripción del sistema.</p>
      </div>

      <div className="config-grid">

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Profile card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '28px' }}>

            {/* Top: avatar + name + edit */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                {/* Avatar with camera overlay */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '12px', backgroundColor: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: '#fff' }}>
                    CR
                  </div>
                  <button style={{ position: 'absolute', bottom: '-6px', right: '-6px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#0f172a', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <svg width="11" height="11" fill="none" stroke="#fff" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Carlos Rodriguez</div>
                  <span style={{ backgroundColor: '#ccfbf1', color: '#0d9488', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.06em' }}>
                    ADMINISTRADOR PRINCIPAL
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditMode(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0f4c35', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0a3526')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0f4c35')}
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {editMode ? 'Guardar' : 'Editar'}
              </button>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { label: 'Nombre Completo',      value: 'Carlos Alberto Rodriguez Santos', color: '#0f172a' },
                { label: 'Correo Electrónico',   value: 'c.rodriguez@yakufarms.com',       color: '#0f172a' },
                { label: 'ID de Granja Asignada',value: '#FINCA-SJ-2024',                  color: '#0d9488' },
                { label: 'Rol de Usuario',        value: 'Administrador',                   color: '#0f172a' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</div>
                  {editMode && item.label !== 'ID de Granja Asignada' && item.label !== 'Rol de Usuario'
                    ? <input defaultValue={item.value} style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 10px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', boxSizing: 'border-box', color: '#0f172a' }} />
                    : <div style={{ fontSize: '14px', fontWeight: 600, color: item.color }}>{item.value}</div>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Subscription card */}
          <div style={{ backgroundColor: '#0d1b2e', borderRadius: '14px', padding: '24px 28px', backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(13,152,136,0.15) 0%, transparent 60%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <svg width="16" height="16" fill="none" stroke="#0d9488" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#0d9488', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Plan de Suscripción</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#fff', marginBottom: '10px' }}>Premium Gold</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#fff' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                    Activo
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Renovación: 12 Oct, 2024</span>
                </div>
              </div>
              <button style={{ backgroundColor: '#0d9488', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 22px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0f766e')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0d9488')}
              >
                Gestionar Plan
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Security card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <svg width="20" height="20" fill="none" stroke="#0f172a" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Seguridad</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Contraseña Actual</label>
                <PasswordInput placeholder="••••••••••••" value={passwordActual} onChange={setPasswordActual} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Nueva Contraseña</label>
                <PasswordInput placeholder="Mín. 8 caracteres" value={passwordNueva} onChange={setPasswordNueva} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Confirmar Nueva Contraseña</label>
                <PasswordInput placeholder="Repetir contraseña" value={passwordConfirmar} onChange={setPasswordConfirmar} />
              </div>

              {successMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '13px', borderRadius: '8px', padding: '10px 12px' }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  {successMsg}
                </div>
              )}

              <button
                onClick={handleActualizarPassword}
                style={{ width: '100%', padding: '11px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#334155', cursor: 'pointer', marginTop: '4px' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              >
                Actualizar Contraseña
              </button>
            </div>
          </div>

          {/* Preferences card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <svg width="20" height="20" fill="none" stroke="#0f172a" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Preferencias</h2>
            </div>

            <PrefRow
              icon={<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>}
              label="Idioma del Sistema"
              sub="Español (Latinoamérica)"
              right={
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: '4px' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              }
            />
            <PrefRow
              icon={<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
              label="Modo Oscuro"
              sub="Seguir sistema"
              right={<Toggle on={modoOscuro} onChange={setModoOscuro} />}
            />
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}
