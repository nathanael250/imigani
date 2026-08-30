import { ArrowRight, Clock, Headphones, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import akageraImage from '../assets/Destinations/akagera.png'
import { createTourInquiry } from '../services/tourService.js'

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

const contactFormFields = [
  { id: 'name', label: 'Full Name *', type: 'text' },
  { id: 'email', label: 'Email Address *', type: 'email' },
  { id: 'phone', label: 'Phone Number', type: 'tel' },
  { id: 'subject', label: 'Subject', type: 'text' },
]

const consultancyOptions = [
  'Gorilla tracking',
  'Safari and wildlife',
  'Culture and heritage',
  'Family or private tour',
  'Educational tour',
  'Group travel',
  'Other',
]

function ContactUs() {
  const [contactForm, setContactForm] = useState({
    email: '',
    message: '',
    name: '',
    phone: '',
    subject: '',
  })
  const [consultancyForm, setConsultancyForm] = useState({
    email: '',
    interest: '',
    message: '',
    name: '',
    phone: '',
  })
  const [contactSubmitState, setContactSubmitState] = useState('idle')
  const [contactSubmitMessage, setContactSubmitMessage] = useState('')
  const [consultancySubmitState, setConsultancySubmitState] = useState('idle')
  const [consultancySubmitMessage, setConsultancySubmitMessage] = useState('')

  function updateContactField(event) {
    const { name, value } = event.target
    setContactForm((current) => ({ ...current, [name]: value }))
  }

  function updateConsultancyField(event) {
    const { name, value } = event.target
    setConsultancyForm((current) => ({ ...current, [name]: value }))
  }

  async function handleContactSubmit(event) {
    event.preventDefault()
    setContactSubmitState('sending')
    setContactSubmitMessage('')

    try {
      await createTourInquiry({
        email: contactForm.email,
        inquiry: [
          'Contact Message',
          `Subject: ${contactForm.subject || 'Not specified'}`,
          '',
          contactForm.message,
        ].join('\n'),
        name: contactForm.name,
        phone: contactForm.phone,
        status: 'new',
      })
      setContactForm({
        email: '',
        message: '',
        name: '',
        phone: '',
        subject: '',
      })
      setContactSubmitState('sent')
      setContactSubmitMessage('Thank you. Your message has been sent.')
    } catch (error) {
      setContactSubmitState('error')
      setContactSubmitMessage(error.message || 'We could not send your message. Please try again.')
    }
  }

  async function handleConsultancySubmit(event) {
    event.preventDefault()
    setConsultancySubmitState('sending')
    setConsultancySubmitMessage('')

    try {
      await createTourInquiry({
        email: consultancyForm.email,
        inquiry: [
          'Tour Consultancy Request',
          `Interested In: ${consultancyForm.interest}`,
          '',
          consultancyForm.message,
        ].join('\n'),
        name: consultancyForm.name,
        phone: consultancyForm.phone,
        status: 'new',
      })
      setConsultancyForm({
        email: '',
        interest: '',
        message: '',
        name: '',
        phone: '',
      })
      setConsultancySubmitState('sent')
      setConsultancySubmitMessage('Thank you. Your consultancy request has been sent.')
    } catch (error) {
      setConsultancySubmitState('error')
      setConsultancySubmitMessage(error.message || 'We could not send your request. Please try again.')
    }
  }

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

      <section className="contact-intro-section bg-white px-5 pb-9 pt-14 text-center">
        <div className="mx-auto max-w-[760px]">
          <p className="contact-kicker">WE&apos;D LOVE TO HEAR FROM YOU</p>
          <h2 className="contact-title mt-4">Let&apos;s Plan Your Next Journey</h2>
          <div className="mx-auto mt-4 max-w-[720px] space-y-1 text-[15px] font-semibold leading-[1.55] text-[#2f3f34]">
            <p>Have a question, need travel advice, or ready to start planning your trip?</p>
            <p>Our team is here to help you create an unforgettable East African experience.</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-7">
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

      <section className="bg-white px-5 pb-8">
        <div className="contact-forms-grid mx-auto grid max-w-[1120px] gap-6 lg:grid-cols-[1.42fr_1fr]">
          <div className="contact-form-panel">
            <h2>Get in Touch</h2>
            <span className="contact-title-line" />
            <p className="mt-4 max-w-[560px] text-[14px] font-semibold leading-[1.55] text-[#536156]">
              Have a question or need more information? Send us a message and we&apos;ll get back to you soon.
            </p>

            <form className="mt-5 grid gap-3" aria-label="Contact form" onSubmit={handleContactSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                {contactFormFields.map((field) => (
                  <label key={field.id} className="contact-field" htmlFor={field.id}>
                    <span>{field.label}</span>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      value={contactForm[field.id]}
                      onChange={updateContactField}
                      required={field.id === 'name' || field.id === 'email'}
                    />
                  </label>
                ))}
              </div>
              <label className="contact-field contact-message-field" htmlFor="contact-message">
                <span>Your Message *</span>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  value={contactForm.message}
                  onChange={updateContactField}
                  required
                />
              </label>
              <button className="contact-submit" type="submit" disabled={contactSubmitState === 'sending'}>
                {contactSubmitState === 'sending' ? 'Sending...' : 'Send Message'}
                <ArrowRight className="icon-link ml-2" aria-hidden="true" />
              </button>
              {contactSubmitMessage && (
                <p className={`contact-form-status ${contactSubmitState === 'error' ? 'is-error' : ''}`}>
                  {contactSubmitMessage}
                </p>
              )}
            </form>
          </div>

          <div className="contact-form-panel contact-consultancy-panel">
            <h2>Request Consultancy</h2>
            <span className="contact-title-line" />
            <p className="mt-4 max-w-[520px] text-[14px] font-semibold leading-[1.55] text-[#536156]">
              Tell us what you need help with and our travel experts will guide you with clear advice.
            </p>

            <form
              className="mt-5 grid gap-3"
              aria-label="Tour consultancy request form"
              onSubmit={handleConsultancySubmit}
            >
              <label className="contact-field" htmlFor="consultancy-name">
                <span>Full Name *</span>
                <input
                  id="consultancy-name"
                  name="name"
                  type="text"
                  value={consultancyForm.name}
                  onChange={updateConsultancyField}
                  required
                />
              </label>
              <label className="contact-field" htmlFor="consultancy-email">
                <span>Email Address *</span>
                <input
                  id="consultancy-email"
                  name="email"
                  type="email"
                  value={consultancyForm.email}
                  onChange={updateConsultancyField}
                  required
                />
              </label>
              <label className="contact-field" htmlFor="consultancy-phone">
                <span>Phone Number *</span>
                <input
                  id="consultancy-phone"
                  name="phone"
                  type="tel"
                  value={consultancyForm.phone}
                  onChange={updateConsultancyField}
                  required
                />
              </label>
              <label className="contact-field" htmlFor="consultancy-interest">
                <span>I&apos;m interested in *</span>
                <select
                  id="consultancy-interest"
                  name="interest"
                  value={consultancyForm.interest}
                  onChange={updateConsultancyField}
                  required
                >
                  <option value="">Select an option</option>
                  {consultancyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="contact-field contact-message-field" htmlFor="consultancy-message">
                <span>Tell us more about your plans *</span>
                <textarea
                  id="consultancy-message"
                  name="message"
                  rows="4"
                  value={consultancyForm.message}
                  onChange={updateConsultancyField}
                  required
                />
              </label>
              <button className="contact-submit" type="submit" disabled={consultancySubmitState === 'sending'}>
                {consultancySubmitState === 'sending' ? 'Sending...' : 'Request Consultancy'}
                <ArrowRight className="icon-link ml-2" aria-hidden="true" />
              </button>
              {consultancySubmitMessage && (
                <p className={`contact-form-status ${consultancySubmitState === 'error' ? 'is-error' : ''}`}>
                  {consultancySubmitMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-[72px]">
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
