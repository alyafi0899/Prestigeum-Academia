import { useState } from 'react'
import { Link } from 'react-router'
import { articles } from '../data/mockData'

const CATEGORIES = ['All', 'Engineering', 'QA/QC', 'Project Management', 'HSE', 'Career', 'Industry', 'Technology']

export default function Articles() {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? articles : articles.filter((a) => a.category === cat)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-[#2F2454] px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#DBCDFD] text-sm font-medium mb-2">Knowledge Hub</p>
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Engineering Insights</h1>
          <p className="text-white/60">Expert articles and industry knowledge for engineering professionals.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${cat === c ? 'bg-[#2F2454] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#A577D5] hover:text-[#A577D5]'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Featured (first) */}
        {filtered[0] && (
          <Link to={`/articles/${filtered[0].id}`} className="block mb-8 group">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden md:flex hover:shadow-xl transition-all duration-300">
              <div className="md:w-96 h-56 md:h-auto relative overflow-hidden shrink-0">
                <img src={filtered[0].image} alt={filtered[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                <span className="absolute top-4 left-4 bg-[#A577D5] text-white text-xs font-semibold px-3 py-1 rounded-full">{filtered[0].category}</span>
                <span className="absolute top-4 right-4 bg-white/90 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">Featured</span>
              </div>
              <div className="p-7 flex flex-col justify-center">
                <h2 className="text-[#2F2454] text-xl font-bold mb-3 leading-snug group-hover:text-[#A577D5] transition-colors">{filtered[0].title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">{filtered[0].excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="font-medium text-gray-600">{filtered[0].author}</span>
                  <span>·</span>
                  <span>{filtered[0].date}</span>
                  <span>·</span>
                  <span>{filtered[0].readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(1).map((a) => (
            <Link to={`/articles/${a.id}`} key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-[#2F2454] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">{a.category}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-[#2F2454] text-sm leading-snug mb-2 group-hover:text-[#A577D5] transition-colors line-clamp-2">{a.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3 flex-1">{a.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                  <span className="font-medium text-gray-600">{a.author}</span>
                  <span>{a.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
