// Shared branding + styles for FekrahEdu invoice emails (Arabic / RTL).
export const SITE_NAME = 'FekrahEdu'
export const SITE_URL = 'https://fekrahedu.com'

export const fmt = (v: unknown) => {
  const n = Number(v ?? 0)
  if (!isFinite(n)) return String(v ?? '0')
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const main = { direction: 'rtl' as const, textAlign: 'right' as const,
  backgroundColor: '#f1f5f9',
  fontFamily: "'IBM Plex Sans Arabic', Tahoma, Arial, sans-serif",
  margin: 0,
  padding: '24px 12px',
  width: '100%',
}

export const container = { direction: 'rtl' as const, textAlign: 'right' as const,
  padding: '0',
  width: '100%',
  maxWidth: '620px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '14px',
  overflow: 'hidden' as const,
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  boxSizing: 'border-box' as const,
}

export const header = {
  background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
  padding: '24px 28px',
  color: '#fff',
}
export const brand = { fontSize: '20px', fontWeight: '800' as const, color: '#ffffff', margin: 0 }
export const tagline = { fontSize: '12px', color: '#bfdbfe', margin: '4px 0 0' }
export const badge = {
  display: 'inline-block' as const,
  backgroundColor: 'rgba(255,255,255,0.2)',
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: '700' as const,
  padding: '6px 12px',
  borderRadius: '20px',
  margin: 0,
}

export const heroBox = (bg: string, border: string) => ({
  margin: '24px 28px',
  padding: '24px',
  backgroundColor: bg,
  border: `2px solid ${border}`,
  borderRadius: '14px',
  textAlign: 'center' as const,
})
export const heroLabel = (color: string) => ({
  fontSize: '12px',
  color,
  fontWeight: '700' as const,
  margin: '0 0 8px',
  letterSpacing: '1px',
})
export const heroAmount = (color: string) => ({
  fontSize: '38px',
  fontWeight: '900' as const,
  color,
  margin: 0,
  lineHeight: 1.1,
})
export const heroCurrency = { fontSize: '20px', fontWeight: '700' as const }
export const heroNote = (color: string) => ({ fontSize: '13px', color, margin: '12px 0 0' })

export const greeting = {
  fontSize: '15px',
  color: '#1e293b',
  fontWeight: '700' as const,
  margin: '0 28px 8px',
  textAlign: 'right' as const,
}
export const text = {
  fontSize: '14px',
  color: '#475569',
  lineHeight: '1.9',
  margin: '0 28px 20px',
  textAlign: 'right' as const,
}
export const noteBox = {
  margin: '0 28px 20px',
  padding: '14px 16px',
  backgroundColor: '#f0f9ff',
  borderRight: '4px solid #1d4ed8',
  borderRadius: '8px',
  whiteSpace: 'pre-wrap' as const,
  fontSize: '14px',
  color: '#1e3a8a',
  lineHeight: '1.9',
  textAlign: 'right' as const,
}

export const card = {
  margin: '16px 28px',
  padding: '20px',
  backgroundColor: '#f8fafc',
  border: '2px dashed #cbd5e1',
  borderRadius: '12px',
}
export const cardTitle = {
  fontSize: '14px',
  fontWeight: '800' as const,
  color: '#1e293b',
  margin: '0 0 14px',
  textAlign: 'right' as const,
}

export const tbl = { width: '100%', direction: 'rtl' as const, textAlign: 'right' as const, borderCollapse: 'collapse' as const }
export const trAlt = { backgroundColor: '#ffffff' }
export const trTotal = { background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)' }
export const tdLabel = {
  padding: '10px 12px',
  fontSize: '13px',
  color: '#64748b',
  textAlign: 'right' as const,
  borderBottom: '1px solid #e2e8f0',
  fontWeight: '600' as const,
}
export const tdValue = {
  padding: '10px 12px',
  fontSize: '13px',
  color: '#0f172a',
  textAlign: 'right' as const,
  borderBottom: '1px solid #e2e8f0',
  fontWeight: '700' as const,
  overflowWrap: 'anywhere' as const,
}
export const tdTotalLabel = {
  padding: '14px 12px',
  fontSize: '14px',
  color: '#ffffff',
  textAlign: 'right' as const,
  fontWeight: '700' as const,
}
export const tdTotalValue = {
  padding: '14px 12px',
  fontSize: '18px',
  color: '#ffffff',
  textAlign: 'right' as const,
  fontWeight: '900' as const,
}

export const btnSection = { textAlign: 'center' as const, margin: '24px 28px' }
export const btnPrimary = {
  backgroundColor: '#1d4ed8',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700' as const,
  padding: '14px 32px',
  borderRadius: '10px',
  textDecoration: 'none',
  display: 'inline-block' as const,
}
export const linkSecondary = { color: '#1d4ed8', fontSize: '12px', textDecoration: 'underline' }

export const divider = { borderColor: '#e2e8f0', margin: '8px 28px' }
export const footerBox = { padding: '12px 28px 28px', textAlign: 'center' as const }
export const footerSecure = { fontSize: '12px', color: '#64748b', margin: '0 0 6px' }
export const footerText = { fontSize: '12px', color: '#94a3b8', margin: 0 }
