import { Mail, Menu, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import logoMark from '../assets/imigani tours.png'
import { usePlanVisit } from '../contexts/PlanVisitContext.jsx'
import LanguageMenu from './LanguageMenu.jsx'

const navLinks = ['Home', 'About Us', 'Destinations', 'Tours & Safari', 'Blog', 'Contact US']

const socialLinks = [
  { label: 'Facebook', Icon: FaFacebookF },
  { label: 'Instagram', Icon: FaInstagram },
  { label: 'LinkedIn', Icon: FaLinkedinIn },
  { label: 'X', Icon: FaXTwitter },
]

function SiteHeader() {
  const { pathname } = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openPlanVisit } = usePlanVisit()

  return (
    <header className="relative z-40 bg-white shadow-[0_8px_24px_rgba(11,42,18,0.08)]">
      <div className="lg:hidden">
        <div className="flex h-[72px] items-center justify-between px-5">
          <Link to="/" className="flex items-center" aria-label="IMIGANI home" onClick={() => setIsMenuOpen(false)}>
            <img className="h-[58px] w-[58px] object-contain" src={logoMark} alt="IMIGANI Safaris and Tours" />
          </Link>
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#dfe6df] bg-white text-[#0b2a12] shadow-[0_8px_20px_rgba(11,42,18,0.08)]"
            type="button"
            aria-controls="site-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav id="site-navigation" className="bg-[#0b2a12] px-5 py-4 text-white">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const href = getNavHref(link)
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

                return (
                  <Link
                    key={link}
                    to={href}
                    className={`min-h-10 rounded-[6px] border px-3 py-2 text-[13px] font-bold leading-snug ${
                      isActive
                        ? 'border-[#d3a14e] bg-white/10 text-[#d3a14e]'
                        : 'border-white/15 text-white/88'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link}
                  </Link>
                )
              })}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 text-[12px] font-semibold leading-snug text-white/78 min-[420px]:grid-cols-2">
              <a className="inline-flex min-w-0 items-center gap-2 break-words rounded-[6px] border border-white/10 px-3 py-2" href="tel:+250785118003">
                <Phone className="h-4 w-4 flex-none" aria-hidden="true" />
                +250 785 118 003
              </a>
              <a className="inline-flex min-w-0 items-center gap-2 break-all rounded-[6px] border border-white/10 px-3 py-2" href="mailto:info@imiganitours.com">
                <Mail className="h-4 w-4 flex-none" aria-hidden="true" />
                info@imiganitours.com
              </a>
            </div>

            <div className="mt-4 flex justify-center gap-2" aria-label="Social links">
              {socialLinks.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/14 text-white/82"
                  aria-label={`${item.label} coming soon`}
                  title={`${item.label} coming soon`}
                >
                  <item.Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2">
              <LanguageMenu
                className="w-full"
                buttonClassName="!h-11 !min-h-11 !w-full !rounded-[6px] !border-white/18 !bg-white/8 !px-3 !text-[13px] !text-white"
                listClassName="!left-0 !right-auto !z-50 !w-full"
              />
              <button
                className="inline-flex h-11 items-center justify-center rounded-[6px] bg-white px-4 text-[13px] font-bold text-[#0b2a12]"
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  openPlanVisit()
                }}
              >
                Plan Your Trip
              </button>
            </div>
          </nav>
        )}
      </div>

      <div className="hidden lg:block">
        <div className="px-5">
          <div className="mx-auto grid h-[82px] max-w-[1120px] grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[14px] font-semibold text-[#2f3f34]">
            <a className="inline-flex items-center gap-2" href="tel:+250785118003">
              <Phone className="h-4 w-4" aria-hidden="true" />
              +250 785 118 003
            </a>
            <a className="inline-flex items-center gap-2" href="mailto:info@imiganitours.com">
              <Mail className="h-4 w-4" aria-hidden="true" />
              info@imiganitours.com
            </a>
          </div>
            <Link to="/" className="flex items-center justify-center" aria-label="IMIGANI home">
            <img className="h-[78px] w-[78px] object-contain" src={logoMark} alt="IMIGANI Safaris and Tours" />
          </Link>
            <div className="flex items-center justify-end gap-3" aria-label="Social links">
            {socialLinks.map((item) => (
              <span
                key={item.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#d7e3d8] text-[#0b2a12]"
                aria-label={`${item.label} coming soon`}
                title={`${item.label} coming soon`}
              >
                  <item.Icon className="h-4 w-4" aria-hidden="true" />
              </span>
            ))}
            </div>
          </div>
        </div>

        <nav className="bg-[#0b2a12] px-5 shadow-[0_11px_26px_rgba(11,42,18,0.18)]">
          <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 py-3">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {navLinks.map((link) => {
              const href = getNavHref(link)
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

              return (
                <Link
                  key={link}
                  to={href}
                    className={`relative text-[14px] font-bold transition ${
                      isActive ? 'text-[#d3a14e] after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:rounded after:bg-[#d3a14e]' : 'text-white/88 hover:text-white'
                    }`}
                >
                  {link}
                </Link>
              )
            })}
          </div>
            <div className="flex items-center gap-5">
              <LanguageMenu />
            <button
                className="inline-flex min-h-[46px] items-center justify-center rounded-[5px] bg-[#855113] px-6 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#72440f]"
              type="button"
              onClick={() => {
                openPlanVisit()
              }}
            >
              Plan Your Trip
            </button>
          </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

function getNavHref(link) {
  const routes = {
    Home: '/',
    'About Us': '/about-us',
    Destinations: '/destinations',
    'Tours & Safari': '/tours',
    Blog: '/blog',
    'Contact US': '/contact-us',
  }

  return routes[link] ?? '#'
}

export default SiteHeader
