import { useState } from 'react'

const VALID_CERTS: Record<string, { name: string; training: string; date: string; certId: string; issueDate: string }> = {
  'PA-CERT-2026-00142': { name: 'Ahmad Rizky', training: 'Structural Analysis for Civil Engineers', date: 'September 7, 2026', certId: 'PA-CERT-2026-00142', issueDate: 'September 12, 2026' },
  'PA-CERT-2026-00089': { name: 'Siti Rahayu', training: 'Project Quality Management Training', date: 'July 15, 2026', certId: 'PA-CERT-2026-00089', issueDate: 'July 18, 2026' },
}

export default function VerifyCertificate() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'idle' | 'found' | 'notfound'>('idle')
  const [cert, setCert] = useState<typeof VALID_CERTS[string] | null>(null)
  const [loading, setLoading] = useState(false)

  const verify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    const found = VALID_CERTS[input.trim().toUpperCase()]
    if (found) { setCert(found); setResult('found') }
    else { setCert(null); setResult('notfound') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F2EFFD] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 2 L34 34 H24 L18 18 L12 34 H2 L18 2Z" fill="#2F2454"/>
              <path d="M11 26 H25 L23 30 H13 Z" fill="#A577D5"/>
            </svg>
          </div>
          <h1 className="text-[#2F2454] text-3xl font-bold mb-2">Certificate Verification</h1>
          <p className="text-gray-500 text-sm">Enter a Certificate ID to verify its authenticity.</p>
          <p className="text-xs text-[#A577D5] mt-1">Try: PA-CERT-2026-00142</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <form onSubmit={verify} className="flex gap-3">
            <input
              value={input}
              onChange={(e) => { setInput(e.target.value); setResult('idle') }}
              placeholder="e.g. PA-CERT-2026-00142"
              required
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A577D5] focus:ring-2 focus:ring-[#A577D5]/20 transition-all text-gray-800 placeholder-gray-400"
            />
            <button type="submit" disabled={loading}
              className="bg-[#2F2454] text-white font-semibold px-5 py-3 rounded-xl hover:bg-[#A577D5] transition-all text-sm disabled:opacity-60 shrink-0">
              {loading ? '...' : 'Verify'}
            </button>
          </form>

          {result === 'found' && cert && (
            <div className="mt-6">
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">✅</div>
                <div>
                  <p className="font-bold text-green-800">Certificate Verified</p>
                  <p className="text-xs text-green-600">This is an authentic Prestigium Academia certificate.</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  ['Participant Name', cert.name],
                  ['Training', cert.training],
                  ['Training Date', cert.date],
                  ['Certificate ID', cert.certId],
                  ['Issue Date', cert.issueDate],
                  ['Issued By', 'Prestigium Academia'],
                ].map(([l, v]) => (
                  <div key={l as string} className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-400 shrink-0">{l as string}</span>
                    <span className="text-xs font-semibold text-gray-800 text-right max-w-[60%]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result === 'notfound' && (
            <div className="mt-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-xl">❌</div>
              <div>
                <p className="font-bold text-red-800">Certificate Not Found</p>
                <p className="text-xs text-red-600">No certificate found with that ID. Please check and try again.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
