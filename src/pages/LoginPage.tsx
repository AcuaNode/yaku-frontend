import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import yakuLogo from '../assets/yaku-logo.png'
import { useAuth } from '../hooks/useAuth'
import type { LoginCredentials } from '../domain/auth/Auth'

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

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error, setError } = useAuth()
  const { t } = useTranslation()

  function handleChange(field: keyof LoginCredentials, value: string) {
    setCredentials(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    login(credentials)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#eef1f8' }} className="flex items-center justify-center p-4">
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '380px', padding: '40px 36px' }}>

        <AuthLangToggle />

        <div className="flex justify-center mb-6">
          <img src={yakuLogo} alt="YacuControl" style={{ width: '300px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              {t('login.username')}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', gap: '8px' }}>
              <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                placeholder="User123"
                value={credentials.username}
                onChange={e => handleChange('username', e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#334155', backgroundColor: 'transparent' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              {t('login.password')}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', gap: '8px' }}>
              <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={credentials.password}
                onChange={e => handleChange('password', e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#334155', backgroundColor: 'transparent' }}
              />
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
            {loading ? t('login.submitting') : t('login.submit')}
            {!loading && (
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
          </button>
        </form>

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <a href="#" style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none' }}>{t('login.forgotPassword')}</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{t('common.or')}</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            <Link to="/register" style={{ color: '#38bdf8', textDecoration: 'none' }}>{t('login.noAccount')}</Link>
            {' '}{t('login.requestAccess')}
          </p>
        </div>
      </div>
    </div>
  )
}
