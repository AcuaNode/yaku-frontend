import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const { i18n } = useTranslation()
  const current = i18n.language.startsWith('en') ? 'en' : 'es'

  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', overflow: 'hidden', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
      {(['es', 'en'] as const).map(lang => (
        <button
          key={lang}
          onClick={() => i18n.changeLanguage(lang)}
          style={{
            padding: compact ? '3px 8px' : '4px 10px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: current === lang ? 'rgba(56,189,248,0.25)' : 'transparent',
            color: current === lang ? '#38bdf8' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.15s',
            letterSpacing: '0.05em',
          }}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
