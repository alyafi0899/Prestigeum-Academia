import { useState, useEffect } from 'react'
import { dataService } from '../data/dataService'

const CATEGORIES = ['All', 'Training', 'Workshop', 'Seminar', 'Engineering Activities', 'Community', 'Events']

export default function Gallery() {
  const [cat, setCat] = useState('All')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<any | null>(null)
  const [lbIndex, setLbIndex] = useState(0)

  useEffect(() => {
    dataService.getGallery()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = cat === 'All' ? items : items.filter((g) => g.category === cat)

  const openLightbox = (item: any) => {
    setLightbox(item)
    setLbIndex(filtered.indexOf(item))
  }
  const navLb = (dir: 1 | -1) => {
    const next = (lbIndex + dir + filtered.length) % filtered.length
    setLbIndex(next)
    setLightbox(filtered[next])
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-[#2F2454] px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#DBCDFD] text-sm font-medium mb-2">Visual Archive</p>
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Training Gallery</h1>
          <p className="text-white/60">Moments from our engineering training programs, workshops, and events.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${cat === c ? 'bg-[#2F2454] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#A577D5] hover:text-[#A577D5]'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading gallery...</div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filtered.map((item, i) => (
              <div key={item.id} className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl shadow-sm border border-gray-100" onClick={() => openLightbox(item)}>
                <img src={item.image_url} alt={item.title} className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${i % 3 === 0 ? 'h-64' : i % 3 === 1 ? 'h-48' : 'h-56'}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2F2454]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{item.category}</span>
                  <p className="text-white font-bold text-base mt-1">{item.title}</p>
                  <p className="text-white/70 text-xs line-clamp-2 mt-1">{item.caption}</p>
                  <p className="text-white/40 text-[10px] uppercase font-bold mt-2 tracking-tighter">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l12 12M15 3l-12 12" strokeLinecap="round"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); navLb(-1) }} className="absolute left-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4L6 9l5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); navLb(1) }} className="absolute right-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 4l5 5-5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-3xl w-full">
            <img src={lightbox.image_url} alt={lightbox.title} className="w-full max-h-[70vh] object-contain rounded-2xl" />
            <div className="text-center mt-4">
              <span className="text-cyan-400 text-xs font-semibold">{lightbox.category}</span>
              <p className="text-white font-bold mt-1">{lightbox.title}</p>
              <p className="text-white/60 text-sm">{lightbox.caption}</p>
              <p className="text-white/40 text-xs mt-1">{lightbox.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
