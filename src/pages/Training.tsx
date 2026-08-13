import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { trainings } from '../data/mockData'

const CATEGORIES = ['All', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'QA/QC', 'HSE', 'Project Management']
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']
const FORMATS = ['All', 'Online', 'Offline', 'Hybrid']

export default function Training() {
  const [params] = useSearchParams()
  const initCat = params.get('category') || 'All'
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(CATEGORIES.includes(initCat) ? initCat : 'All')
  const [level, setLevel] = useState('All')
  const [format, setFormat] = useState('All')
  const [priceFilter, setPriceFilter] = useState('All')

  const filtered = useMemo(() => {
    return trainings.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase())) return false
      if (category !== 'All' && t.category !== category) return false
      if (level !== 'All' && t.level !== level) return false
      if (format !== 'All' && t.format !== format) return false
      if (priceFilter === 'Free' && t.price !== 'Free') return false
      if (priceFilter === 'Paid' && t.price === 'Free') return false
      return true
    })
  }, [search, category, level, format, priceFilter])

  const levelColor: Record<string, string> = { Beginner: 'bg-green-100 text-green-700', Intermediate: 'bg-yellow-100 text-yellow-700', Advanced: 'bg-red-100 text-red-700' }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#2F2454] pt-8 pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#DBCDFD] text-sm font-medium mb-2">Discover Programs</p>
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">Engineering Training</h1>
          <p className="text-white/60 text-base max-w-xl">Build practical engineering skills through industry-focused training programs designed for real-world application.</p>

          {/* Search */}
          <div className="mt-7 max-w-lg relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/></svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search training programs..."
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6 pb-20">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8 flex flex-wrap items-center gap-4">
          <FilterPill label="Category" value={category} options={CATEGORIES} onChange={setCategory} />
          <FilterPill label="Level" value={level} options={LEVELS} onChange={setLevel} />
          <FilterPill label="Format" value={format} options={FORMATS} onChange={setFormat} />
          <FilterPill label="Price" value={priceFilter} options={['All', 'Free', 'Paid']} onChange={setPriceFilter} />
          <div className="ml-auto text-sm text-gray-500 font-medium">{filtered.length} program{filtered.length !== 1 ? 's' : ''} found</div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === c ? 'bg-[#2F2454] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#A577D5] hover:text-[#A577D5]'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold text-gray-600 text-lg">No training found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => {
              const pct = Math.round(((t.seats - t.seatsLeft) / t.seats) * 100)
              const fmt = t.format === 'Online' ? '💻' : t.format === 'Offline' ? '📍' : '🔗'
              return (
                <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 bg-[#2F2454] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">{t.category}</span>
                    <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${levelColor[t.level]}`}>{t.level}</span>
                    <span className="absolute bottom-3 right-3 bg-white/90 text-gray-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">{fmt} {t.format}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-[#2F2454] text-base leading-snug mb-1.5">{t.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{t.shortDesc}</p>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5"><span>📅</span>{t.date}</div>
                      <div className="flex items-center gap-1.5"><span>⏱</span>{t.duration}</div>
                      <div className="flex items-center gap-1.5"><span>🕐</span>{t.time.split(' - ')[0]}</div>
                      <div className="flex items-center gap-1.5"><span>📍</span><span className="truncate">{t.location.split(',')[0]}</span></div>
                      <div className="col-span-2 flex items-center gap-1.5"><span>👤</span>{t.instructor}</div>
                    </div>
                    {/* Deadline */}
                    <div className="text-xs text-orange-500 font-medium mb-3 flex items-center gap-1.5">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" strokeLinecap="round"/></svg>
                      Deadline: {t.deadline}
                    </div>
                    {/* Seats */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">{t.seatsLeft} seats left of {t.seats}</span>
                        <span className="font-semibold text-[#2F2454]">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#A577D5] to-[#2F2454] rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                      <span className="font-bold text-[#2F2454]">
                        {t.price === 'Free' ? <span className="text-green-600 text-sm">Free</span> : <span className="text-sm">Rp {(t.price as number).toLocaleString('id-ID')}</span>}
                      </span>
                      <div className="flex gap-2">
                        <Link to={`/training/${t.id}`} className="border border-[#2F2454] text-[#2F2454] text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#2F2454] hover:text-white transition-all">
                          Details
                        </Link>
                        <Link to={`/training/${t.id}/register`} className="bg-[#2F2454] text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#A577D5] transition-all">
                          Register
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterPill({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:border-[#A577D5] transition-colors bg-white cursor-pointer">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
