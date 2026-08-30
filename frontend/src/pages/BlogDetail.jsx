import { ArrowLeft, ArrowRight, CalendarDays, ChevronRight, Clock3, FileText, Link as LinkIcon, Mail, Share2, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import akageraImage from '../assets/Destinations/akagera.png'
import logoMark from '../assets/imigani tours.png'
import { getBlogPost, listBlogPosts } from '../services/dashboardService'
import { createSubscriber } from '../services/subscriberService'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:6003').replace(/\/$/, '')
const uploadBaseUrl = getUploadBaseUrl()

function BlogDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [allArticles, setAllArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareStatus, setShareStatus] = useState('')
  const [subscriberEmail, setSubscriberEmail] = useState('')
  const [subscriberStatus, setSubscriberStatus] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadPost() {
      setIsLoading(true)
      setError('')

      try {
        const [post, posts] = await Promise.all([
          getBlogPost({ slug, status: 'published' }),
          listBlogPosts({ filters: { status: 'published' }, limit: 6 }),
        ])

        if (isMounted) {
          setArticle(post)
          setAllArticles(Array.isArray(posts) ? posts : [])
        }
      } catch {
        if (isMounted) {
          setArticle(null)
          setAllArticles([])
          setError('Blog post not found')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPost()

    return () => {
      isMounted = false
    }
  }, [slug])

  if (isLoading) {
    return (
      <section className="blog-detail-empty px-5 py-[86px]">
        <FileText aria-hidden="true" />
        <h1>Loading story...</h1>
      </section>
    )
  }

  if (error || !article) {
    return (
      <section className="blog-detail-empty px-5 py-[86px]">
        <FileText aria-hidden="true" />
        <h1>Story not found</h1>
        <Link to="/blog">Back to Blog</Link>
      </section>
    )
  }

  const coverImage = mediaPreviewUrl(article.cover_image_url) || akageraImage
  const category = article.category || 'IMIGANI STORIES'
  const publishedDate = formatDate(article.published_at || article.created_at)
  const summary = plainTextSummary(article.content, 170)
  const currentIndex = allArticles.findIndex((post) => String(post.id) === String(article.id) || post.slug === article.slug)
  const previousPost = currentIndex > 0 ? allArticles[currentIndex - 1] : null
  const nextPost = currentIndex >= 0 && currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null
  const relatedPosts = allArticles
    .filter((post) => String(post.id) !== String(article.id) && post.slug !== article.slug)
    .slice(0, 3)
  const articleUrl = typeof window !== 'undefined' ? window.location.href : ''

  async function handleShareArticle() {
    const shareData = {
      title: article.title,
      text: summary || article.title,
      url: articleUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }

      await copyArticleLink()
    } catch (shareError) {
      if (shareError?.name !== 'AbortError') {
        await copyArticleLink()
      }
    }
  }

  async function copyArticleLink() {
    try {
      await navigator.clipboard.writeText(articleUrl)
      setShareStatus('Link copied')
      window.setTimeout(() => setShareStatus(''), 1800)
    } catch {
      setShareStatus('Copy failed')
      window.setTimeout(() => setShareStatus(''), 1800)
    }
  }

  async function handleNewsletterSubmit(event) {
    event.preventDefault()
    setSubscriberStatus('')
    setIsSubscribing(true)

    try {
      await createSubscriber({
        email: subscriberEmail,
        source: 'blog',
      })
      setSubscriberEmail('')
      setSubscriberStatus('Thank you. You are subscribed.')
    } catch (subscribeError) {
      setSubscriberStatus(subscribeError.message || 'We could not subscribe you. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  function handleContentLinkClick(event) {
    const target = event.target.nodeType === 1 ? event.target : event.target.parentElement
    const link = target?.closest?.('a[href]')

    if (!link || !event.currentTarget.contains(link)) return

    const href = normalizeExternalHref(link.getAttribute('href') || link.href)

    if (!href || href.startsWith('#')) return

    event.preventDefault()
    event.stopPropagation()

    const newTab = window.open(href, '_blank', 'noopener,noreferrer')
    if (newTab) {
      newTab.opener = null
    }
  }

  return (
    <article className="blog-detail-page">
      <section className="blog-detail-hero-banner">
        <SafeImage src={coverImage} alt="" />
        <div className="blog-detail-hero-overlay" />
        <div className="blog-detail-hero-inner">
          <h1>Blog</h1>
          <nav className="blog-detail-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight aria-hidden="true" />
            <Link to="/blog">Blog</Link>
            <ChevronRight aria-hidden="true" />
            <span>{article.title}</span>
          </nav>
        </div>
      </section>

      <section className="blog-detail-body">
        <div className="blog-detail-shell">
          <main className="blog-detail-main">
            <Link className="blog-detail-back" to="/blog">
              <ArrowLeft aria-hidden="true" />
              Back to Blog
            </Link>

            <div className="blog-detail-share-mobile">
              <Share2 aria-hidden="true" />
              <span>Share</span>
              <button type="button" aria-label="Share this article" onClick={handleShareArticle}>
                <Share2 aria-hidden="true" />
              </button>
              <button type="button" aria-label="Copy article link" onClick={copyArticleLink}>
                <LinkIcon aria-hidden="true" />
              </button>
              {shareStatus ? <small>{shareStatus}</small> : null}
            </div>

            <p className="blog-detail-category">{category}</p>
            <h2 className="blog-detail-title">{article.title}</h2>
            {summary ? <p className="blog-detail-summary">{summary}</p> : null}

            <div className="blog-detail-meta-row">
              <span className="blog-detail-author-avatar">
                <img src={logoMark} alt="" />
              </span>
              <span>By IMIGANI Team</span>
              <span className="blog-detail-meta-divider" />
              <CalendarDays aria-hidden="true" />
              <span>{publishedDate}</span>
              <span className="blog-detail-meta-divider" />
              <Clock3 aria-hidden="true" />
              <span>{readingTime(article.content)} min read</span>
            </div>

            <SafeImage className="blog-detail-cover" src={coverImage} alt={article.title} />

            <div
              className="blog-detail-content"
              onClickCapture={handleContentLinkClick}
              dangerouslySetInnerHTML={{ __html: prepareBlogContent(article.content || '<p>No content added yet.</p>') }}
            />

            {(previousPost || nextPost) && (
              <nav className="blog-detail-post-nav" aria-label="Blog post navigation">
                {previousPost ? (
                  <Link to={`/blog/${previousPost.slug || previousPost.id}`}>
                    <ArrowLeft aria-hidden="true" />
                    <span>
                      <small>Previous Post</small>
                      {previousPost.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {nextPost ? (
                  <Link to={`/blog/${nextPost.slug || nextPost.id}`}>
                    <span>
                      <small>Next Post</small>
                      {nextPost.title}
                    </span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </main>

          <aside className="blog-detail-sidebar" aria-label="Blog sidebar">
            <div className="blog-detail-share">
              <span>Share:</span>
              <button type="button" aria-label="Share this article" onClick={handleShareArticle}>
                <Share2 aria-hidden="true" />
              </button>
              <button type="button" aria-label="Copy article link" onClick={copyArticleLink}>
                <LinkIcon aria-hidden="true" />
              </button>
              {shareStatus ? <small>{shareStatus}</small> : null}
            </div>

            <section className="blog-detail-sidebar-card">
              <h3>About the Author</h3>
              <div className="blog-detail-author">
                <img src={logoMark} alt="" />
                <strong>IMIGANI Team</strong>
              </div>
              <p>
                Travel writers and safari planners sharing practical stories, destination insight, and meaningful
                ways to experience East Africa.
              </p>
              <div className="blog-detail-socials" aria-label="Author links">
                <span><UserRound aria-hidden="true" /></span>
                <span><Mail aria-hidden="true" /></span>
                <span><LinkIcon aria-hidden="true" /></span>
              </div>
            </section>

            <section className="blog-detail-sidebar-card">
              <h3>Related Posts</h3>
              <div className="blog-related-list">
                {relatedPosts.length > 0 ? (
                  relatedPosts.map((post) => (
                    <Link className="blog-related-post" to={`/blog/${post.slug || post.id}`} key={post.id || post.slug || post.title}>
                      <SafeImage src={mediaPreviewUrl(post.cover_image_url) || akageraImage} alt="" />
                      <span>
                        <small>{post.category || 'IMIGANI STORIES'}</small>
                        <strong>{post.title}</strong>
                        <em>{formatDate(post.published_at || post.created_at)}</em>
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="blog-related-empty">More stories will appear here soon.</p>
                )}
              </div>
            </section>

            <section className="blog-detail-sidebar-card blog-newsletter-card">
              <span className="blog-newsletter-icon">
                <Mail aria-hidden="true" />
              </span>
              <h3>Stay Inspired</h3>
              <p>Subscribe to our newsletter for travel stories, tips, and special offers.</p>
              <form className="blog-newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  value={subscriberEmail}
                  onChange={(event) => setSubscriberEmail(event.target.value)}
                  required
                />
                <button type="submit" disabled={isSubscribing}>
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {subscriberStatus ? <small className="blog-newsletter-message">{subscriberStatus}</small> : null}
            </section>
          </aside>
        </div>
      </section>
    </article>
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

function plainTextSummary(value, maxLength = 170) {
  const text = String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength - 1).trim()}...`
}

function readingTime(value) {
  const words = String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  return Math.max(1, Math.ceil(words.length / 180))
}

function prepareBlogContent(value) {
  const html = String(value || '')

  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    return html
  }

  const doc = new window.DOMParser().parseFromString(html, 'text/html')

  doc.querySelectorAll('a[href]').forEach((link) => {
    const originalHref = link.getAttribute('href')?.trim() || ''
    const href = normalizeExternalHref(originalHref)

    if (!href) return

    link.setAttribute('href', href)
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
  })

  return doc.body.innerHTML
}

function normalizeExternalHref(href) {
  const value = String(href || '').trim()

  if (!value || value.startsWith('#')) return value
  if (/^(mailto:|tel:|https?:\/\/)/i.test(value)) {
    return normalizeLocalBlogUrl(value)
  }

  if (value.startsWith('/')) {
    return normalizeLocalBlogPath(value)
  }

  return `https://${value}`
}

function normalizeLocalBlogUrl(value) {
  if (typeof window === 'undefined') return value

  try {
    const url = new URL(value)

    if (url.origin !== window.location.origin || !url.pathname.startsWith('/blog/')) {
      return value
    }

    return normalizeLocalBlogPath(`${url.pathname}${url.search}${url.hash}`)
  } catch {
    return value
  }
}

function normalizeLocalBlogPath(value) {
  const match = value.match(/^\/blog\/([^/?#]+)(.*)$/)
  const possibleDomain = match?.[1] || ''

  if (!possibleDomain.includes('.')) return value

  return `https://${possibleDomain}${match?.[2] || ''}`
}

function mediaPreviewUrl(url) {
  if (!url || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }

  if (/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/uploads/i.test(url)) {
    return `${uploadBaseUrl}${new URL(url).pathname}`
  }

  if (url.startsWith('http')) {
    return url
  }

  if (url.startsWith('/uploads')) {
    return `${uploadBaseUrl}${url}`
  }

  return url
}

function getUploadBaseUrl() {
  if (typeof window === 'undefined') {
    return apiBaseUrl
  }

  const apiHost = new URL(apiBaseUrl, window.location.origin).hostname
  const pageHost = window.location.hostname
  const apiIsLocal = apiHost === '127.0.0.1' || apiHost === 'localhost'
  const pageIsLocal = pageHost === '127.0.0.1' || pageHost === 'localhost'

  return apiIsLocal && !pageIsLocal ? '' : apiBaseUrl
}

function SafeImage({ alt, className = '', src }) {
  return (
    <img
      className={className}
      src={src || akageraImage}
      alt={alt}
      loading="lazy"
      onError={(event) => {
        if (!event.currentTarget.dataset.fallbackApplied) {
          event.currentTarget.dataset.fallbackApplied = 'true'
          event.currentTarget.src = akageraImage
        }
      }}
    />
  )
}

export default BlogDetail
