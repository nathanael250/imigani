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
      <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-x-4 gap-y-7 pb-12 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.1fr_0.82fr_1.25fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <img className="h-[68px] w-[68px] object-contain sm:h-[92px] sm:w-[92px]" src={logoMark} alt="IMIGANI Safaris and Tours" />
          <p className="mt-5 max-w-[285px] text-[12px] font-medium leading-[1.55] text-[#5e6b63] sm:text-[15px] sm:leading-[1.75]">
            Born in Rwanda inspired by Stories, Creating authentic and meaningful journeys across East Africa.
          </p>
        </div>
        <FooterList title="Quick Links" items={quickLinks} />
        <FooterList title="Popular Experiences" items={popularExperiences} />
        <div className="col-span-2 lg:col-span-1">
          <h3 className="text-[14px] font-bold text-[#18361d] sm:text-[16px]">Contact Us</h3>
          <address className="mt-5 grid gap-3 text-[12px] font-medium not-italic leading-[1.55] text-[#5e6b63] sm:text-[15px] sm:leading-[1.7]">
            <p className="flex items-center gap-[9px]">
              <Phone className="icon-xs" aria-hidden="true" />
              <a href="tel:+250785118003">+250 785 118 003</a>
            </p>
            <p className="flex items-center gap-[9px]">
              <Mail className="icon-xs" aria-hidden="true" />
              <a href="mailto:info@imiganisafarisandtours.com">info@imiganisafarisandtours.com</a>
            </p>
            <p className="flex items-center gap-[9px]">
              <MapPin className="icon-xs" aria-hidden="true" />
              Kigali, Rwanda
            </p>
            <p className="flex items-center gap-[9px]">
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
