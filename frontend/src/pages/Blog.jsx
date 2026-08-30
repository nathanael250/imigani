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
      <section className="relative isolate flex min-h-[215px] items-center overflow-hidden px-5 text-white">
        <img src={akageraImage} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_52%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,11,0.78),rgba(117,78,23,0.46),rgba(7,24,11,0.32))]" />
        <div className="relative mx-auto w-full max-w-[1120px]">
          <h1 className="text-[46px] font-bold leading-tight sm:text-[56px]">Blog</h1>
          <span className="mt-2 block h-[4px] w-[78px] rounded bg-[#c6923d]" />
        </div>
      </section>

      <section className="bg-white px-5 py-[62px] md:py-[76px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="max-w-[720px]">
            <p className="text-[14px] font-bold leading-[1.2] text-[#c6923d]">STORIES & INSIGHTS</p>
            <h2 className="mt-[13px] text-[34px] font-bold leading-[1.12] text-[#263129] sm:text-[clamp(34px,3.6vw,48px)]">
              From East Africa, With Stories
            </h2>
            <p className="mt-[17px] max-w-[680px] text-[16px] font-semibold leading-[1.7] text-[#2f3f34] sm:text-[clamp(16px,1.4vw,18px)]">
              Discover travel inspiration, destination guides, wildlife stories, cultural insights, and useful
              advice for exploring East Africa.
            </p>
          </div>

          {isLoading ? (
            <div className="mt-12 rounded-[10px] border border-[#d7e2d5] bg-white px-6 py-10 text-center text-[15px] font-bold text-[#627064]">
              Loading blog posts...
            </div>
          ) : articles.length > 0 ? (
            <div className="mt-[42px] grid grid-cols-1 gap-x-[26px] gap-y-[31px] min-[861px]:grid-cols-3 sm:grid-cols-2">
              {articles.map((article) => {
                const articlePath = `/blog/${article.slug || article.id}`

                return (
                  <article
                    className="group flex min-w-0 flex-col overflow-hidden rounded-[7px] border border-[#0b2a12]/10 bg-white shadow-[0_16px_36px_rgba(11,42,18,0.08)] transition hover:-translate-y-1 hover:border-[#c6923d]/40 hover:shadow-[0_24px_48px_rgba(11,42,18,0.14)]"
                    key={article.id || article.slug || article.title}
                  >
                    <Link className="block h-[214px] overflow-hidden bg-[#d7e3d8] min-[520px]:max-sm:h-[150px]" to={articlePath} aria-label={article.title}>
                      <img
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
                        src={mediaPreviewUrl(article.cover_image_url) || akageraImage}
                        alt=""
                      />
                    </Link>
                  <div className="flex min-h-0 flex-1 flex-col p-4 sm:min-h-[314px] sm:p-[25px_24px_23px]">
                    <p className="text-[11px] font-bold leading-[1.35] text-[#c6923d]">{article.category || 'IMIGANI STORIES'}</p>
                    <h3 className="mt-3 text-[20px] font-bold leading-[1.22] text-[#102f16] min-[520px]:max-sm:text-[15px] sm:text-[clamp(20px,1.7vw,24px)]">
                      <Link className="text-inherit transition hover:text-[#c6923d]" to={articlePath}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="mt-[15px] text-[14px] font-semibold leading-[1.62] text-[#455348] min-[520px]:max-sm:text-[12px]">
                      {plainTextSummary(article.content, 140)}
                    </p>
                    <div className="mt-auto grid gap-[15px] pt-[22px] text-[12px] font-bold leading-[1.35] text-[#68736b]">
                      <span>{formatDate(article.published_at || article.created_at)}</span>
                      <Link
                        className="inline-flex w-fit items-center gap-[7px] text-[13px] font-bold text-[#855113] transition hover:translate-x-[3px] hover:text-[#0b2a12]"
                        to={articlePath}
                      >
                        Read Story <ArrowRight className="h-[14px] w-[14px] flex-none stroke-[2.4]" aria-hidden="true" />
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
