interface Props {
  label: string
  value?: string
  valueLarge?: string
  valueColor?: string
  badge?: string
  badgeColor?: string
  badgeBg?: string
  sub?: string
  subColor?: string
}

export default function StatCard({ label, value, valueLarge, valueColor, badge, badgeColor, badgeBg, sub, subColor }: Props) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', minWidth: 0, overflow: 'hidden' }}>
      <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 0 8px' }}>
        {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {valueLarge
          ? <span style={{ fontSize: '20px', fontWeight: 800, color: valueColor, lineHeight: 1 }}>{valueLarge}</span>
          : <span style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{value}</span>
        }
        {badge && (
          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', color: badgeColor, backgroundColor: badgeBg, whiteSpace: 'nowrap' }}>
            {badge}
          </span>
        )}
      </div>
      {sub && (
        <p style={{ fontSize: '11px', marginTop: '5px', color: subColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '5px 0 0' }}>
          {sub}
        </p>
      )}
    </div>
  )
}
