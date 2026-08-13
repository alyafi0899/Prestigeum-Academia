import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { trainings, type Training } from '../data/mockData'

const slides = [
  {
    id: 0,
    image: 'https://images.unsplash.com/photo-1774599730806-61591b84280e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1920',
    tag: 'Engineering Excellence',
    headline: 'Master Engineering Skills for the Future',
    accent: 'Future',
    sub: 'Transform your career with practical engineering training designed by industry professionals. Learn from real-world experience, technical knowledge, and hands-on applications.',
    cta1: { label: 'Explore Training', to: '/training' },
    cta2: { label: 'View Upcoming Events', to: '/training' },
  },
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1920',
    tag: 'Industry-Led Training',
    headline: 'Build Real Skills with Industry Experts',
    accent: 'Experts',
    sub: 'Join 1,239+ engineers who have elevated their careers through hands-on training led by certified industry professionals across all engineering disciplines.',
    cta1: { label: 'Browse Courses', to: '/training' },
    cta2: { label: 'Meet Instructors', to: '/about' },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1920',
    tag: 'Verified Credentials',
    headline: 'Earn Verified Engineering Certificates Online',
    accent: 'Certificates',
    sub: 'Complete training, attend sessions, and receive digitally verifiable certificates recognized across the industry. Your credentials, always accessible.',
    cta1: { label: 'Get Certified', to: '/training' },
    cta2: { label: 'Verify a Certificate', to: '/verify-certificate' },
  },
]

const stats = [
  { value: '1,239+', label: 'Registered Participants' },
  { value: '25+', label: 'Training Events' },
  { value: '15+', label: 'Expert Instructors' },
  { value: '1,000+', label: 'Certificates Issued' },
]

const categories = [
  { label: 'Civil Engineering', icon: '🏗️' },
  { label: 'QA/QC', icon: '✅' },
  { label: 'Electrical Engineering', icon: '⚡' },
  { label: 'Project Management', icon: '📋' },
  { label: 'HSE', icon: '🦺' },
  { label: 'Mechanical Engineering', icon: '⚙️' },
]

function renderHeadline(text: string, accent: string) {
  const words = text.split(' ')
  return words.map((word, i) => {
    const clean = word.replace(/[^a-zA-Z]/g, '')
    const isAccent = clean === accent
    return (
      <span key={i} className={isAccent ? 'text-cyan-400' : ''}>
        {word}{i < words.length - 1 ? ' ' : ''}
      </span>
    )
  })
}

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const go = useCallback((index: number) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 400)
  }, [])

  const next = useCallback(() => go((current + 1) % slides.length), [current, go])
  const prev = useCallback(() => go((current - 1 + slides.length) % slides.length), [current, go])

  useEffect(() => {
    const t = setTimeout(next, 6500)
    return () => clearTimeout(t)
  }, [current, next])

  const slide = slides[current]
  const featured = trainings.slice(0, 3)

  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative min-h-screen overflow-hidden">
        {slides.map((s, i) => (
          <div key={s.id} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === current ? 1 : 0 }}>
            <img src={s.image} alt="" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(108deg, rgba(47,36,84,0.93) 0%, rgba(100,50,160,0.72) 45%, rgba(165,119,213,0.25) 75%, rgba(47,36,84,0.6) 100%)' }} />
            {/* Brand A watermark */}
            <div className="absolute bottom-0 right-0 pointer-events-none" style={{ width: '38%', maxWidth: 520, opacity: 0.15 }}>
              <svg viewBox="0 0 400 480" fill="none"><path d="M200 0 L400 480 H280 L200 260 L120 480 H0 L200 0Z" fill="white"/><path d="M140 320 H260 L240 370 H160 Z" fill="#2F2454"/></svg>
            </div>
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-16 pt-24 pb-12">
          <div style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(10px)' : 'translateY(0)', transition: 'opacity 0.4s, transform 0.4s' }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-white/90 text-xs font-medium">{slide.tag}</span>
            </div>
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-3xl leading-tight">
              {renderHeadline(slide.headline, slide.accent)}
            </h1>
            <p className="text-white/75 text-base md:text-lg max-w-xl leading-relaxed mb-10 font-light">{slide.sub}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to={slide.cta1.to} className="bg-white text-[#2F2454] font-semibold px-7 py-3.5 rounded-full hover:bg-cyan-400 hover:text-white transition-all duration-300 text-sm shadow-lg">
                {slide.cta1.label}
              </Link>
              <Link to={slide.cta2.to} className="flex items-center gap-3 text-white font-medium text-sm group">
                <span className="w-11 h-11 rounded-full border-2 border-white/60 flex items-center justify-center group-hover:border-cyan-400 group-hover:text-cyan-400 transition-all">
                  <svg width="10" height="12" viewBox="0 0 12 14" fill="currentColor"><path d="M0 0 L12 7 L0 14 Z"/></svg>
                </span>
                {slide.cta2.label}
              </Link>
            </div>
          </div>

          {/* Slide controls */}
          <div className="flex items-center gap-4 mt-14">
            <button onClick={prev} className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:border-cyan-400 hover:text-cyan-400 transition-all">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 2 L4 7 L9 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button key={i} onClick={() => go(i)} className="transition-all duration-300 rounded-full" style={{ width: i === current ? 28 : 8, height: 8, background: i === current ? '#22d3ee' : 'rgba(255,255,255,0.35)' }} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:border-cyan-400 hover:text-cyan-400 transition-all">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 2 L10 7 L5 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span className="ml-2 text-white/40 text-sm tabular-nums">{String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl">
            {stats.map((s) => (
              <div key={s.label} className="text-white">
                <div className="text-2xl md:text-3xl font-bold leading-none">{s.value}</div>
                <div className="text-white/55 text-xs mt-1 font-light">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="bg-[#F2EFFD] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#A577D5] font-semibold text-sm mb-2 tracking-wide uppercase">Engineering Fields</p>
          <h2 className="text-[#2F2454] text-3xl font-bold mb-10">Explore by Discipline</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c) => (
              <Link key={c.label} to={`/training?category=${encodeURIComponent(c.label)}`}
                className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-white/60 group">
                <span className="text-3xl">{c.icon}</span>
                <span className="text-[#2F2454] text-xs font-semibold text-center group-hover:text-[#A577D5] transition-colors">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Training ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#A577D5] font-semibold text-sm mb-2 tracking-wide uppercase">What's On</p>
              <h2 className="text-[#2F2454] text-3xl md:text-4xl font-bold">Upcoming Training</h2>
              <p className="text-gray-500 mt-2 text-base">Build practical engineering skills through industry-focused training.</p>
            </div>
            <Link to="/training" className="hidden md:inline-flex items-center gap-2 text-[#A577D5] font-semibold text-sm hover:text-[#2F2454] transition-colors">
              View all training
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8h10M10 4l5 4-5 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((t) => (
              <TrainingCard key={t.id} training={t} />
            ))}
          </div>
          <div className="text-center mt-10 md:hidden">
            <Link to="/training" className="inline-flex items-center gap-2 bg-[#2F2454] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#A577D5] transition-all text-sm">
              View All Training
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Prestigium ── */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #2F2454 0%, #5b3d9e 100%)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#DBCDFD] font-semibold text-sm mb-2 tracking-wide uppercase">Why Choose Us</p>
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Built for Engineers, by Engineers</h2>
          <p className="text-white/65 max-w-xl mx-auto text-base mb-14 font-light">Every training program is designed with real-world engineering practice in mind — not textbooks.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Industry-Relevant Content', desc: 'Curriculum developed with working professionals and reviewed against current industry standards.' },
              { icon: '🏆', title: 'Verified Certificates', desc: 'Every certificate issued comes with a unique ID that can be publicly verified through our platform.' },
              { icon: '👥', title: 'Expert Instructors', desc: 'Learn from engineers with 10–25 years of hands-on project experience in their fields.' },
            ].map((f) => (
              <div key={f.title} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-7 text-left hover:bg-white/15 transition-all">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6 bg-[#F2EFFD]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[#2F2454] text-3xl md:text-4xl font-bold mb-4">Ready to Advance Your Engineering Career?</h2>
          <p className="text-gray-500 mb-8 text-base">Join thousands of engineers already training with Prestigium Academia.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/training" className="bg-[#2F2454] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#A577D5] transition-all text-sm shadow-lg">
              Explore Training
            </Link>
            <Link to="/register" className="border-2 border-[#2F2454] text-[#2F2454] font-semibold px-8 py-3.5 rounded-full hover:bg-[#2F2454] hover:text-white transition-all text-sm">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function TrainingCard({ training: t }: { training: Training }) {
  const levelColor: Record<string, string> = { Beginner: 'bg-green-100 text-green-700', Intermediate: 'bg-yellow-100 text-yellow-700', Advanced: 'bg-red-100 text-red-700' }
  const formatIcon = t.format === 'Online' ? '💻' : t.format === 'Offline' ? '📍' : '🔗'
  const pct = Math.round(((t.seats - t.seatsLeft) / t.seats) * 100)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
      <div className="relative h-44 overflow-hidden">
        <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-3 left-3 bg-[#2F2454] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">{t.category}</span>
        <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${levelColor[t.level]}`}>{t.level}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[#2F2454] text-base leading-snug mb-2">{t.title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{t.shortDesc}</p>
        <div className="flex flex-col gap-1.5 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1.5"><span>📅</span>{t.date}</div>
          <div className="flex items-center gap-1.5"><span>{formatIcon}</span>{t.format} · {t.duration}</div>
          <div className="flex items-center gap-1.5"><span>👤</span>{t.instructor}</div>
        </div>
        {/* Seats */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-500">{t.seatsLeft} seats left</span>
            <span className="font-semibold text-[#2F2454]">{pct}% full</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#A577D5] to-[#2F2454] rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-[#2F2454] text-sm">
            {t.price === 'Free' ? <span className="text-green-600">Free</span> : `Rp ${(t.price as number).toLocaleString('id-ID')}`}
          </span>
          <Link to={`/training/${t.id}`} className="bg-[#2F2454] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#A577D5] transition-all">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
