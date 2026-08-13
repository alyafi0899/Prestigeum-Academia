import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { trainings } from '../data/mockData'

const MY_TRAININGS = [
  { ...trainings[0], regStatus: 'Confirmed', attendStatus: 'Open', hasCert: false, certAvailable: false },
  { ...trainings[3], regStatus: 'Registered', attendStatus: 'Pending', hasCert: false, certAvailable: false },
  { ...trainings[1], regStatus: 'Completed', attendStatus: 'Attended', hasCert: true, certAvailable: true },
]

const CERT_ID = 'PA-CERT-2026-00142'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('upcoming')
  const [showAttend, setShowAttend] = useState(false)
  const [showCert, setShowCert] = useState(false)
  const [attended, setAttended] = useState(false)
  const [signed, setSigned] = useState(false)
  const [consent, setConsent] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  if (!user) return null

  // Signature pad logic
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    setDrawing(true)
    const r = canvasRef.current!.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - r.left, e.clientY - r.top)
  }
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const r = canvasRef.current!.getBoundingClientRect()
    ctx.lineTo(e.clientX - r.left, e.clientY - r.top)
    ctx.strokeStyle = '#2F2454'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.stroke()
    setHasDrawn(true)
  }
  const stopDraw = () => setDrawing(false)
  const clearSig = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !canvasRef.current) return
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setHasDrawn(false)
    setSigned(false)
  }

  const stats = [
    { label: 'Registered Trainings', value: 3, color: 'bg-[#F2EFFD] text-[#2F2454]', icon: '📋' },
    { label: 'Upcoming Trainings', value: 2, color: 'bg-blue-50 text-blue-700', icon: '📅' },
    { label: 'Completed Trainings', value: 1, color: 'bg-green-50 text-green-700', icon: '✅' },
    { label: 'Certificates', value: 1, color: 'bg-yellow-50 text-yellow-700', icon: '🏆' },
  ]

  const filtered = MY_TRAININGS.filter((t) => {
    if (tab === 'upcoming') return t.regStatus !== 'Completed'
    if (tab === 'completed') return t.regStatus === 'Completed'
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2F2454] px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Participant Dashboard</p>
            <h1 className="text-white text-2xl font-bold">Welcome back, {user.name.split(' ')[0]} 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A577D5] to-[#2F2454] border-2 border-white/30 flex items-center justify-center text-white font-bold">{user.name[0]}</div>
            <button onClick={() => { logout(); navigate('/') }} className="text-white/60 hover:text-white text-xs transition-colors">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-5 flex flex-col`}>
              <span className="text-2xl mb-2">{s.icon}</span>
              <span className="text-3xl font-bold">{s.value}</span>
              <span className="text-xs font-medium mt-1 opacity-80">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Attendance alert */}
        {!attended && (
          <div className="bg-white rounded-2xl border border-orange-200 p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">🎯</div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Attendance Open — QA/QC Training</p>
                <p className="text-xs text-gray-500 mt-0.5">August 23, 2026 · Check-in closes at 09:00 WIB</p>
              </div>
            </div>
            <button onClick={() => setShowAttend(true)} className="bg-[#2F2454] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#A577D5] transition-all">
              Check In
            </button>
          </div>
        )}

        {attended && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">✅</div>
            <div className="flex-1">
              <p className="font-bold text-green-800 text-sm">Attendance Recorded — QA/QC Training</p>
              <p className="text-xs text-green-600 mt-0.5">Your certificate will be available shortly.</p>
            </div>
            <button onClick={() => setShowCert(true)} className="bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-green-700 transition-all">
              View Certificate
            </button>
          </div>
        )}

        {/* My Trainings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-[#2F2454] text-base">My Trainings</h2>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {[['upcoming', 'Upcoming'], ['completed', 'Completed'], ['all', 'All']].map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab === key ? 'bg-white text-[#2F2454] shadow-sm' : 'text-gray-500'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map((t) => (
              <div key={t.id} className="px-6 py-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{t.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.date} · {t.format}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge label={t.regStatus} />
                    {t.attendStatus !== 'Pending' && <StatusBadge label={t.attendStatus} />}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Link to={`/training/${t.id}`} className="text-xs font-semibold text-[#A577D5] border border-[#DBCDFD] px-3 py-1.5 rounded-lg hover:bg-[#F2EFFD] transition-all">
                    Open Training
                  </Link>
                  {t.certAvailable && (
                    <button onClick={() => setShowCert(true)} className="text-xs font-semibold text-white bg-yellow-500 px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition-all">
                      View Certificate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
      {showAttend && !attended && (
        <Modal onClose={() => setShowAttend(false)}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#2F2454] text-white flex items-center justify-center font-bold text-sm">✓</div>
              <div>
                <h3 className="font-bold text-[#2F2454]">Training Attendance</h3>
                <p className="text-xs text-gray-500">Project Quality Management Training</p>
              </div>
            </div>
            <div className="bg-[#F2EFFD] rounded-xl p-4 mb-5 space-y-1.5">
              {[['Participant', user.name], ['Date', 'August 23, 2026'], ['Status', 'Attendance Open 🟢']].map(([l, v]) => (
                <div key={l as string} className="flex justify-between text-sm">
                  <span className="text-gray-400 text-xs">{l as string}</span>
                  <span className="text-xs font-semibold text-gray-800">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Digital Signature</p>
            <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 mb-3 overflow-hidden">
              <canvas ref={canvasRef} width={380} height={140} className="w-full cursor-crosshair touch-none"
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} />
            </div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-400">Sign above using your mouse or touch</p>
              <button onClick={clearSig} className="text-xs text-red-400 hover:text-red-600 font-medium">Clear</button>
            </div>
            <label className="flex items-start gap-3 mb-5 cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#A577D5]" />
              <span className="text-xs text-gray-600">I confirm that I attended this training.</span>
            </label>
            {!signed ? (
              <button onClick={() => { if (hasDrawn && consent) setSigned(true) }}
                disabled={!hasDrawn || !consent}
                className="w-full bg-[#2F2454] text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-40 hover:bg-[#A577D5] transition-all">
                Submit Attendance
              </button>
            ) : (
              <button onClick={() => { setAttended(true); setShowAttend(false) }}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-green-700 transition-all">
                ✓ Attendance Confirmed — Done
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* Certificate Modal */}
      {showCert && (
        <Modal onClose={() => setShowCert(false)}>
          <div className="p-6">
            <h3 className="font-bold text-[#2F2454] text-base mb-4">Certificate Preview</h3>
            {/* Certificate */}
            <div className="border-4 border-[#2F2454] rounded-2xl p-6 bg-gradient-to-br from-[#F2EFFD] to-white text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2F2454] to-[#A577D5]" />
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
                  <path d="M18 2 L34 34 H24 L18 18 L12 34 H2 L18 2Z" fill="#2F2454"/>
                  <path d="M11 26 H25 L23 30 H13 Z" fill="#A577D5"/>
                </svg>
                <span className="text-[#2F2454] font-bold text-sm">Prestigium Academia</span>
              </div>
              <p className="text-gray-400 text-xs tracking-widest uppercase mb-2">Certificate of Completion</p>
              <p className="text-gray-500 text-xs mb-3">This is to certify that</p>
              <p className="text-[#2F2454] text-2xl font-bold mb-3">{user.name}</p>
              <p className="text-gray-500 text-xs mb-1">has successfully completed</p>
              <p className="text-[#2F2454] font-bold text-base mb-4">Structural Analysis for Civil Engineers</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[['Date', 'September 7, 2026'], ['Duration', '18 Hours'], ['Instructor', 'Dr. Hendra Wijaya']].map(([l, v]) => (
                  <div key={l as string} className="bg-white/70 rounded-xl p-2">
                    <p className="text-gray-400 text-[10px]">{l as string}</p>
                    <p className="text-gray-700 text-[10px] font-bold">{v}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#DBCDFD] pt-3">
                <p className="text-[10px] text-gray-400">Certificate ID: {CERT_ID}</p>
                <p className="text-[10px] text-gray-400">Issued: August 12, 2026</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-[#2F2454] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#A577D5] transition-all">Download PDF</button>
              <Link to="/verify-certificate" onClick={() => setShowCert(false)} className="flex-1 border border-[#2F2454] text-[#2F2454] text-sm font-semibold py-3 rounded-xl text-center hover:bg-[#F2EFFD] transition-all">Verify</Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function StatusBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    Confirmed: 'bg-green-100 text-green-700',
    Registered: 'bg-blue-100 text-blue-700',
    Completed: 'bg-purple-100 text-purple-700',
    Attended: 'bg-green-100 text-green-700',
    Open: 'bg-orange-100 text-orange-700',
    Pending: 'bg-gray-100 text-gray-500',
  }
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[label] || 'bg-gray-100 text-gray-600'}`}>{label}</span>
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all z-20">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round"/></svg>
        </button>
        {children}
      </div>
    </div>
  )
}
