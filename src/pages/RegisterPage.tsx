import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import yakuLogo from '../assets/yaku-logo.png'
import { useAuth } from '../hooks/useAuth'
import type { RegisterCredentials } from '../domain/auth/Auth'

function AuthLangToggle() {
  const { i18n } = useTranslation()
  const current = i18n.language.startsWith('en') ? 'en' : 'es'
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
      <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', fontSize: '11px', fontWeight: 700 }}>
        {(['es', 'en'] as const).map(lang => (
          <button
            key={lang}
            onClick={() => i18n.changeLanguage(lang)}
            style={{ padding: '4px 10px', border: 'none', cursor: 'pointer', backgroundColor: current === lang ? '#0f172a' : 'transparent', color: current === lang ? '#fff' : '#94a3b8', transition: 'all 0.15s', letterSpacing: '0.05em' }}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterCredentials>({ username: '', firstName: '', lastName: '', email: '', password: '', role: 'ADMIN', farmToken: '' })
  const [showPassword, setShowPassword] = useState(false)
  const { register, loading, error, setError } = useAuth()
  const { t } = useTranslation()

  function handleChange(field: keyof RegisterCredentials, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    register(form)
  }

  const inputWrapper: React.CSSProperties = { display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', gap: '8px' }
  const inputStyle: React.CSSProperties = { flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#334155', backgroundColor: 'transparent' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#eef1f8' }} className="flex items-center justify-center p-4">
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '380px', padding: '40px 36px' }}>

        <AuthLangToggle />

        <div className="flex justify-center mb-6">
          <img src={yakuLogo} alt="YacuControl" style={{ width: '300px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={labelStyle}>{t('register.username')}</label>
            <div style={inputWrapper}>
              <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input type="text" placeholder="User123" value={form.username} onChange={e => handleChange('username', e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ minWidth: 0 }}>
              <label style={labelStyle}>{t('register.firstName')}</label>
              <div style={inputWrapper}>
                <input type="text" placeholder="Carlos" value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <label style={labelStyle}>{t('register.lastName')}</label>
              <div style={inputWrapper}>
                <input type="text" placeholder="Rodriguez" value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>{t('register.email')}</label>
            <div style={inputWrapper}>
              <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input type="email" placeholder="usuario@empresa.pe" value={form.email} onChange={e => handleChange('email', e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>{t('register.password')}</label>
            <div style={inputWrapper}>
              <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => handleChange('password', e.target.value)} style={inputStyle} />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                  }
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>{t('register.role')}</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {(['ADMIN', 'OPERATOR'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, role: r, farmToken: '' }))}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: `2px solid ${form.role === r ? '#38bdf8' : '#e2e8f0'}`,
                    backgroundColor: form.role === r ? '#f0f9ff' : '#fff',
                    color: form.role === r ? '#0284c7' : '#64748b',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {r === 'ADMIN' ? t('register.roleAdmin') : t('register.roleOperator')}
                </button>
              ))}
            </div>
          </div>

          {form.role === 'OPERATOR' && (
            <div>
              <label style={labelStyle}>{t('register.farmToken')}</label>
              <div style={inputWrapper}>
                <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <input
                  type="text"
                  placeholder={t('register.farmTokenPlaceholder')}
                  value={form.farmToken ?? ''}
                  onChange={e => handleChange('farmToken', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: '13px', borderRadius: '8px', padding: '10px 12px' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: '4px', backgroundColor: loading ? '#7dd3ea' : '#38bdf8', color: '#fff', fontWeight: 600, fontSize: '14px', borderRadius: '8px', padding: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? t('register.submitting') : t('register.submit')}
            {!loading && (
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
          </button>
        </form>

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <a href="#" style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none' }}>{t('register.forgotPassword')}</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{t('common.or')}</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none' }}>{t('register.alreadyHaveAccount')}</Link>
            {' '}{t('register.signIn')}
          </p>
        </div>
      </div>
    </div>
  )
}
