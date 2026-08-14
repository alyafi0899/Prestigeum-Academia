import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { dataService } from '../data/dataService'

export default function TrainingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [openModule, setOpenModule] = useState<number | null>(0)
  const [training, setTraining] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      dataService.getTrainingById(id)
        .then(setTraining)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading details...</div>

  if (!training) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-[#2F2454] mb-2">Training Not Found</h2>
        <Link to="/training" className="text-[#A577D5] hover:underline">Back to Training</Link>
      </div>
    </div>
  )

  const pct = training.seats > 0 ? Math.round(((training.seats - training.seats_left) / training.seats) * 100) : 0
  const levelColor: Record<string, string> = { Beginner: 'bg-green-100 text-green-700', Intermediate: 'bg-yellow-100 text-yellow-700', Advanced: 'bg-red-100 text-red-700' }

  const handleRegister = () => {
    if (!user) { navigate('/login', { state: { from: `/training/${id}/register` } }); return }
    navigate(`/training/${id}/register`)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={training.image_url} alt={training.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(47,36,84,0.5) 0%, rgba(47,36,84,0.85) 100%)' }} />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-8">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-[#A577D5] text-white text-xs font-semibold px-3 py-1 rounded-full">{training.category}</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${levelColor[training.level]}`}>{training.level}</span>
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">{training.format}</span>
            </div>
            <h1 className="text-white text-2xl md:text-4xl font-bold mb-2 leading-tight">{training.title}</h1>
            <p className="text-white/75 text-sm max-w-2xl">{training.short_desc}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-6 shadow-sm">
              {[['overview', 'Overview'], ['modules', 'Modules'], ['instructor', 'Instructor']].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === key ? 'bg-[#2F2454] text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}>
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-7">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-[#2F2454] text-lg mb-3">About This Training</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{training.description}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-[#2F2454] text-lg mb-4">What Will You Learn?</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {training.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-3 bg-[#F2EFFD] rounded-xl p-3.5">
                        <div className="w-6 h-6 rounded-full bg-[#A577D5] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                        <span className="text-sm text-gray-700 leading-snug">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-[#2F2454] text-lg mb-2">Target Audience</h3>
                  <p className="text-gray-600 text-sm">{training.targetAudience}</p>
                </div>
              </div>
            )}

            {activeTab === 'modules' && (
              <div className="space-y-3">
                {training.modules.map((mod, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button onClick={() => setOpenModule(openModule === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-[#2F2454] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <p className="font-semibold text-[#2F2454] text-sm">Module {String(i + 1).padStart(2, '0')}</p>
                          <p className="text-gray-700 font-medium text-sm">{mod.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 hidden md:block">{mod.duration}</span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${openModule === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                      </div>
                    </button>
                    {openModule === i && (
                      <div className="px-6 pb-5 border-t border-gray-50">
                        <p className="text-gray-600 text-sm mt-4 mb-3">{mod.desc}</p>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Learning Outcomes</p>
                        <ul className="space-y-1.5">
                          {mod.outcomes.map((o, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                              <svg width="14" height="14" fill="none" stroke="#A577D5" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#2F2454] text-lg mb-5">Meet Your Instructor</h3>
                <div className="flex flex-col md:flex-row gap-5">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400" alt={training.instructor} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
                  <div>
                    <p className="font-bold text-[#2F2454] text-base">{training.instructor}</p>
                    <p className="text-[#A577D5] text-sm font-medium">{training.instructor_title}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="bg-[#F2EFFD] text-[#2F2454] text-xs font-semibold px-3 py-1 rounded-full">Engineering Specialist</span>
                      <span className="bg-[#F2EFFD] text-[#2F2454] text-xs font-semibold px-3 py-1 rounded-full">15+ Years Experience</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Registration card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <div className="text-2xl font-bold text-[#2F2454] mb-1">
                {training.price === 'Free' ? <span className="text-green-600">Free</span> : `Rp ${Number(training.price).toLocaleString('id-ID')}`}
              </div>
              <p className="text-xs text-gray-400 mb-5">per participant</p>

              {/* Seats progress */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500">{training.seats_left} seats remaining</span>
                  <span className="font-semibold text-[#2F2454]">{pct}% filled</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#A577D5] to-[#2F2454] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <button onClick={handleRegister}
                disabled={training.seats_left <= 0}
                className="w-full bg-[#2F2454] text-white font-semibold py-3.5 rounded-xl hover:bg-[#A577D5] transition-all text-sm mb-3 disabled:opacity-50">
                {training.seats_left > 0 ? 'Register for Training' : 'Sold Out'}
              </button>
              <p className="text-center text-xs text-gray-400">Deadline: {training.deadline}</p>

              {/* Info list */}
              <div className="mt-6 space-y-3 border-t border-gray-50 pt-5">
                {[
                  ['Training Level', training.level],
                  ['Format', training.format],
                  ['Duration', training.duration],
                  ['Language', training.language],
                  ['Certificate', 'Available'],
                  ['Materials', 'Included'],
                  ['Max Participants', `${training.max_participants} Participants`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-xs text-gray-400 shrink-0">{label}</span>
                    <span className="text-xs font-semibold text-gray-700 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="font-semibold text-[#2F2454] text-sm mb-3">Location & Schedule</p>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-2.5 text-gray-600">
                  <span className="text-base mt-0.5">📅</span>
                  <div>
                    <p className="font-medium text-gray-800">{training.date}</p>
                    <p className="text-xs text-gray-400">{training.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-gray-600">
                  <span className="text-base mt-0.5">📍</span>
                  <p className="text-sm">{training.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
