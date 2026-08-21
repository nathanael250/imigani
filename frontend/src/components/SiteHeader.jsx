import { Globe2, Mail, Phone } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import logoMark from '../assets/imigani tours.png'

const navLinks = ['Home', 'About Us', 'Destinations', 'Tours & Safari', 'Blog', 'Contact US']

const socialLinks = [
  { label: 'Facebook', Icon: FaFacebookF },
  { label: 'Instagram', Icon: FaInstagram },
  { label: 'LinkedIn', Icon: FaLinkedinIn },
  { label: 'X', Icon: FaXTwitter },
]

function SiteHeader() {
  const { pathname } = useLocation()

  return (
    <header className="relative z-20 bg-white">
      <div className="top-header px-5">
        <div className="header-inner mx-auto grid h-full max-w-[1120px] items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="contact-row flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[14px] font-semibold text-[#2f3f34] md:justify-start">
            <a className="inline-flex items-center gap-2" href="tel:+250785118003">
              <Phone className="icon-xs" aria-hidden="true" />
              +250 785 118 003
            </a>
            <a className="inline-flex items-center gap-2" href="mailto:info@imiganitours.com">
              <Mail className="icon-xs" aria-hidden="true" />
              info@imiganitours.com
            </a>
          </div>
          <Link to="/" className="logo-link flex items-center justify-center" aria-label="IMIGANI home">
            <img className="h-[78px] w-[78px] object-contain" src={logoMark} alt="IMIGANI Safaris and Tours" />
          </Link>
          <div className="social-row flex items-center justify-center gap-3 md:justify-end" aria-label="Social links">
            {socialLinks.map((item) => (
              <span
                key={item.label}
                className="social-link social-link-disabled"
                aria-label={`${item.label} coming soon`}
                title={`${item.label} coming soon`}
              >
                <item.Icon className="icon-social" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <nav className="nav-band px-5">
        <div className="nav-inner mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-4 py-3 lg:flex-row">
          <div className="nav-links flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {navLinks.map((link) => {
              const href = getNavHref(link)
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

              return (
                <Link key={link} to={href} className={`nav-link ${isActive ? 'nav-link-active' : ''}`}>
                  {link}
                </Link>
              )
            })}
          </div>
          <div className="nav-actions flex items-center gap-5">
            <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-white/90">
              <Globe2 className="icon-xs" aria-hidden="true" />
              🇷🇼 English
            </span>
            <a className="plan-button" href="mailto:info@imiganisafarisandtours.com">
              Plan Your Trip
            </a>
          </div>
        </div>
      </nav>
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
