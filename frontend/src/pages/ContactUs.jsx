import { ArrowRight, Clock, Headphones, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import akageraImage from '../assets/Destinations/akagera.png'
import kigaliImage from '../assets/Destinations/Kigali.jpg'

const contactCards = [
  {
    Icon: Phone,
    title: 'Call Us',
    lines: ['+250 785 118 003', 'Mon - Sat: 8:00 AM - 6:00 PM'],
    href: 'tel:+250785118003',
  },
  {
    Icon: Mail,
    title: 'Email Us',
    lines: ['info@imiganitours.com', 'We reply within 24 hours'],
    href: 'mailto:info@imiganitours.com',
  },
  {
    Icon: MapPin,
    title: 'Visit Us',
    lines: ['Kigali, Rwanda', 'KN 5 Rd, Nyarugenge District'],
  },
  {
    Icon: Clock,
    title: 'Working Hours',
    lines: ['Monday - Saturday', '8:00 AM - 6:00 PM'],
  },
]

const formFields = [
  { id: 'fullName', label: 'Full Name *', type: 'text' },
  { id: 'email', label: 'Email Address *', type: 'email' },
  { id: 'phone', label: 'Phone Number', type: 'tel' },
  { id: 'subject', label: 'Subject', type: 'text' },
]

function ContactUs() {
  return (
    <>
      <section className="contact-hero relative isolate flex min-h-[215px] items-center overflow-hidden px-5 text-white">
        <img src={akageraImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,11,0.78),rgba(93,61,21,0.48),rgba(7,24,11,0.36))]" />
        <div className="contact-hero-grain absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1120px]">
          <h1 className="text-[42px] font-bold leading-tight sm:text-[56px]">Contact Us</h1>
          <span className="mt-3 block h-[4px] w-[82px] rounded bg-[#c6923d]" />
        </div>
      </section>

      <section className="contact-intro-section bg-white px-5 pb-[54px] pt-[72px] text-center">
        <div className="mx-auto max-w-[760px]">
          <p className="contact-kicker">WE&apos;D LOVE TO HEAR FROM YOU</p>
          <h2 className="contact-title mt-4">Let&apos;s Plan Your Next Journey</h2>
          <div className="mx-auto mt-5 max-w-[720px] space-y-2 text-[17px] font-semibold leading-[1.65] text-[#2f3f34]">
            <p>Have a question, need travel advice, or ready to start planning your trip?</p>
            <p>Our team is here to help you create an unforgettable East African experience.</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-[76px]">
        <div className="mx-auto grid max-w-[1120px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((card) => (
            <article key={card.title} className="contact-info-card">
              <span className="contact-icon-badge">
                <card.Icon aria-hidden="true" />
              </span>
              <h3>{card.title}</h3>
              <div className="mt-4 space-y-2">
                {card.lines.map((line, index) =>
                  card.href && index === 0 ? (
                    <a key={line} href={card.href}>
                      {line}
                    </a>
                  ) : (
                    <p key={line}>{line}</p>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 pb-[82px]">
        <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[1fr_0.93fr] lg:items-start">
          <div className="contact-form-panel">
            <h2>Send Us a Message</h2>
            <span className="contact-title-line" />
            <p className="mt-5 max-w-[560px] text-[15px] font-semibold leading-[1.75] text-[#536156]">
              Share a few details about your trip idea and our planning team will help shape it into a thoughtful
              East African journey.
            </p>

            <form className="mt-8 grid gap-5" aria-label="Contact form">
              <div className="grid gap-5 sm:grid-cols-2">
                {formFields.map((field) => (
                  <label key={field.id} className="contact-field" htmlFor={field.id}>
                    <span>{field.label}</span>
                    <input id={field.id} name={field.id} type={field.type} />
                  </label>
                ))}
              </div>
              <label className="contact-field" htmlFor="message">
                <span>Your Message *</span>
                <textarea id="message" name="message" rows="6" />
              </label>
              <button className="contact-submit" type="button">
                Send Message <ArrowRight className="icon-link ml-2" aria-hidden="true" />
              </button>
            </form>
          </div>

          <aside className="contact-location-card" aria-label="IMIGANI location in Kigali">
            <img src={kigaliImage} alt="Kigali city view in Rwanda" />
            <div className="contact-map-panel">
              <span className="contact-map-pin" aria-hidden="true">
                <MapPin />
              </span>
              <div className="contact-location-note">
                <p>Find Us Here</p>
                <address>KN 5 Rd, Nyarugenge District, Kigali, Rwanda</address>
                <a href="https://maps.google.com/?q=KN%205%20Rd%20Nyarugenge%20District%20Kigali%20Rwanda">
                  View on Google Maps <ArrowRight className="icon-link" aria-hidden="true" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white px-5 pb-[88px]">
        <div className="contact-assistance-strip mx-auto flex max-w-[1120px] flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
          <div className="flex items-start gap-5">
            <span className="contact-assist-icon">
              <Headphones aria-hidden="true" />
            </span>
            <div>
              <h2>Need immediate assistance?</h2>
              <p>Chat with our team for quick answers while you plan your journey.</p>
            </div>
          </div>
          <a className="contact-whatsapp-button" href="https://wa.me/250785118003">
            <MessageCircle className="icon-link mr-2" aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}

export default ContactUs
