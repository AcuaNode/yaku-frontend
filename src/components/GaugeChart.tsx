interface GaugeChartProps {
  value: string
  status: string
  statusColor: string
  pct: number
}

export default function GaugeChart({ value, status, statusColor, pct }: GaugeChartProps) {
  const r = 58
  const circ = 2 * Math.PI * r
  const filled = circ * Math.min(Math.max(pct, 0), 1)

  return (
    <svg viewBox="0 0 160 160" style={{ width: '150px', height: '150px' }}>
      <circle cx="80" cy="80" r={r} fill="none" stroke="#f1f5f9" strokeWidth="13" />
      <circle
        cx="80" cy="80" r={r} fill="none"
        stroke="#0d6e4f" strokeWidth="13"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 80 80)"
      />
      <text x="80" y="74" textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="700" fill="#0f172a">
        {value}
      </text>
      <text x="80" y="96" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" fill={statusColor} letterSpacing="0.5">
        {status}
      </text>
    </svg>
  )
}
