import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { trainings } from '../data/mockData'

type AdminSection = 'dashboard' | 'events' | 'participants' | 'registrations' | 'attendance' | 'certificates' | 'articles' | 'gallery' | 'instructors' | 'notifications' | 'settings'

const NAV_ITEMS: { key: AdminSection; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '▣' },
  { key: 'events', label: 'Events', icon: '📅' },
  { key: 'participants', label: 'Participants', icon: '👥' },
  { key: 'registrations', label: 'Registrations', icon: '📋' },
  { key: 'attendance', label: 'Attendance', icon: '✅' },
  { key: 'certificates', label: 'Certificates', icon: '🏆' },
  { key: 'articles', label: 'Articles', icon: '📰' },
  { key: 'gallery', label: 'Gallery', icon: '🖼' },
  { key: 'instructors', label: 'Instructors', icon: '👤' },
  { key: 'notifications', label: 'Notifications', icon: '🔔' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]

const PARTICIPANTS = [
  { id: 'p1', name: 'Ahmad Rizky', email: 'ahmad@example.com', wa: '+62 812-3456-7890', field: 'Civil Engineering', status: 'Junior Engineer', events: 3, attendance: 2, certs: 1, date: 'Jul 10, 2026' },
  { id: 'p2', name: 'Siti Rahayu', email: 'siti@example.com', wa: '+62 821-5678-9012', field: 'QA/QC', status: 'Professional', events: 2, attendance: 2, certs: 2, date: 'Jun 5, 2026' },
  { id: 'p3', name: 'Budi Prasetyo', email: 'budi@example.com', wa: '+62 813-2345-6789', field: 'Electrical Engineering', status: 'Fresh Graduate', events: 1, attendance: 0, certs: 0, date: 'Aug 1, 2026' },
  { id: 'p4', name: 'Dewi Anggraeni', email: 'dewi@example.com', wa: '+62 857-9876-5432', field: 'HSE', status: 'Entry-Level Engineer', events: 4, attendance: 4, certs: 3, date: 'May 20, 2026' },
  { id: 'p5', name: 'Rizal Firmansyah', email: 'rizal@example.com', wa: '+62 878-1234-5678', field: 'Project Management', status: 'Professional', events: 5, attendance: 5, certs: 4, date: 'Mar 15, 2026' },
]

const REGISTRATIONS = [
  { id: 'REG-001', participant: 'Ahmad Rizky', event: 'QA/QC Training', date: 'Aug 10, 2026', status: 'Confirmed', attendance: 'Attended', cert: 'Issued' },
  { id: 'REG-002', participant: 'Siti Rahayu', event: 'Structural Analysis', date: 'Aug 8, 2026', status: 'Registered', attendance: 'Pending', cert: 'Pending' },
  { id: 'REG-003', participant: 'Budi Prasetyo', event: 'Electrical Safety', date: 'Aug 12, 2026', status: 'Confirmed', attendance: 'Pending', cert: 'Pending' },
  { id: 'REG-004', participant: 'Dewi Anggraeni', event: 'HSE Management', date: 'Aug 5, 2026', status: 'Completed', attendance: 'Attended', cert: 'Issued' },
  { id: 'REG-005', participant: 'Rizal Firmansyah', event: 'PM Essentials', date: 'Aug 3, 2026', status: 'Cancelled', attendance: 'Absent', cert: 'N/A' },
]

const ATTENDANCES = [
  { name: 'Ahmad Rizky', regStatus: 'Confirmed', attendStatus: 'Attended', time: '08:15 WIB', sig: true, cert: 'Issued' },
  { name: 'Siti Rahayu', regStatus: 'Confirmed', attendStatus: 'Attended', time: '08:22 WIB', sig: true, cert: 'Issued' },
  { name: 'Budi Prasetyo', regStatus: 'Registered', attendStatus: 'Absent', time: '-', sig: false, cert: 'Pending' },
  { name: 'Dewi Anggraeni', regStatus: 'Confirmed', attendStatus: 'Attended', time: '08:05 WIB', sig: true, cert: 'Issued' },
  { name: 'Rizal Firmansyah', regStatus: 'Confirmed', attendStatus: 'Attended', time: '08:30 WIB', sig: true, cert: 'Issued' },
]

export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreateEvent, setShowCreateEvent] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/login')
  }, [user, navigate])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');*{font-family:'Poppins',sans-serif}`}</style>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} transition-all duration-300 bg-[#2F2454] flex flex-col shrink-0`}>
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none" className="shrink-0">
            <path d="M18 2 L34 34 H24 L18 18 L12 34 H2 L18 2Z" fill="white"/>
            <path d="M11 26 H25 L23 30 H13 Z" fill="#A577D5"/>
          </svg>
          {sidebarOpen && <div className="text-white text-xs font-bold leading-tight"><div>Prestigium</div><div className="text-white/50">Academia</div></div>}
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button key={item.key} onClick={() => setSection(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-all ${section === item.key ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/8'}`}>
              <span className="text-base shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-white/10">
          <Link to="/" className={`flex items-center gap-3 px-3 py-2 text-white/50 hover:text-white text-xs transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
            {sidebarOpen && 'Back to Site'}
          </Link>
          <button onClick={() => { logout(); navigate('/') }} className={`flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 text-xs transition-colors mt-1 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/></svg>
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-[#2F2454] text-base capitalize">{section}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A577D5] to-[#2F2454] flex items-center justify-center text-white font-bold text-xs">{user.name[0]}</div>
            <div className="text-xs">
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-gray-400">Administrator</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">

          {/* Dashboard */}
          {section === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Total Participants', value: '1,239', change: '+48 this month', icon: '👥', color: 'bg-blue-50 text-blue-700' },
                  { label: 'Total Events', value: '25', change: '6 upcoming', icon: '📅', color: 'bg-purple-50 text-purple-700' },
                  { label: 'Upcoming Events', value: '6', change: 'Next: Aug 23', icon: '🔜', color: 'bg-orange-50 text-orange-700' },
                  { label: 'Completed Events', value: '19', change: '100% rate', icon: '✅', color: 'bg-green-50 text-green-700' },
                  { label: 'Attendance Rate', value: '87%', change: '+3% vs last', icon: '📊', color: 'bg-teal-50 text-teal-700' },
                  { label: 'Certificates Issued', value: '1,004', change: '+22 this week', icon: '🏆', color: 'bg-yellow-50 text-yellow-700' },
                ].map((s) => (
                  <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-xs font-medium mt-0.5 opacity-80">{s.label}</div>
                    <div className="text-[10px] opacity-60 mt-1">{s.change}</div>
                  </div>
                ))}
              </div>

              {/* Charts area */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-[#2F2454] text-sm mb-4">Registrations Over Time</h3>
                  <div className="h-36 flex items-end gap-2">
                    {[40, 65, 55, 80, 95, 72, 110, 88, 120, 105, 140, 130].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t bg-gradient-to-t from-[#2F2454] to-[#A577D5] transition-all hover:opacity-80" style={{ height: `${(v / 140) * 100}%` }} />
                        <span className="text-[8px] text-gray-400">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-[#2F2454] text-sm mb-4">Participants by Field</h3>
                  <div className="space-y-2.5">
                    {[['Civil Engineering', 28], ['QA/QC', 22], ['Project Management', 18], ['Electrical', 14], ['HSE', 12], ['Other', 6]].map(([l, v]) => (
                      <div key={l as string} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-32 shrink-0 truncate">{l as string}</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#A577D5] to-[#2F2454] rounded-full" style={{ width: `${v}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-8 text-right">{v}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent activity */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#2F2454] text-sm mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { icon: '📋', text: 'New registration — Ahmad Rizky for QA/QC Training', time: '2 min ago', type: 'registration' },
                    { icon: '✅', text: 'Attendance recorded — Siti Rahayu for Structural Analysis', time: '1 hour ago', type: 'attendance' },
                    { icon: '🏆', text: 'Certificate issued — Rizal Firmansyah (PA-CERT-2026-00203)', time: '3 hours ago', type: 'certificate' },
                    { icon: '📰', text: 'New article published — "HSE Culture: Why Rules Alone..."', time: '1 day ago', type: 'article' },
                    { icon: '🔔', text: 'Reminder sent to 42 participants for upcoming HSE Training', time: '2 days ago', type: 'notification' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                      <span className="text-base shrink-0">{a.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-700">{a.text}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Events */}
          {section === 'events' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5] transition-all" />
                </div>
                <button onClick={() => setShowCreateEvent(true)} className="bg-[#2F2454] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#A577D5] transition-all flex items-center gap-2">
                  <span>+</span> Create Event
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    {['Event', 'Category', 'Date', 'Format', 'Seats', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {trainings.filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase())).map((t) => (
                      <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img src={t.image} alt={t.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-800 text-xs leading-snug">{t.title}</p>
                              <p className="text-gray-400 text-[10px]">{t.instructor.split(',')[0]}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5"><span className="bg-[#F2EFFD] text-[#2F2454] text-[10px] font-semibold px-2 py-0.5 rounded-full">{t.category}</span></td>
                        <td className="px-5 py-3.5 text-xs text-gray-600">{t.date}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-600">{t.format}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-600">{t.seatsLeft}/{t.seats}</td>
                        <td className="px-5 py-3.5"><span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">Published</span></td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1.5">
                            {['Edit', 'Duplicate'].map((a) => (
                              <button key={a} className="text-[10px] font-medium text-gray-500 border border-gray-200 px-2 py-1 rounded-lg hover:border-[#A577D5] hover:text-[#A577D5] transition-all">{a}</button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Participants */}
          {section === 'participants' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search participants..." className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5] transition-all" />
                <button className="border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm hover:border-[#A577D5] transition-all">Export CSV</button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                <table className="w-full text-sm min-w-max">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    {['Name', 'Email', 'Field', 'Status', 'Events', 'Attendance', 'Certificates', 'Registered', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {PARTICIPANTS.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase())).map((p) => (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A577D5] to-[#2F2454] flex items-center justify-center text-white text-xs font-bold shrink-0">{p.name[0]}</div>
                            <div>
                              <p className="font-semibold text-gray-800 text-xs">{p.name}</p>
                              <p className="text-gray-400 text-[10px]">{p.wa}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-600">{p.email}</td>
                        <td className="px-4 py-3.5 text-xs text-gray-600">{p.field}</td>
                        <td className="px-4 py-3.5"><span className="bg-[#F2EFFD] text-[#2F2454] text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">{p.status}</span></td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-gray-700 text-center">{p.events}</td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-gray-700 text-center">{p.attendance}</td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-gray-700 text-center">{p.certs}</td>
                        <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{p.date}</td>
                        <td className="px-4 py-3.5">
                          <button className="text-[10px] font-medium text-[#A577D5] border border-[#DBCDFD] px-2.5 py-1 rounded-lg hover:bg-[#F2EFFD] transition-all">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Registrations */}
          {section === 'registrations' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-[#2F2454] text-sm">All Registrations</h3>
              </div>
              <table className="w-full text-sm min-w-max">
                <thead><tr className="bg-gray-50 border-b border-gray-100">
                  {['Registration ID', 'Participant', 'Event', 'Date', 'Status', 'Attendance', 'Certificate'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {REGISTRATIONS.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 text-xs font-mono text-gray-600">{r.id}</td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-gray-800">{r.participant}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-600">{r.event}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">{r.date}</td>
                      <td className="px-4 py-3.5"><StatusChip label={r.status} /></td>
                      <td className="px-4 py-3.5"><StatusChip label={r.attendance} /></td>
                      <td className="px-4 py-3.5"><StatusChip label={r.cert} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Attendance */}
          {section === 'attendance' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-[#2F2454] text-sm">QA/QC Training — August 23, 2026</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Jakarta Convention Center</p>
                  </div>
                  <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:border-[#A577D5]">
                    <option>QA/QC Training — Aug 23</option>
                    <option>Structural Analysis — Sep 7</option>
                    <option>HSE Management — Sep 12</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[['Total Registered', '50'], ['Present', '42'], ['Absent', '8'], ['Attendance Rate', '84%']].map(([l, v]) => (
                    <div key={l as string} className="bg-[#F2EFFD] rounded-xl p-3 text-center">
                      <p className="text-[#2F2454] text-xl font-bold">{v}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{l as string}</p>
                    </div>
                  ))}
                </div>
                <table className="w-full text-xs min-w-max">
                  <thead><tr className="border-b border-gray-100">
                    {['Participant', 'Reg Status', 'Attendance', 'Check-in Time', 'Signature', 'Certificate'].map((h) => (
                      <th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500 uppercase tracking-wide text-[10px]">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {ATTENDANCES.map((a, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 font-semibold text-gray-800">{a.name}</td>
                        <td className="py-3 px-3"><StatusChip label={a.regStatus} /></td>
                        <td className="py-3 px-3"><StatusChip label={a.attendStatus} /></td>
                        <td className="py-3 px-3 text-gray-600">{a.time}</td>
                        <td className="py-3 px-3">{a.sig ? <span className="text-green-600 font-semibold">✓ Signed</span> : <span className="text-gray-400">—</span>}</td>
                        <td className="py-3 px-3"><StatusChip label={a.cert} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Certificates */}
          {section === 'certificates' && (
            <div className="space-y-5">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[['Total Issued', '1,004', '🏆'], ['This Month', '48', '📅'], ['Pending', '23', '⏳']].map(([l, v, icon]) => (
                  <div key={l as string} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                    <span className="text-3xl">{icon as string}</span>
                    <div>
                      <p className="text-2xl font-bold text-[#2F2454]">{v}</p>
                      <p className="text-gray-400 text-xs">{l as string}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-[#2F2454] text-sm">Certificate Registry</h3>
                  <Link to="/verify-certificate" className="text-xs text-[#A577D5] hover:underline">Verify a certificate →</Link>
                </div>
                <table className="w-full text-xs min-w-max">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    {['Certificate ID', 'Participant', 'Training', 'Date', 'Issue Date', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {[
                      { id: 'PA-CERT-2026-00142', name: 'Ahmad Rizky', training: 'Structural Analysis', date: 'Sep 7, 2026', issued: 'Sep 12, 2026' },
                      { id: 'PA-CERT-2026-00089', name: 'Siti Rahayu', training: 'QA/QC Training', date: 'Jul 15, 2026', issued: 'Jul 18, 2026' },
                      { id: 'PA-CERT-2026-00073', name: 'Dewi Anggraeni', training: 'HSE Management', date: 'Jun 5, 2026', issued: 'Jun 8, 2026' },
                      { id: 'PA-CERT-2026-00203', name: 'Rizal Firmansyah', training: 'PM Essentials', date: 'Aug 3, 2026', issued: 'Aug 5, 2026' },
                    ].map((c) => (
                      <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-gray-600">{c.id}</td>
                        <td className="px-4 py-3.5 font-semibold text-gray-800">{c.name}</td>
                        <td className="px-4 py-3.5 text-gray-600">{c.training}</td>
                        <td className="px-4 py-3.5 text-gray-500">{c.date}</td>
                        <td className="px-4 py-3.5 text-gray-500">{c.issued}</td>
                        <td className="px-4 py-3.5">
                          <button className="text-[#A577D5] border border-[#DBCDFD] px-2.5 py-1 rounded-lg hover:bg-[#F2EFFD] transition-all font-medium">Download</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notifications */}
          {section === 'notifications' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
              {[
                { icon: '📋', title: 'New Registration', body: 'Ahmad Rizky registered for QA/QC Training', time: '2 min ago', unread: true },
                { icon: '✅', title: 'Attendance Recorded', body: 'Siti Rahayu checked in for Structural Analysis Training', time: '1 hour ago', unread: true },
                { icon: '🏆', title: 'Certificate Issued', body: 'Certificate PA-CERT-2026-00203 issued to Rizal Firmansyah', time: '3 hours ago', unread: false },
                { icon: '⏰', title: 'Registration Deadline', body: 'HSE Management Training registration closes in 5 days', time: '1 day ago', unread: false },
                { icon: '📅', title: 'Event Updated', body: 'Welding Inspection Training venue changed to Cikarang', time: '2 days ago', unread: false },
              ].map((n, i) => (
                <div key={i} className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${n.unread ? 'bg-[#F2EFFD]/50' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-[#F2EFFD] flex items-center justify-center text-lg shrink-0">{n.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 text-sm">{n.title}</p>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-[#A577D5]" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Settings */}
          {section === 'settings' && (
            <div className="max-w-2xl space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#2F2454] text-sm mb-4">Platform Settings</h3>
                {[['Platform Name', 'Prestigium Academia'], ['Contact Email', 'admin@prestigium.ac.id'], ['Support WhatsApp', '+62 21-1234-5678'], ['Certificate ID Format', 'PA-CERT-YYYY-NNNNN']].map(([l, v]) => (
                  <div key={l as string} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500">{l as string}</span>
                    <input defaultValue={v as string} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:border-[#A577D5] transition-all" />
                  </div>
                ))}
                <button className="mt-4 bg-[#2F2454] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#A577D5] transition-all">Save Settings</button>
              </div>
            </div>
          )}

          {/* Generic sections for articles, gallery, instructors */}
          {['articles', 'gallery', 'instructors'].includes(section) && (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center">
              <div className="text-5xl mb-4">
                {section === 'articles' ? '📰' : section === 'gallery' ? '🖼' : '👤'}
              </div>
              <h2 className="font-bold text-[#2F2454] text-xl mb-2 capitalize">{section} Management</h2>
              <p className="text-gray-400 text-sm">Manage your {section} content here.</p>
            </div>
          )}
        </main>
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateEvent(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-[#2F2454]">Create New Event</h3>
              <button onClick={() => setShowCreateEvent(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Form groups */}
              {[
                { section: 'Basic Information', fields: [['Event Title', 'text', 'e.g. Advanced Project Management'], ['Category', 'select'], ['Short Description', 'textarea']] },
                { section: 'Schedule', fields: [['Start Date', 'date'], ['End Date', 'date'], ['Start Time', 'time'], ['End Time', 'time'], ['Registration Deadline', 'date']] },
                { section: 'Location', fields: [['Format', 'select-format'], ['Venue / Meeting Link', 'text', 'Venue name or Zoom link']] },
                { section: 'Training Details', fields: [['Level', 'select-level'], ['Language', 'select-lang'], ['Max Participants', 'number', '50']] },
              ].map((group) => (
                <div key={group.section}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">{group.section}</p>
                  <div className={`grid gap-3 ${group.fields.length > 2 ? 'md:grid-cols-2' : ''}`}>
                    {group.fields.map(([label, type, placeholder]) => (
                      <div key={label as string}>
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label as string}</label>
                        {type === 'textarea' ? (
                          <textarea rows={3} placeholder={placeholder as string} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A577D5] resize-none" />
                        ) : type === 'select' ? (
                          <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A577D5]">
                            <option>Select category</option>
                            {['Civil Engineering', 'QA/QC', 'HSE', 'Project Management', 'Electrical Engineering', 'Mechanical Engineering'].map((o) => <option key={o}>{o}</option>)}
                          </select>
                        ) : type === 'select-format' ? (
                          <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A577D5]">
                            {['Online', 'Offline', 'Hybrid'].map((o) => <option key={o}>{o}</option>)}
                          </select>
                        ) : type === 'select-level' ? (
                          <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A577D5]">
                            {['Beginner', 'Intermediate', 'Advanced'].map((o) => <option key={o}>{o}</option>)}
                          </select>
                        ) : type === 'select-lang' ? (
                          <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A577D5]">
                            {['Indonesian', 'English'].map((o) => <option key={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input type={type as string} placeholder={placeholder as string} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A577D5] transition-all" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-[#2F2454] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#A577D5] transition-all">Publish Event</button>
                <button className="border border-gray-200 text-gray-600 font-medium py-3 px-5 rounded-xl text-sm hover:bg-gray-50 transition-all">Save Draft</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusChip({ label }: { label: string }) {
  const map: Record<string, string> = {
    Confirmed: 'bg-green-100 text-green-700',
    Registered: 'bg-blue-100 text-blue-700',
    Completed: 'bg-purple-100 text-purple-700',
    Cancelled: 'bg-red-100 text-red-700',
    Attended: 'bg-green-100 text-green-700',
    Pending: 'bg-gray-100 text-gray-500',
    Absent: 'bg-red-100 text-red-600',
    Issued: 'bg-yellow-100 text-yellow-700',
    'N/A': 'bg-gray-100 text-gray-400',
  }
  return <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${map[label] || 'bg-gray-100 text-gray-600'}`}>{label}</span>
}
