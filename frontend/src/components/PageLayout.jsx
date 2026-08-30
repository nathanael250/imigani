import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import FloatingWhatsApp from './FloatingWhatsApp.jsx'
import SharedCta from './SharedCta.jsx'
import SiteFooter from './SiteFooter.jsx'
import SiteHeader from './SiteHeader.jsx'

function PageLayout({ page }) {
  const revealRootRef = usePageReveal()

  return (
    <main className="min-h-screen bg-white text-[#263129]">
      <SiteHeader />
      <div ref={revealRootRef} className="site-reveal-root">
        {page}
        <SharedCta />
        <SiteFooter />
      </div>
      <FloatingWhatsApp />
    </main>
  )
}

function usePageReveal() {
  const rootRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    root.querySelectorAll('.site-reveal').forEach((item) => {
      item.classList.remove('site-reveal', 'is-visible')

      if (item.dataset.siteRevealDelay === 'true') {
        item.style.removeProperty('--reveal-delay')
        delete item.dataset.siteRevealDelay
      }
    })

    const contentSelector = [
      '.section-heading',
      '.blog-detail-cover',
      '.blog-detail-post-nav',
      '.blog-detail-sidebar-card',
      'section h1',
      'section h2',
      'section h3',
      'section p',
      'section ul',
      'section ol',
      'section form',
      'section a.cta-button',
    ].join(', ')

    const cardSelector = '.blog-detail-sidebar-card'
    const items = Array.from(root.querySelectorAll(contentSelector)).filter((item) => {
      const containingCard = item.closest(cardSelector)

      return !containingCard || containingCard === item
    })

    items.forEach((item, index) => {
      item.classList.remove('is-visible')
      item.classList.add('site-reveal')

      if (!item.style.getPropertyValue('--reveal-delay')) {
        item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 80}ms`)
        item.dataset.siteRevealDelay = 'true'
      }
    })

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )

    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [pathname])

  return rootRef
}

export default PageLayout
