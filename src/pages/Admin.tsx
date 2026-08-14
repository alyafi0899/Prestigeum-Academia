import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { dataService } from '../data/dataService'

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
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function Admin() {
  const { user, loading: authLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreateEvent, setShowCreateEvent] = useState(false)

  // Data states
  const [trainings, setTrainings] = useState<any[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [gallery, setGallery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [showCreateArticle, setShowCreateArticle] = useState(false)
  const [showCreateGallery, setShowCreateGallery] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) navigate('/login')
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAllData()
    }
  }, [user])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [tData, rData, pData, cData, aData, gData] = await Promise.all([
        dataService.getTrainings(),
        dataService.getRegistrations(),
        dataService.getProfiles(),
        dataService.getCertificates(),
        dataService.getArticles(),
        dataService.getGallery()
      ])
      setTrainings(tData)
      setRegistrations(rData)
      setProfiles(pData)
      setCertificates(cData)
      setArticles(aData)
      setGallery(gData)
    } catch (err) {
      console.error('Error loading admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newEvent = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      short_desc: formData.get('short_desc') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      duration: formData.get('duration') as string,
      location: formData.get('location') as string,
      format: formData.get('format') as string,
      level: formData.get('level') as string,
      price: formData.get('price') as string,
      seats: parseInt(formData.get('seats') as string),
      seats_left: parseInt(formData.get('seats') as string),
      instructor: formData.get('instructor') as string,
      instructor_title: formData.get('instructor_title') as string,
      deadline: formData.get('deadline') as string,
      image_url: formData.get('image_url') as string || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800'
    }

    try {
      console.log('Creating event:', newEvent)
      const res = await dataService.createTraining(newEvent)
      console.log('Created:', res)
      setShowCreateEvent(false)
      await loadAllData()
      alert('Event published successfully!')
    } catch (err: any) {
      console.error('Failed to create event:', err)
      alert('Failed to publish event: ' + (err.message || 'Unknown error'))
    }
  }

  const handleCreateArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newArticle = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      excerpt: formData.get('excerpt') as string,
      body: formData.get('body') as string,
      author: user?.name || 'Admin',
      read_time: formData.get('read_time') as string,
      image_url: formData.get('image_url') as string || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800'
    }
    try {
      console.log('Creating article:', newArticle)
      await dataService.createArticle(newArticle)
      setShowCreateArticle(false)
      await loadAllData()
      alert('Article published successfully!')
    } catch (err: any) {
      console.error(err)
      alert('Failed to publish article: ' + err.message)
    }
  }

  const handleCreateGallery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newItem = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      caption: formData.get('caption') as string,
      date: formData.get('date') as string,
      image_url: formData.get('image_url') as string || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800'
    }
    try {
      console.log('Adding to gallery:', newItem)
      await dataService.createGalleryItem(newItem)
      setShowCreateGallery(false)
      await loadAllData()
      alert('Gallery item added successfully!')
    } catch (err: any) {
      console.error(err)
      alert('Failed to add to gallery: ' + err.message)
    }
  }

  const handleDeleteTraining = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await dataService.deleteTraining(id)
      loadAllData()
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      await dataService.deleteArticle(id)
      loadAllData()
    }
  }

  const handleDeleteGallery = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await dataService.deleteGalleryItem(id)
      loadAllData()
    }
  }

  const handleIssueCert = async (reg: any) => {
    const certId = `PA-CERT-2026-${Math.floor(Math.random() * 90000) + 10000}`
    try {
      await dataService.issueCertificate({
        id: certId,
        registration_id: reg.id,
        user_id: reg.user_id,
        training_id: reg.training_id
      })
      loadAllData()
    } catch (err) {
      console.error('Failed to issue certificate:', err)
    }
  }

  if (authLoading || (!user || user.role !== 'admin')) return null

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
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-400">Loading data...</div>
          ) : (
            <>
              {/* Dashboard */}
              {section === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {[
                      { label: 'Total Participants', value: profiles.length, change: 'Lifetime', icon: '👥', color: 'bg-blue-50 text-blue-700' },
                      { label: 'Total Events', value: trainings.length, change: 'All time', icon: '📅', color: 'bg-purple-50 text-purple-700' },
                      { label: 'Registrations', value: registrations.length, change: 'Total', icon: '📋', color: 'bg-orange-50 text-orange-700' },
                      { label: 'Attended', value: registrations.filter(r => r.attendance_status === 'Attended').length, change: 'Check-ins', icon: '✅', color: 'bg-green-50 text-green-700' },
                      { label: 'Rate', value: registrations.length > 0 ? `${Math.round((registrations.filter(r => r.attendance_status === 'Attended').length / registrations.length) * 100)}%` : '0%', change: 'Attendance', icon: '📊', color: 'bg-teal-50 text-teal-700' },
                      { label: 'Certificates', value: certificates.length, change: 'Issued', icon: '🏆', color: 'bg-yellow-50 text-yellow-700' },
                    ].map((s) => (
                      <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
                        <div className="text-2xl mb-2">{s.icon}</div>
                        <div className="text-2xl font-bold">{s.value}</div>
                        <div className="text-xs font-medium mt-0.5 opacity-80">{s.label}</div>
                        <div className="text-[10px] opacity-60 mt-1">{s.change}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent registrations */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#2F2454] text-sm mb-4">Recent Registrations</h3>
                    <div className="space-y-3">
                      {registrations.slice(0, 5).map((r, i) => (
                        <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                          <span className="text-base shrink-0">📋</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-700"><span className="font-bold">New registration</span> — {r.pa_trainings.title}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{new Date(r.created_at).toLocaleString()}</p>
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
                                <img src={t.image_url} alt={t.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                <div>
                                  <p className="font-semibold text-gray-800 text-xs leading-snug">{t.title}</p>
                                  <p className="text-gray-400 text-[10px]">{t.instructor}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5"><span className="bg-[#F2EFFD] text-[#2F2454] text-[10px] font-semibold px-2 py-0.5 rounded-full">{t.category}</span></td>
                            <td className="px-5 py-3.5 text-xs text-gray-600">{t.date}</td>
                            <td className="px-5 py-3.5 text-xs text-gray-600">{t.format}</td>
                            <td className="px-5 py-3.5 text-xs text-gray-600">{t.seats_left}/{t.seats}</td>
                            <td className="px-5 py-3.5"><span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">Published</span></td>
                            <td className="px-5 py-3.5">
                              <div className="flex gap-2">
                                <button className="text-[10px] font-medium text-gray-500 border border-gray-200 px-2 py-1 rounded-lg hover:border-[#A577D5] hover:text-[#A577D5] transition-all">Edit</button>
                                <button onClick={() => handleDeleteTraining(t.id)} className="text-[10px] font-medium text-red-500 border border-red-100 px-2 py-1 rounded-lg hover:bg-red-50 transition-all">Delete</button>
                              </div>
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
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-[#2F2454] text-sm">All Registrations</h3>
                  </div>
                  <table className="w-full text-sm min-w-max">
                    <thead><tr className="bg-gray-50 border-b border-gray-100">
                      {['User', 'Event', 'Date', 'Status', 'Attendance', 'Actions'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {registrations.map((r) => (
                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3.5 text-xs font-semibold text-gray-800">{r.user_id.slice(0, 8)}...</td>
                          <td className="px-4 py-3.5 text-xs text-gray-600">{r.pa_trainings.title}</td>
                          <td className="px-4 py-3.5 text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3.5"><StatusChip label={r.status} /></td>
                          <td className="px-4 py-3.5"><StatusChip label={r.attendance_status} /></td>
                          <td className="px-4 py-3.5">
                            {r.attendance_status === 'Attended' && r.status !== 'Completed' && (
                              <button onClick={() => handleIssueCert(r)} className="text-[10px] font-bold text-white bg-[#A577D5] px-2.5 py-1 rounded-lg hover:opacity-80 transition-all">Issue Certificate</button>
                            )}
                          </td>
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
                      <h3 className="font-bold text-[#2F2454] text-sm">Attendance Monitoring</h3>
                    </div>
                    <table className="w-full text-xs min-w-max">
                      <thead><tr className="border-b border-gray-100">
                        {['User ID', 'Event', 'Attendance', 'Check-in Time'].map((h) => (
                          <th key={h} className="text-left py-2.5 px-3 font-semibold text-gray-500 uppercase tracking-wide text-[10px]">{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {registrations.filter(r => r.attendance_status === 'Attended').map((a, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-3 font-semibold text-gray-800">{a.user_id.slice(0, 8)}...</td>
                            <td className="py-3 px-3 text-gray-600">{a.pa_trainings.title}</td>
                            <td className="py-3 px-3"><StatusChip label={a.attendance_status} /></td>
                            <td className="py-3 px-3 text-gray-600">{new Date(a.check_in_time).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Certificates */}
              {section === 'certificates' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-[#2F2454] text-sm">Certificate Registry</h3>
                  </div>
                  <table className="w-full text-xs min-w-max">
                    <thead><tr className="bg-gray-50 border-b border-gray-100">
                      {['ID', 'User', 'Training', 'Issue Date'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {certificates.map((c) => (
                        <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3.5 font-mono text-gray-600">{c.id}</td>
                          <td className="px-4 py-3.5 font-semibold text-gray-800">{c.pa_profiles?.full_name || c.user_id.slice(0, 8)}</td>
                          <td className="px-4 py-3.5 text-gray-600">{c.pa_trainings?.title}</td>
                          <td className="px-4 py-3.5 text-gray-500">{new Date(c.issued_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Participants */}
              {section === 'participants' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search participants..." className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5] transition-all" />
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                    <table className="w-full text-sm min-w-max">
                      <thead><tr className="bg-gray-50 border-b border-gray-100">
                        {['Name', 'Email', 'Role', 'WA Number', 'Joined'].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {profiles.filter((p) => !search || p.full_name?.toLowerCase().includes(search.toLowerCase())).map((p) => (
                          <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A577D5] to-[#2F2454] flex items-center justify-center text-white text-xs font-bold shrink-0">{(p.full_name || 'U')[0]}</div>
                                <p className="font-semibold text-gray-800 text-xs">{p.full_name || 'Unnamed'}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-gray-600">{p.id.slice(0, 8)}...</td>
                            <td className="px-4 py-3.5"><span className="bg-[#F2EFFD] text-[#2F2454] text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">{p.role}</span></td>
                            <td className="px-4 py-3.5 text-xs text-gray-600">{p.wa_number || '-'}</td>
                            <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{new Date(p.updated_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Articles */}
              {section === 'articles' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
                    <button onClick={() => setShowCreateArticle(true)} className="bg-[#2F2454] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#A577D5] transition-all flex items-center gap-2">
                      <span>+</span> Create Article
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-gray-50 border-b border-gray-100">
                        {['Title', 'Category', 'Author', 'Read Time', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {articles.filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase())).map((a) => (
                          <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3.5 font-semibold text-gray-800 text-xs">{a.title}</td>
                            <td className="px-5 py-3.5"><span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">{a.category}</span></td>
                            <td className="px-5 py-3.5 text-xs text-gray-600">{a.author}</td>
                            <td className="px-5 py-3.5 text-xs text-gray-600">{a.read_time}</td>
                            <td className="px-5 py-3.5">
                              <button onClick={() => handleDeleteArticle(a.id)} className="text-red-500 text-[10px] font-bold hover:underline">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Gallery */}
              {section === 'gallery' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{gallery.length} items in gallery</p>
                    <button onClick={() => setShowCreateGallery(true)} className="bg-[#2F2454] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#A577D5] transition-all flex items-center gap-2">
                      <span>+</span> Add to Gallery
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {gallery.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden group relative">
                        <img src={item.image_url} alt="" className="w-full h-32 object-cover" />
                        <div className="p-2">
                          <p className="text-[10px] font-bold text-gray-800 truncate">{item.title}</p>
                          <p className="text-[8px] text-gray-400">{item.category}</p>
                        </div>
                        <button onClick={() => handleDeleteGallery(item.id)} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings */}
              {section === 'settings' && (
                <div className="max-w-2xl space-y-5">
                  <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center">
                    <h2 className="font-bold text-[#2F2454] text-xl mb-2 capitalize">Settings</h2>
                    <p className="text-gray-400 text-sm">Platform configurations are managed via Supabase environment variables.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* Create Event Modal */}
      {showCreateEvent && (
        <Modal title="Create New Event" onClose={() => setShowCreateEvent(false)}>
          <form onSubmit={handleCreateEvent} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Event Title</label>
                  <input name="title" required className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Banner/Poster Image URL</label>
                  <input name="image_url" placeholder="https://example.com/image.jpg" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
                  <p className="text-[10px] text-gray-400 mt-1">Provide a link to the flyer/poster image</p>
                </div>
                <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Category</label>
                <select name="category" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]">
                  {['Civil Engineering', 'QA/QC', 'HSE', 'Project Management', 'Electrical Engineering', 'Mechanical Engineering'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Seats</label>
                <input name="seats" type="number" required className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Date</label>
                <input name="date" placeholder="e.g. August 23, 2026" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Price</label>
                <input name="price" placeholder="e.g. 1500000 or Free" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Instructor Name</label>
                <input name="instructor" required className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Instructor Title</label>
                <input name="instructor_title" required className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Short Description</label>
                <textarea name="short_desc" rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5] resize-none" />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#2F2454] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#A577D5] transition-all">Publish Event</button>
          </form>
        </Modal>
      )}

      {/* Create Article Modal */}
      {showCreateArticle && (
        <Modal title="Create New Article" onClose={() => setShowCreateArticle(false)}>
          <form onSubmit={handleCreateArticle} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Title</label>
              <input name="title" required className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Feature Image URL</label>
              <input name="image_url" placeholder="https://example.com/article-image.jpg" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Category</label>
                <input name="category" required className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Read Time</label>
                <input name="read_time" placeholder="e.g. 5 min read" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Excerpt</label>
              <textarea name="excerpt" rows={2} required className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5] resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Body Content</label>
              <textarea name="body" rows={6} required className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5] resize-none" />
            </div>
            <button type="submit" className="w-full bg-[#2F2454] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#A577D5] transition-all">Publish Article</button>
          </form>
        </Modal>
      )}

      {/* Create Gallery Modal */}
      {showCreateGallery && (
        <Modal title="Add Gallery Item" onClose={() => setShowCreateGallery(false)}>
          <form onSubmit={handleCreateGallery} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Item Title</label>
              <input name="title" required className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Image URL</label>
              <input name="image_url" required placeholder="https://example.com/photo.jpg" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Category</label>
                <input name="category" required className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Date</label>
                <input name="date" placeholder="e.g. July 2026" className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Caption</label>
              <input name="caption" required className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#A577D5]" />
            </div>
            <button type="submit" className="w-full bg-[#2F2454] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#A577D5] transition-all">Add to Gallery</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="font-bold text-[#2F2454]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round"/></svg>
          </button>
        </div>
        {children}
      </div>
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
