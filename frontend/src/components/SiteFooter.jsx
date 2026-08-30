import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import logoMark from '../assets/imigani tours.png'
import FooterList from './FooterList.jsx'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about-us', label: 'About Us' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/tours', label: 'Tours & Safaris' },
  { href: '/tours', label: 'Experiences' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact-us', label: 'Contact Us' },
]

const popularExperiences = [
  { href: '/tours', label: 'Safari & Wildlife' },
  { href: '/tours', label: 'Adventure' },
  { href: '/tours', label: 'Culture & Heritage' },
  { href: '/tours', label: 'Educational Journey' },
  { href: '/tours', label: 'Leisure & Private Journeys' },
  { href: '/tours', label: 'Tailor-Made Journeys' },
  { href: '/tours', label: 'Group & Incentive Travel' },
]

function SiteFooter() {
  return (
    <footer id="contact-us" className="bg-white px-5 pt-[58px] text-[#28342b]">
      <div className="footer-grid mx-auto grid max-w-[1120px] gap-10 pb-12 md:grid-cols-2 lg:grid-cols-[1.1fr_0.82fr_1.25fr_1fr]">
        <div>
          <img className="h-[92px] w-[92px] object-contain" src={logoMark} alt="IMIGANI Safaris and Tours" />
          <p className="mt-5 max-w-[285px] text-[15px] font-medium leading-[1.75] text-[#5e6b63]">
            Born in Rwanda inspired by Stories, Creating authentic and meaningful journeys across East Africa.
          </p>
        </div>
        <FooterList title="Quick Links" items={quickLinks} />
        <FooterList title="Popular Experiences" items={popularExperiences} />
        <div>
          <h3 className="footer-heading">Contact Us</h3>
          <address className="mt-5 space-y-3 text-[15px] font-medium not-italic leading-[1.7] text-[#5e6b63]">
            <p className="footer-contact-item">
              <Phone className="icon-xs" aria-hidden="true" />
              <a href="tel:+250785118003">+250 785 118 003</a>
            </p>
            <p className="footer-contact-item">
              <Mail className="icon-xs" aria-hidden="true" />
              <a href="mailto:info@imiganisafarisandtours.com">info@imiganisafarisandtours.com</a>
            </p>
            <p className="footer-contact-item">
              <MapPin className="icon-xs" aria-hidden="true" />
              Kigali, Rwanda
            </p>
            <p className="footer-contact-item">
              <Clock className="icon-xs" aria-hidden="true" />
              Mon - Sat 8:00 AM - 6:00 PM
            </p>
          </address>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1120px] flex-col justify-between gap-4 border-t border-[#dfe6df] py-6 text-[14px] font-medium text-[#637069] sm:flex-row">
        <p>© 2024 IMIGANI Safaris and Tours. All Rights Reserved.</p>
        <div className="flex gap-6">
          <span>Privacy Policy</span>
          <span>Terms &amp; Conditions</span>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
