import { useState, useRef, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function Root() {
  const { user, logout, notifications, markRead, unreadCount } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const isHome = location.pathname === '/'
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (isAdmin) return <Outlet />

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Training', to: '/training' },
    { label: 'Articles', to: '/articles' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'About', to: '/about' },
  ]

  const navClass = isHome
    ? 'fixed top-0 left-0 right-0 z-50'
    : 'sticky top-0 z-50 bg-[#2F2454] shadow-lg'

  const active = (to: string) => location.pathname === to || (to !== '/' && location.pathname.startsWith(to))

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');*{font-family:'Poppins',sans-serif}`}</style>

      {/* Nav */}
      <nav className={navClass}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/src/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <div className="text-white font-semibold text-sm leading-tight">
              <div>Prestigium</div>
              <div className="text-white/70">Academia</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors ${active(l.to) ? 'text-cyan-400 font-semibold' : 'text-white/80 hover:text-white'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-white/80 text-sm font-medium flex items-center gap-1.5">
              <span className="text-white font-semibold cursor-pointer">EN</span>
              <span className="text-white/40">|</span>
              <span className="cursor-pointer hover:text-white transition-colors">ID</span>
            </div>

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative text-white/80 hover:text-white transition-colors p-1"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyan-400 text-[#2F2454] text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-semibold text-[#2F2454] text-sm">Notifications</span>
                    <span className="text-xs text-[#A577D5] cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-[#F2EFFD]' : ''}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-[#A577D5]' : 'bg-gray-300'}`} />
                          <div>
                            <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Login / Profile */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1.5 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A577D5] to-[#2F2454] flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0]}
                  </div>
                  <span className="text-white text-sm font-medium">{user.name.split(' ')[0]}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <button onClick={() => { navigate('/admin'); setProfileOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                        Admin Dashboard
                      </button>
                    )}
                    <button onClick={() => { navigate('/dashboard'); setProfileOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                      My Dashboard
                    </button>
                    <button onClick={() => { logout(); setProfileOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-gray-100">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-white text-[#2F2454] font-semibold px-5 py-2 rounded-full text-sm hover:bg-cyan-400 hover:text-white transition-all duration-300">
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen
                ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/>
                : <><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/></>}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#2F2454] border-t border-white/10 px-6 py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium py-1 ${active(l.to) ? 'text-cyan-400' : 'text-white/80'}`}>
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-white/80 py-1">Dashboard</Link>
                <button onClick={() => { logout(); setMenuOpen(false) }} className="text-sm text-red-400 py-1 text-left">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-cyan-400 font-semibold py-1">Login / Register</Link>
            )}
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#2F2454] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/src/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <div className="font-semibold text-sm">
                  <div>Prestigium</div>
                  <div className="text-white/60">Academia</div>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">Empowering Technical Knowledge.</p>
              <div className="flex gap-3 mt-5">
                {['Instagram', 'LinkedIn', 'WhatsApp'].map((s) => (
                  <a key={s} href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-[#A577D5] hover:bg-[#A577D5]/20 transition-all" title={s}>
                    <span className="text-xs font-bold text-white/60">{s[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4">Navigation</p>
              <div className="flex flex-col gap-2.5">
                {[['Home', '/'], ['Training', '/training'], ['Articles', '/articles'], ['Gallery', '/gallery'], ['About', '/about']].map(([l, to]) => (
                  <Link key={to} to={to} className="text-white/60 text-sm hover:text-white transition-colors">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4">Support</p>
              <div className="flex flex-col gap-2.5">
                {['Contact', 'FAQ', 'Help Center'].map((l) => (
                  <a key={l} href="#" className="text-white/60 text-sm hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4">Legal</p>
              <div className="flex flex-col gap-2.5">
                {['Privacy Policy', 'Terms & Conditions'].map((l) => (
                  <a key={l} href="#" className="text-white/60 text-sm hover:text-white transition-colors">{l}</a>
                ))}
              </div>
              <div className="mt-6">
                <Link to="/verify-certificate" className="inline-flex items-center gap-2 text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Verify Certificate
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/40 text-xs">
            © 2026 Prestigium Academia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
