import SharedCta from './SharedCta.jsx'
import SiteFooter from './SiteFooter.jsx'
import SiteHeader from './SiteHeader.jsx'

function PageLayout({ page }) {
  return (
    <main className="min-h-screen bg-white text-[#263129]">
      <SiteHeader />
      {page}
      <SharedCta />
      <SiteFooter />
    </main>
  )
}

export default PageLayout
