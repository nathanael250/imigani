import { ArrowRight, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import akageraImage from '../assets/Destinations/akagera.png'
import { listBlogPosts } from '../services/dashboardService'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:6003').replace(/\/$/, '')

function Blog() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadPosts() {
      try {
        const posts = await listBlogPosts({ filters: { status: 'published' }, limit: 100 })

        if (isMounted) {
          setArticles(Array.isArray(posts) ? posts : [])
        }
      } catch {
        if (isMounted) {
          setArticles([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPosts()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <section className="blog-hero relative isolate flex min-h-[215px] items-center overflow-hidden px-5 text-white">
        <img src={akageraImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,11,0.78),rgba(117,78,23,0.46),rgba(7,24,11,0.32))]" />
        <div className="relative mx-auto w-full max-w-[1120px]">
          <h1 className="text-[46px] font-bold leading-tight sm:text-[56px]">Blog</h1>
          <span className="mt-2 block h-[4px] w-[78px] rounded bg-[#c6923d]" />
        </div>
      </section>

      <section className="blog-section bg-white px-5 py-[76px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="max-w-[720px]">
            <p className="blog-kicker">STORIES & INSIGHTS</p>
            <h2 className="blog-title">From East Africa, With Stories</h2>
            <p className="blog-intro">
              Discover travel inspiration, destination guides, wildlife stories, cultural insights, and useful
              advice for exploring East Africa.
            </p>
          </div>

          {isLoading ? (
            <div className="mt-12 rounded-[10px] border border-[#d7e2d5] bg-white px-6 py-10 text-center text-[15px] font-bold text-[#627064]">
              Loading blog posts...
            </div>
          ) : articles.length > 0 ? (
            <div className="blog-grid">
              {articles.map((article) => {
                const articlePath = `/blog/${article.slug || article.id}`

                return (
                  <article className="blog-card" key={article.id || article.slug || article.title}>
                    <Link className="blog-card-image" to={articlePath} aria-label={article.title}>
                      <img src={mediaPreviewUrl(article.cover_image_url) || akageraImage} alt="" />
                    </Link>
                  <div className="blog-card-body">
                    <p className="blog-card-meta">{article.category || 'IMIGANI STORIES'}</p>
                    <h3>
                      <Link to={articlePath}>{article.title}</Link>
                    </h3>
                    <p className="blog-card-excerpt">{plainTextSummary(article.content, 140)}</p>
                    <div className="blog-card-footer">
                      <span>{formatDate(article.published_at || article.created_at)}</span>
                      <Link className="blog-read-link" to={articlePath}>
                        Read Story <ArrowRight className="icon-link" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
                )
              })}
            </div>
          ) : (
            <div className="mt-12 flex min-h-[320px] flex-col items-center justify-center rounded-[10px] border border-[#d7e2d5] bg-white px-6 py-14 text-center shadow-[0_18px_45px_rgba(10,35,17,0.08)]">
              <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f0e8] text-[var(--deep-green)]">
                <FileText className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="text-[28px] font-bold leading-tight text-[var(--deep-green)]">No blog posts yet</h3>
              <p className="mt-3 max-w-[520px] text-[15px] font-bold leading-7 text-[#627064]">
                There are no blog stories created in the database right now. Once posts are added, they will appear
                here for visitors to read.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function formatDate(date) {
  if (!date) return 'Not dated'

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function plainTextSummary(value, maxLength = 140) {
  const text = String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength - 1).trim()}...`
}

function mediaPreviewUrl(url) {
  if (!url || url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }

  if (url.startsWith('/uploads')) {
    return `${apiBaseUrl}${url}`
  }

  return url
}

export default Blog
