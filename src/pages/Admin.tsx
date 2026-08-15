import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { dataService } from '../data/dataService'

type AdminSection = 'dashboard' | 'events' | 'participants' | 'registrations' | 'attendance' | 'certificates' | 'articles' | 'gallery' | 'settings'

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

  // Data states
  const [trainings, setTrainings] = useState<any[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [gallery, setGallery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Creation/Edit Modals
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [showEditEvent, setShowEditEvent] = useState<any>(null)
  const [showCreateArticle, setShowCreateArticle] = useState(false)
  const [showCreateGallery, setShowCreateGallery] = useState(false)

  // Dynamic Event Form State
  const [eventModules, setEventModules] = useState<any[]>([])
  const [eventObjectives, setEventObjectives] = useState<string[]>([''])

  useEffect(() => {
    if (showEditEvent) {
      setEventModules(showEditEvent.modules || [])
      setEventObjectives(showEditEvent.objectives?.length > 0 ? showEditEvent.objectives : [''])
    } else if (showCreateEvent) {
      setEventModules([])
      setEventObjectives([''])
    }
  }, [showEditEvent, showCreateEvent])

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
      console.log('Admin: Fetching all data...')
      const [tData, rData, pData, cData, aData, gData] = await Promise.all([
        dataService.getTrainings(),
        dataService.getRegistrations(),
        dataService.getProfiles(),
        dataService.getCertificates(),
        dataService.getArticles(),
        dataService.getGallery()
      ])
      console.log('Admin: Data fetched successfully')
      setTrainings(tData || [])
      setRegistrations(rData || [])
      setProfiles(pData || [])
      setCertificates(cData || [])
      setArticles(aData || [])
      setGallery(gData || [])
    } catch (err) {
      console.error('Error loading admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)

    // Auto-format dates
    const formatDate = (val: string) => {
      if (!val) return ''
      return new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    const timeStart = f.get('time_start')
    const timeEnd = f.get('time_end')
    const formattedTime = timeStart && timeEnd ? `${timeStart} - ${timeEnd} WIB` : f.get('time_manual')

    const data: any = {
      title: f.get('title'),
      category: f.get('category'),
      level: f.get('level'),
      format: f.get('format'),
      date: formatDate(f.get('date_picker') as string),
      time: formattedTime,
      duration: f.get('duration'),
      location: f.get('location'),
      price: f.get('price'),
      deadline: formatDate(f.get('deadline_picker') as string),
      seats: parseInt(f.get('seats') as string),
      seats_left: parseInt(f.get('seats') as string),
      max_participants: parseInt(f.get('seats') as string),
      image_url: f.get('image_url'),
      flyer_url: f.get('flyer_url'),
      cert_template_url: f.get('cert_template_url'),
      cert_name_y: parseInt(f.get('cert_name_y') as string) || 300,
      cert_qr_x: parseInt(f.get('cert_qr_x') as string) || 700,
      cert_qr_y: parseInt(f.get('cert_qr_y') as string) || 50,
      short_desc: f.get('short_desc'),
      description: f.get('description'),
      target_audience: f.get('target_audience'),
      language: f.get('language'),
      objectives: eventObjectives.filter(o => o.trim()),
      modules: eventModules,
      instructor: f.get('instructor_name'),
      instructor_title: f.get('instructor_title'),
      instructor_image_url: f.get('instructor_image_url'),
      instructor_specialization: f.get('instructor_specialization'),
      instructor_experience: f.get('instructor_experience'),
      instructor_bio: f.get('instructor_bio')
    }

    try {
      if (showEditEvent) {
        await dataService.updateTraining(showEditEvent.id, data)
        alert('Event updated successfully!')
      } else {
        await dataService.createTraining(data)
        alert('Event published successfully!')
      }
      setShowCreateEvent(false)
      setShowEditEvent(null)
      setEventModules([])
      setEventObjectives([''])
      await loadAllData()
    } catch (err: any) {
      alert('Error: ' + err.message)
    }
  }

  const handleCreateArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    try {
      await dataService.createArticle({
        title: f.get('title'),
        category: f.get('category'),
        excerpt: f.get('excerpt'),
        body: f.get('body'),
        author: user?.name || 'Admin',
        read_time: f.get('read_time'),
        image_url: f.get('image_url')
      })
      setShowCreateArticle(false)
      await loadAllData()
      alert('Article published!')
    } catch (err: any) { alert(err.message) }
  }

  const handleCreateGallery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    try {
      await dataService.createGalleryItem({
        title: f.get('title'),
        category: f.get('category'),
        caption: f.get('caption'),
        date: f.get('date'),
        image_url: f.get('image_url')
      })
      setShowCreateGallery(false)
      await loadAllData()
      alert('Gallery item added!')
    } catch (err: any) { alert(err.message) }
  }

  const handleDeleteTraining = async (id: string) => {
    if (confirm('Delete this event?')) { await dataService.deleteTraining(id); loadAllData() }
  }

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Delete this article?')) { await dataService.deleteArticle(id); loadAllData() }
  }

  const handleDeleteGallery = async (id: string) => {
    if (confirm('Delete this item?')) { await dataService.deleteGalleryItem(id); loadAllData() }
  }

  const handleIssueCert = async (reg: any) => {
    const certId = `PA-CERT-2026-${Math.floor(Math.random() * 90000) + 10000}`
    try {
      await dataService.issueCertificate({ id: certId, registration_id: reg.id, user_id: reg.user_id, training_id: reg.training_id })
      loadAllData()
      alert('Certificate issued!')
    } catch (err: any) { alert(err.message) }
  }

  if (authLoading || (!user || user.role !== 'admin')) return null

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');*{font-family:'Poppins',sans-serif}`}</style>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-[#2F2454] flex flex-col shrink-0 overflow-hidden`}>
        <div className="p-6 flex items-center gap-4 border-b border-white/10">
          <img src="/src/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          {sidebarOpen && <div className="text-white text-sm font-bold leading-tight truncate"><div>Prestigium</div><div className="text-white/50">Academia</div></div>}
        </div>
        <div className="p-3 flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button key={item.key} onClick={() => setSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${section === item.key ? 'bg-white/15 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <span className="text-lg shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => { logout(); navigate('/') }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 text-sm font-medium">
            <span className="text-lg">⏻</span>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-gray-700">☰</button>
            <h1 className="font-bold text-[#2F2454] text-lg capitalize">{section}</h1>
            <button onClick={loadAllData} className="text-gray-400 hover:text-[#A577D5] p-1" title="Refresh Data">🔄</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{user.name}</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A577D5] to-[#2F2454] flex items-center justify-center text-white font-bold">{user.name[0]}</div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-400 font-medium">Fetching secure data...</div>
          ) : (
            <>
              {/* Dashboard */}
              {section === 'dashboard' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Participants', val: profiles.length, icon: '👥', color: 'bg-blue-50 text-blue-600' },
                      { label: 'Live Events', val: trainings.length, icon: '📅', color: 'bg-purple-50 text-purple-600' },
                      { label: 'Registrations', val: registrations.length, icon: '📋', color: 'bg-orange-50 text-orange-600' },
                      { label: 'Certificates', val: certificates.length, icon: '🏆', color: 'bg-yellow-50 text-yellow-600' },
                    ].map(s => (
                      <div key={s.label} className={`${s.color} p-6 rounded-3xl flex flex-col justify-between h-32`}>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-bold opacity-80 uppercase tracking-wider">{s.label}</span>
                          <span className="text-2xl">{s.icon}</span>
                        </div>
                        <span className="text-3xl font-black">{s.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#2F2454] mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {registrations.slice(0, 5).map((r, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-all">
                          <div className="w-10 h-10 rounded-xl bg-[#F2EFFD] flex items-center justify-center">📋</div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800"><span className="font-bold">{r.pa_profiles?.full_name || 'A user'}</span> registered for <span className="font-bold text-[#A577D5]">{r.pa_trainings.title}</span></p>
                            <p className="text-[10px] text-gray-400 mt-0.5 uppercase font-bold">{new Date(r.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                      {registrations.length === 0 && <p className="text-center py-10 text-gray-400">No activity yet.</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Events */}
              {section === 'events' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter events..." className="bg-white border border-gray-200 rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-[#A577D5] w-80 shadow-sm" />
                    <button onClick={() => setShowCreateEvent(true)} className="bg-[#2F2454] text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:bg-[#A577D5] transition-all flex items-center gap-3">
                      <span>+</span> Create Event
                    </button>
                  </div>
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead><tr className="bg-gray-50/50 border-b border-gray-100"><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Event & Instructor</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th></tr></thead>
                      <tbody className="divide-y divide-gray-50">
                        {trainings.filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase())).map(t => (
                          <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <img src={t.image_url} className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm" />
                                <div><p className="font-bold text-[#2F2454] text-sm">{t.title}</p><p className="text-xs text-gray-400 font-medium">👤 {t.instructor}</p></div>
                              </div>
                            </td>
                            <td className="px-6 py-5"><span className="bg-[#F2EFFD] text-[#2F2454] text-[10px] font-black px-3 py-1 rounded-full uppercase">{t.category}</span></td>
                            <td className="px-6 py-5"><span className="bg-green-50 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Live</span></td>
                            <td className="px-6 py-5">
                              <div className="flex gap-3">
                                <button onClick={() => setShowEditEvent(t)} className="text-gray-400 hover:text-[#A577D5] font-bold text-xs uppercase tracking-widest transition-colors">Edit</button>
                                <button onClick={() => handleDeleteTraining(t.id)} className="text-red-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest transition-colors">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {trainings.length === 0 && <tr><td colSpan={4} className="p-20 text-center text-gray-400">No events found. Click "+ Create Event" to add one.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Articles */}
              {section === 'articles' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter articles..." className="bg-white border border-gray-200 rounded-2xl px-6 py-3 text-sm focus:outline-none focus:border-[#A577D5] w-80 shadow-sm" />
                    <button onClick={() => setShowCreateArticle(true)} className="bg-[#2F2454] text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:bg-[#A577D5] transition-all flex items-center gap-3">
                      <span>+</span> Create Article
                    </button>
                  </div>
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead><tr className="bg-gray-50/50 border-b border-gray-100"><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Article Title</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Author</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th></tr></thead>
                      <tbody className="divide-y divide-gray-50">
                        {articles.filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase())).map(a => (
                          <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-[#2F2454]">{a.title}</td>
                            <td className="px-6 py-4"><span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">{a.category}</span></td>
                            <td className="px-6 py-4 text-gray-400 font-medium">{a.author}</td>
                            <td className="px-6 py-4"><button onClick={() => handleDeleteArticle(a.id)} className="text-red-400 hover:text-red-600 font-bold text-xs uppercase">Delete</button></td>
                          </tr>
                        ))}
                        {articles.length === 0 && <tr><td colSpan={4} className="p-20 text-center text-gray-400">No articles found. Click "+ Create Article" to add one.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Gallery */}
              {section === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#2F2454] uppercase tracking-widest">{gallery.length} Items</p>
                      <p className="text-xs text-gray-400 font-medium">Manage visual archives and event photos</p>
                    </div>
                    <button onClick={() => setShowCreateGallery(true)} className="bg-[#2F2454] text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:bg-[#A577D5] transition-all flex items-center gap-3">
                      <span>+</span> Add Photo
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {gallery.map((item) => (
                      <div key={item.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden group relative shadow-sm hover:shadow-md transition-all">
                        <img src={item.image_url} alt="" className="w-full h-40 object-cover" />
                        <div className="p-4">
                          <p className="text-xs font-black text-[#2F2454] truncate">{item.title}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{item.category} • {item.date}</p>
                        </div>
                        <div className="absolute inset-0 bg-[#2F2454]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDeleteGallery(item.id)} className="bg-white text-red-500 font-black px-4 py-2 rounded-xl text-xs uppercase shadow-xl hover:scale-105 active:scale-95 transition-all">Delete</button>
                        </div>
                      </div>
                    ))}
                    {gallery.length === 0 && <div className="col-span-full py-20 text-center text-gray-400 font-medium border-2 border-dashed border-gray-200 rounded-[40px]">No gallery items found.</div>}
                  </div>
                </div>
              )}

              {/* Participants */}
              {section === 'participants' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead><tr className="bg-gray-50/50 border-b border-gray-100"><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Participant</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">WA Number</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th></tr></thead>
                      <tbody className="divide-y divide-gray-50">
                        {profiles.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-[#2F2454] flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A577D5] to-[#2F2454] flex items-center justify-center text-white text-[10px] font-bold">{(p.full_name || 'U')[0]}</div>
                               {p.full_name || 'Unnamed'}
                            </td>
                            <td className="px-6 py-4"><span className="bg-[#F2EFFD] text-[#2F2454] text-[10px] font-black px-2 py-1 rounded-full uppercase">{p.role}</span></td>
                            <td className="px-6 py-4 text-gray-400">{p.wa_number || '-'}</td>
                            <td className="px-6 py-4 text-gray-400">{new Date(p.updated_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                        {profiles.length === 0 && <tr><td colSpan={4} className="p-20 text-center text-gray-400">No participants registered yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Registrations */}
              {section === 'registrations' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead><tr className="bg-gray-50/50 border-b border-gray-100"><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Event</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th></tr></thead>
                      <tbody className="divide-y divide-gray-50">
                        {registrations.map(r => (
                          <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-[#2F2454]">{r.user_id.slice(0, 8)}...</td>
                            <td className="px-6 py-4 text-gray-400">{r.pa_trainings?.title}</td>
                            <td className="px-6 py-4"><StatusChip label={r.status} /></td>
                            <td className="px-6 py-4">
                               {r.attendance_status === 'Attended' && r.status !== 'Completed' && (
                                 <button onClick={() => handleIssueCert(r)} className="bg-[#A577D5] text-white font-black px-3 py-1 rounded-lg text-[10px] uppercase">Issue Cert</button>
                               )}
                            </td>
                          </tr>
                        ))}
                        {registrations.length === 0 && <tr><td colSpan={4} className="p-20 text-center text-gray-400">No registrations found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Attendance */}
              {section === 'attendance' && (
                <div className="space-y-6">
                   <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead><tr className="bg-gray-50/50 border-b border-gray-100"><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Participant ID</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Training Event</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Check-in Time</th></tr></thead>
                      <tbody className="divide-y divide-gray-50">
                        {registrations.filter(r => r.attendance_status === 'Attended').map(a => (
                          <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-[#2F2454]">{a.user_id.slice(0, 8)}...</td>
                            <td className="px-6 py-4 text-gray-400">{a.pa_trainings?.title}</td>
                            <td className="px-6 py-4"><span className="text-green-600 font-black text-[10px] uppercase">✓ Attended</span></td>
                            <td className="px-6 py-4 text-gray-400">{new Date(a.check_in_time).toLocaleString()}</td>
                          </tr>
                        ))}
                        {registrations.filter(r => r.attendance_status === 'Attended').length === 0 && <tr><td colSpan={4} className="p-20 text-center text-gray-400">No attendance recorded yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Certificates */}
              {section === 'certificates' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead><tr className="bg-gray-50/50 border-b border-gray-100"><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cert ID</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Recipient</th><th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Issued</th></tr></thead>
                      <tbody className="divide-y divide-gray-50">
                        {certificates.map(c => (
                          <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-mono font-bold text-[#A577D5]">{c.id}</td>
                            <td className="px-6 py-4 font-bold text-[#2F2454]">{c.pa_profiles?.full_name || 'Participant'}</td>
                            <td className="px-6 py-4 text-gray-400">{new Date(c.issued_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                        {certificates.length === 0 && <tr><td colSpan={3} className="p-20 text-center text-gray-400">No certificates issued yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {section === 'settings' && (
                <div className="bg-white rounded-3xl p-16 border border-gray-100 shadow-sm text-center">
                  <h2 className="font-black text-[#2F2454] text-2xl mb-2 capitalize">System Settings</h2>
                  <p className="text-gray-400 text-sm font-medium">Configurations are locked for security.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* COMPREHENSIVE EVENT MODAL (CREATE/EDIT) */}
      {(showCreateEvent || showEditEvent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2F2454]/80 backdrop-blur-md" onClick={() => { setShowCreateEvent(false); setShowEditEvent(null); }} />
          <form onSubmit={handleCreateEvent} className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-5xl z-10 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="font-black text-[#2F2454] text-xl">{showEditEvent ? 'Edit Training Event' : 'Create New Training Event'}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{showEditEvent ? 'Update existing fields' : 'Complete all fields based on Prototype requirements'}</p>
              </div>
              <button type="button" onClick={() => { setShowCreateEvent(false); setShowEditEvent(null); }} className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all font-bold">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              <section className="space-y-6">
                <h4 className="flex items-center gap-3 text-[#A577D5] font-black text-sm uppercase tracking-[0.2em]"><span className="w-8 h-8 rounded-xl bg-[#F2EFFD] flex items-center justify-center">1</span> Basic Information</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Training Title</label><input name="title" defaultValue={showEditEvent?.title} required placeholder="e.g. Project Quality Management Training" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold text-[#2F2454] focus:ring-2 focus:ring-[#A577D5]" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Category</label><select name="category" defaultValue={showEditEvent?.category} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold text-[#2F2454] focus:ring-2 focus:ring-[#A577D5]">{['QA/QC', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'HSE', 'Project Management'].map(c => <option key={c}>{c}</option>)}</select></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Format</label><select name="format" defaultValue={showEditEvent?.format} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold text-[#2F2454] focus:ring-2 focus:ring-[#A577D5]"><option>Online</option><option>Offline</option><option>Hybrid</option></select></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Level</label><select name="level" defaultValue={showEditEvent?.level} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold text-[#2F2454] focus:ring-2 focus:ring-[#A577D5]"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Language</label><input name="language" defaultValue={showEditEvent?.language || "Indonesian"} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold text-[#2F2454]" /></div>
                </div>
              </section>
              <section className="space-y-6">
                <h4 className="flex items-center gap-3 text-[#A577D5] font-black text-sm uppercase tracking-[0.2em]"><span className="w-8 h-8 rounded-xl bg-[#F2EFFD] flex items-center justify-center">2</span> Visual Assets (Links)</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Hero Banner URL</label><input name="image_url" defaultValue={showEditEvent?.image_url} placeholder="https://..." className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-medium" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Event Flyer URL</label><input name="flyer_url" defaultValue={showEditEvent?.flyer_url} placeholder="https://..." className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-medium" /></div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-[#A577D5] uppercase ml-2">Certificate Template PDF URL</label>
                    <input name="cert_template_url" defaultValue={showEditEvent?.cert_template_url} placeholder="https://..." className="w-full bg-purple-50/50 border-2 border-dashed border-[#DBCDFD] rounded-2xl px-5 py-3.5 text-sm font-medium" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 md:col-span-2">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Name Position (Y)</label>
                      <input name="cert_name_y" type="number" defaultValue={showEditEvent?.cert_name_y || 300} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-2">QR Position (X)</label>
                      <input name="cert_qr_x" type="number" defaultValue={showEditEvent?.cert_qr_x || 700} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-2">QR Position (Y)</label>
                      <input name="cert_qr_y" type="number" defaultValue={showEditEvent?.cert_qr_y || 50} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold" />
                    </div>
                  </div>
                  <p className="md:col-span-2 text-[9px] text-gray-400 ml-2 italic">*A4 Landscape tip: Width 842, Height 595. Higher Y means higher position.</p>
                </div>
              </section>
              <section className="space-y-6">
                <h4 className="flex items-center gap-3 text-[#A577D5] font-black text-sm uppercase tracking-[0.2em]"><span className="w-8 h-8 rounded-xl bg-[#F2EFFD] flex items-center justify-center">3</span> Logistics & Pricing</h4>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Price</label><input name="price" defaultValue={showEditEvent?.price} placeholder="1500000" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Training Date</label>
                    <input name="date_picker" type="date" required className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Time (Start - End)</label>
                    <div className="flex gap-2">
                      <input name="time_start" type="time" defaultValue="08:00" className="flex-1 bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-xs font-bold" />
                      <input name="time_end" type="time" defaultValue="17:00" className="flex-1 bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-xs font-bold" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Reg. Deadline</label>
                    <input name="deadline_picker" type="date" required className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" />
                  </div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Max Participants</label><input name="seats" type="number" defaultValue={showEditEvent?.seats || 50} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                  <div className="space-y-1.5 md:col-span-2"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Location / Link</label><input name="location" defaultValue={showEditEvent?.location} placeholder="Jakarta Convention Center" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Total Duration</label><input name="duration" defaultValue={showEditEvent?.duration} placeholder="2 Days" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                </div>
              </section>
              <section className="space-y-6">
                <h4 className="flex items-center gap-3 text-[#A577D5] font-black text-sm uppercase tracking-[0.2em]"><span className="w-8 h-8 rounded-xl bg-[#F2EFFD] flex items-center justify-center">4</span> Training Overview</h4>
                <div className="space-y-6">
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Short Excerpt</label><textarea name="short_desc" defaultValue={showEditEvent?.short_desc} rows={2} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Full Description</label><textarea name="description" defaultValue={showEditEvent?.description} rows={4} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Target Audience</label><input name="target_audience" defaultValue={showEditEvent?.target_audience} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Learning Objectives</label><button type="button" onClick={() => setEventObjectives([...eventObjectives, ''])} className="text-[10px] font-black text-[#A577D5] uppercase">+ Add Point</button></div>
                    {eventObjectives.map((obj, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={obj} onChange={e => { const up = [...eventObjectives]; up[i] = e.target.value; setEventObjectives(up) }} className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm" />
                        <button type="button" onClick={() => setEventObjectives(eventObjectives.filter((_, idx) => idx !== i))} className="text-red-300 hover:text-red-500">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <section className="space-y-6">
                <div className="flex justify-between items-center"><h4 className="flex items-center gap-3 text-[#A577D5] font-black text-sm uppercase tracking-[0.2em]"><span className="w-8 h-8 rounded-xl bg-[#F2EFFD] flex items-center justify-center">5</span> Modules & Outcomes</h4><button type="button" onClick={() => setEventModules([...eventModules, { title: '', desc: '', duration: '', outcomes: [''] }])} className="bg-[#2F2454] text-white text-[10px] font-black px-4 py-2 rounded-xl">+ Add New Module</button></div>
                <div className="space-y-6">
                  {eventModules.map((m, i) => (
                    <div key={i} className="bg-gray-50 rounded-[32px] p-8 space-y-4 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center"><span className="font-black text-[#2F2454] uppercase tracking-widest text-xs">Module {i + 1}</span><button type="button" onClick={() => setEventModules(eventModules.filter((_, idx) => idx !== i))} className="text-red-400 font-bold text-xs uppercase hover:underline">Remove</button></div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input placeholder="Module Title" value={m.title} onChange={e => { const up = [...eventModules]; up[i].title = e.target.value; setEventModules(up) }} className="bg-white border-none rounded-xl px-4 py-2.5 text-sm font-bold" />
                        <input placeholder="Duration" value={m.duration} onChange={e => { const up = [...eventModules]; up[i].duration = e.target.value; setEventModules(up) }} className="bg-white border-none rounded-xl px-4 py-2.5 text-sm font-bold" />
                        <textarea placeholder="Brief summary..." value={m.desc} onChange={e => { const up = [...eventModules]; up[i].desc = e.target.value; setEventModules(up) }} className="bg-white border-none rounded-xl px-4 py-2.5 text-sm md:col-span-2" rows={2} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center"><label className="text-[10px] font-bold text-gray-400 uppercase">Outcomes</label><button type="button" onClick={() => { const up = [...eventModules]; up[i].outcomes.push(''); setEventModules(up) }} className="text-[10px] font-bold text-[#A577D5]">+ Add Outcome</button></div>
                        {m.outcomes.map((oc: string, j: number) => (
                          <div key={j} className="flex gap-2">
                            <input value={oc} onChange={e => { const up = [...eventModules]; up[i].outcomes[j] = e.target.value; setEventModules(up) }} className="flex-1 bg-white border-none rounded-lg px-3 py-1.5 text-xs" />
                            <button type="button" onClick={() => { const up = [...eventModules]; up[i].outcomes.splice(j, 1); setEventModules(up) }} className="text-red-300">×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {eventModules.length === 0 && <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-[32px] text-gray-400 text-sm font-bold uppercase tracking-widest">No modules defined</div>}
                </div>
              </section>
              <section className="space-y-6">
                <h4 className="flex items-center gap-3 text-[#A577D5] font-black text-sm uppercase tracking-[0.2em]"><span className="w-8 h-8 rounded-xl bg-[#F2EFFD] flex items-center justify-center">6</span> Instructor Data</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Instructor Name</label><input name="instructor_name" defaultValue={showEditEvent?.instructor} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Job Title</label><input name="instructor_title" defaultValue={showEditEvent?.instructor_title} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-medium" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Photo URL</label><input name="instructor_image_url" defaultValue={showEditEvent?.instructor_image_url} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-medium" /></div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Specialization</label><input name="instructor_specialization" defaultValue={showEditEvent?.instructor_specialization} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-medium" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Experience</label><input name="instructor_experience" defaultValue={showEditEvent?.instructor_experience} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-medium" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase ml-2">Bio</label><textarea name="instructor_bio" defaultValue={showEditEvent?.instructor_bio} rows={3} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm" /></div>
                  </div>
                </div>
              </section>
            </div>
            <div className="px-10 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-4 shrink-0">
              <button type="button" onClick={() => { setShowCreateEvent(false); setShowEditEvent(null); }} className="px-8 py-3 text-sm font-bold text-gray-400">Cancel</button>
              <button type="submit" className="bg-[#2F2454] text-white font-black px-12 py-3.5 rounded-2xl shadow-xl hover:bg-[#A577D5] hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest">{showEditEvent ? 'Save Changes' : 'Publish Training Event'}</button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE ARTICLE MODAL */}
      {showCreateArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2F2454]/80 backdrop-blur-md" onClick={() => setShowCreateArticle(false)} />
          <form onSubmit={handleCreateArticle} className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-4xl z-10 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <h3 className="font-black text-[#2F2454] text-xl">Publish New Article</h3>
              <button type="button" onClick={() => setShowCreateArticle(false)} className="text-gray-400 hover:text-red-500 font-bold text-2xl">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase">Article Title</label><input name="title" required className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase">Category</label><input name="category" required className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase">Read Time (e.g. 5 min read)</label><input name="read_time" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                <div className="md:col-span-2 space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase">Feature Image URL</label><input name="image_url" placeholder="https://..." className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                <div className="md:col-span-2 space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase">Short Excerpt (Intro)</label><textarea name="excerpt" rows={2} required className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm" /></div>
                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between items-center"><label className="text-[10px] font-black text-gray-400 uppercase">Article Content (Body)</label><span className="text-[10px] text-[#A577D5] font-black uppercase">💡 Markdown Mode Active</span></div>
                  <div className="bg-[#F2EFFD] rounded-2xl p-4 mb-2">
                    <p className="text-[10px] text-[#2F2454] font-medium leading-relaxed">
                      <span className="font-bold underline">Formatting Guide:</span><br/>
                      • Use <span className="bg-white px-1 rounded"># Title</span> for large headers<br/>
                      • Use <span className="bg-white px-1 rounded">## Title</span> for smaller headers<br/>
                      • Use <span className="bg-white px-1 rounded">Double Enter</span> to start a new paragraph.
                    </p>
                  </div>
                  <textarea name="body" rows={12} required className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-mono leading-relaxed" placeholder="Write your story here..." />
                </div>
              </div>
            </div>
            <div className="px-10 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-4 shrink-0">
              <button type="button" onClick={() => setShowCreateArticle(false)} className="px-8 py-3 text-sm font-bold text-gray-400">Cancel</button>
              <button type="submit" className="bg-[#2F2454] text-white font-black px-12 py-3.5 rounded-2xl shadow-xl hover:bg-[#A577D5] transition-all text-sm uppercase tracking-widest">Publish Article</button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE GALLERY MODAL */}
      {showCreateGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2F2454]/80 backdrop-blur-md" onClick={() => setShowCreateGallery(false)} />
          <form onSubmit={handleCreateGallery} className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
              <h3 className="font-black text-[#2F2454] text-xl">Add Photo to Gallery</h3>
              <button type="button" onClick={() => setShowCreateGallery(false)} className="text-gray-400 hover:text-red-500 font-bold text-2xl">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase">Item Title</label><input name="title" required className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase">Category</label><input name="category" placeholder="e.g. Training" required className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase">Date (Display)</label><input name="date" placeholder="e.g. July 2026" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                </div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase">Image URL</label><input name="image_url" placeholder="https://..." required className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-gray-400 uppercase">Caption (Optional)</label><textarea name="caption" rows={2} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm" /></div>
              </div>
            </div>
            <div className="px-10 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-4 shrink-0">
              <button type="button" onClick={() => setShowCreateGallery(false)} className="px-8 py-3 text-sm font-bold text-gray-400">Cancel</button>
              <button type="submit" className="bg-[#2F2454] text-white font-black px-12 py-3.5 rounded-2xl shadow-xl hover:bg-[#A577D5] transition-all text-sm uppercase tracking-widest">Add to Gallery</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function StatusChip({ label }: { label: string }) {
  const map: Record<string, string> = { Confirmed: 'bg-green-100 text-green-700', Registered: 'bg-blue-100 text-blue-700', Completed: 'bg-purple-100 text-purple-700', Cancelled: 'bg-red-100 text-red-700', Attended: 'bg-green-100 text-green-700', Pending: 'bg-gray-100 text-gray-500', Absent: 'bg-red-100 text-red-600', Issued: 'bg-yellow-100 text-yellow-700', 'N/A': 'bg-gray-100 text-gray-400' }
  return <span className={`text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap uppercase tracking-widest ${map[label] || 'bg-gray-100 text-gray-600'}`}>{label}</span>
}
