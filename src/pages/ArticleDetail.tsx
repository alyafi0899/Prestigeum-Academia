import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { dataService } from '../data/dataService'

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      setLoading(true)
      dataService.getArticleById(id)
        .then(data => {
          setArticle(data)
          return dataService.getArticles()
        })
        .then(all => {
          setRelated(all.filter((a: any) => a.id !== id).slice(0, 2))
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading article...</div>

  if (!article) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">📰</div>
        <h2 className="text-xl font-bold text-[#2F2454] mb-2">Article Not Found</h2>
        <Link to="/articles" className="text-[#A577D5] hover:underline">Back to Articles</Link>
      </div>
    </div>
  )

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2F2454]/90 via-[#2F2454]/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-8 max-w-4xl mx-auto left-0 right-0">
          <span className="inline-block bg-[#A577D5] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">{article.category}</span>
          <h1 className="text-white text-2xl md:text-4xl font-bold leading-tight">{article.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b border-gray-100 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A577D5] to-[#2F2454] flex items-center justify-center text-white text-xs font-bold">
              {article.author?.[0] || 'A'}
            </div>
            <span className="font-medium text-gray-700">{article.author}</span>
          </div>
          <span>·</span>
          <span>{new Date(article.published_at).toLocaleDateString()}</span>
          <span>·</span>
          <span>{article.read_time}</span>
          <div className="ml-auto flex items-center gap-3">
            {['LinkedIn', 'Twitter', 'WhatsApp'].map((s) => (
              <button key={s} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#F2EFFD] flex items-center justify-center text-xs text-gray-500 hover:text-[#A577D5] transition-all font-bold">
                {s[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="prose max-w-none text-gray-700 text-base leading-relaxed space-y-5">
          {article.body.split('\n\n').map((para, i) => {
            if (para.startsWith('## ')) return <h2 key={i} className="text-[#2F2454] text-xl font-bold mt-8 mb-3">{para.slice(3)}</h2>
            if (para.startsWith('# ')) return <h1 key={i} className="text-[#2F2454] text-2xl font-bold mt-8 mb-3">{para.slice(2)}</h1>
            return <p key={i} className="text-gray-600 leading-relaxed">{para}</p>
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-[#F2EFFD] rounded-2xl p-6 text-center">
          <p className="font-bold text-[#2F2454] text-lg mb-2">Ready to Learn More?</p>
          <p className="text-gray-500 text-sm mb-4">Join our training programs to build practical engineering skills.</p>
          <Link to="/training" className="inline-block bg-[#2F2454] text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#A577D5] transition-all">
            Explore Training
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-bold text-[#2F2454] text-xl mb-5">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {related.map((a) => (
                <Link to={`/articles/${a.id}`} key={a.id} className="flex gap-4 bg-gray-50 rounded-2xl p-4 hover:bg-[#F2EFFD] transition-all group">
                  <img src={a.image_url} alt={a.title} className="w-20 h-16 rounded-xl object-cover shrink-0" />
                  <div>
                    <span className="text-[10px] font-semibold text-[#A577D5]">{a.category}</span>
                    <p className="font-semibold text-gray-800 text-sm leading-snug mt-0.5 group-hover:text-[#2F2454] line-clamp-2">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{a.read_time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
