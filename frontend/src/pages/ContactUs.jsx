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
      <section className="relative isolate flex min-h-[190px] items-center overflow-hidden px-5 text-white sm:min-h-[215px]">
        <img src={akageraImage} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_58%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,11,0.78),rgba(93,61,21,0.48),rgba(7,24,11,0.36))]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_21%_34%,rgba(211,161,78,0.18),transparent_24%),linear-gradient(0deg,rgba(11,42,18,0.22),transparent_54%)] mix-blend-screen" />
        <div className="relative mx-auto w-full max-w-[1120px]">
          <h1 className="text-[42px] font-bold leading-tight sm:text-[56px]">Contact Us</h1>
          <span className="mt-3 block h-[4px] w-[82px] rounded bg-[#c6923d]" />
        </div>
      </section>

      <section className="bg-white px-5 pb-9 pt-[58px] text-center md:pt-14">
        <div className="mx-auto max-w-[760px]">
          <p className="text-[13px] font-bold leading-[1.2] text-[#c6923d]">WE&apos;D LOVE TO HEAR FROM YOU</p>
          <h2 className="mt-4 text-[30px] font-bold leading-[1.14] text-[#263129] sm:text-[clamp(30px,3vw,40px)]">
            Let&apos;s Plan Your Next Journey
          </h2>
          <div className="mx-auto mt-4 max-w-[720px] space-y-1 text-[15px] font-semibold leading-[1.55] text-[#2f3f34]">
            <p>Have a question, need travel advice, or ready to start planning your trip?</p>
            <p>Our team is here to help you create an unforgettable East African experience.</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-7">
        <div className="mx-auto grid max-w-[1120px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((card) => (
            <article
              key={card.title}
              className="min-h-0 rounded-[7px] border border-[#0b2a12]/10 bg-white px-[18px] py-[22px] text-center shadow-[0_15px_34px_rgba(11,42,18,0.08)] transition hover:-translate-y-1 hover:border-[#c6923d]/35 hover:shadow-[0_23px_48px_rgba(11,42,18,0.13)] md:min-h-[172px]"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#d7e3d8] text-[#0b2a12]">
                <card.Icon className="h-[21px] w-[21px] stroke-[1.9]" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[16px] font-bold leading-[1.2] text-[#102f16]">{card.title}</h3>
              <div className="mt-4 space-y-2">
                {card.lines.map((line, index) =>
                  card.href && index === 0 ? (
                    <a
                      className="block text-[12px] font-bold leading-[1.45] text-[#3f4f43] transition hover:text-[#c6923d]"
                      key={line}
                      href={card.href}
                    >
                      {line}
                    </a>
                  ) : (
                    <p className="text-[12px] font-bold leading-[1.45] text-[#3f4f43]" key={line}>
                      {line}
                    </p>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 pb-8">
        <div className="mx-auto grid max-w-[1120px] items-stretch gap-6 lg:grid-cols-[1.42fr_1fr]">
          <div className={contactPanelClass}>
            <h2 className="text-[22px] font-bold leading-[1.16] text-[#102f16] sm:text-[clamp(22px,1.7vw,27px)]">Get in Touch</h2>
            <span className="mt-2.5 block h-[3px] w-[62px] rounded bg-[#c6923d]" />
            <p className="mt-4 max-w-[560px] text-[14px] font-semibold leading-[1.55] text-[#536156]">
              Have a question or need more information? Send us a message and we&apos;ll get back to you soon.
            </p>

            <form className="mt-5 flex flex-1 flex-col gap-3" aria-label="Contact form" onSubmit={handleContactSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                {contactFormFields.map((field) => (
                  <label key={field.id} className={contactFieldClass} htmlFor={field.id}>
                    <span className={contactLabelClass}>{field.label}</span>
                    <input
                      className={contactInputClass}
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
              <label className={`${contactFieldClass} flex-1`} htmlFor="contact-message">
                <span className={contactLabelClass}>Your Message *</span>
                <textarea
                  className={`${contactInputClass} min-h-[136px] flex-1 resize-y px-3 py-3`}
                  id="contact-message"
                  name="message"
                  rows="5"
                  value={contactForm.message}
                  onChange={updateContactField}
                  required
                />
              </label>
              <button className={contactSubmitClass} type="submit" disabled={contactSubmitState === 'sending'}>
                {contactSubmitState === 'sending' ? 'Sending...' : 'Send Message'}
                <ArrowRight className="ml-2 h-[14px] w-[14px] flex-none stroke-[2.4]" aria-hidden="true" />
              </button>
              {contactSubmitMessage && (
                <p className={contactStatusClass(contactSubmitState === 'error')}>
                  {contactSubmitMessage}
                </p>
              )}
            </form>
          </div>

          <div className={contactPanelClass}>
            <h2 className="text-[22px] font-bold leading-[1.16] text-[#102f16] sm:text-[clamp(22px,1.7vw,27px)]">Request Consultancy</h2>
            <span className="mt-2.5 block h-[3px] w-[62px] rounded bg-[#c6923d]" />
            <p className="mt-4 max-w-[520px] text-[14px] font-semibold leading-[1.55] text-[#536156]">
              Tell us what you need help with and our travel experts will guide you with clear advice.
            </p>

            <form
              className="mt-5 flex flex-1 flex-col gap-3"
              aria-label="Tour consultancy request form"
              onSubmit={handleConsultancySubmit}
            >
              <label className={contactFieldClass} htmlFor="consultancy-name">
                <span className={contactLabelClass}>Full Name *</span>
                <input
                  className={contactInputClass}
                  id="consultancy-name"
                  name="name"
                  type="text"
                  value={consultancyForm.name}
                  onChange={updateConsultancyField}
                  required
                />
              </label>
              <label className={contactFieldClass} htmlFor="consultancy-email">
                <span className={contactLabelClass}>Email Address *</span>
                <input
                  className={contactInputClass}
                  id="consultancy-email"
                  name="email"
                  type="email"
                  value={consultancyForm.email}
                  onChange={updateConsultancyField}
                  required
                />
              </label>
              <label className={contactFieldClass} htmlFor="consultancy-phone">
                <span className={contactLabelClass}>Phone Number *</span>
                <input
                  className={contactInputClass}
                  id="consultancy-phone"
                  name="phone"
                  type="tel"
                  value={consultancyForm.phone}
                  onChange={updateConsultancyField}
                  required
                />
              </label>
              <label className={contactFieldClass} htmlFor="consultancy-interest">
                <span className={contactLabelClass}>I&apos;m interested in *</span>
                <select
                  className={contactInputClass}
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
              <label className={contactFieldClass} htmlFor="consultancy-message">
                <span className={contactLabelClass}>Tell us more about your plans *</span>
                <textarea
                  className={`${contactInputClass} min-h-[98px] resize-y px-3 py-3`}
                  id="consultancy-message"
                  name="message"
                  rows="4"
                  value={consultancyForm.message}
                  onChange={updateConsultancyField}
                  required
                />
              </label>
              <button className={contactSubmitClass} type="submit" disabled={consultancySubmitState === 'sending'}>
                {consultancySubmitState === 'sending' ? 'Sending...' : 'Request Consultancy'}
                <ArrowRight className="ml-2 h-[14px] w-[14px] flex-none stroke-[2.4]" aria-hidden="true" />
              </button>
              {consultancySubmitMessage && (
                <p className={contactStatusClass(consultancySubmitState === 'error')}>
                  {consultancySubmitMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-[72px]">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start justify-between gap-7 rounded-[8px] border border-[#0b2a12]/8 bg-[#d7e3d8] px-[22px] py-[30px] lg:flex-row lg:items-center lg:px-9">
          <div className="flex items-start gap-5">
            <span className="inline-flex h-14 w-14 flex-none items-center justify-center rounded-full bg-white text-[#0b2a12]">
              <Headphones className="h-[27px] w-[27px] stroke-[1.9]" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-[24px] font-bold leading-[1.18] text-[#102f16] sm:text-[clamp(24px,2.2vw,32px)]">
                Need immediate assistance?
              </h2>
              <p className="mt-2 max-w-[600px] text-[15px] font-bold leading-[1.55] text-[#3f4f43]">
                Chat with our team for quick answers while you plan your journey.
              </p>
            </div>
          </div>
          <a
            className="inline-flex min-h-[46px] w-full flex-none items-center justify-center rounded-[5px] bg-[#0b2a12] px-[22px] text-[14px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#14401d] sm:w-auto"
            href="https://wa.me/250785118003"
          >
            <MessageCircle className="mr-2 h-[14px] w-[14px] flex-none stroke-[2.4]" aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}

const contactPanelClass =
  'flex h-full min-h-[480px] flex-col rounded-[8px] border border-[#0b2a12]/10 bg-white p-6 shadow-[0_18px_48px_rgba(11,42,18,0.08)] sm:p-[clamp(22px,2.1vw,28px)]'
const contactFieldClass = 'grid gap-1.5'
const contactLabelClass = 'text-[12px] font-bold leading-[1.2] text-[#263129]'
const contactInputClass =
  'min-h-9 w-full rounded-[5px] border border-[#0b2a12]/14 bg-[#fbfcfa] px-3 text-[13px] font-semibold leading-[1.45] text-[#263129] transition focus:border-[#c6923d] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#c6923d]/15'
const contactSubmitClass =
  'inline-flex min-h-[38px] w-full items-center justify-center rounded-[5px] bg-[#0b2a12] px-[22px] text-[13px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#14401d] disabled:cursor-wait disabled:opacity-75 disabled:hover:translate-y-0 sm:w-fit'

function contactStatusClass(isError) {
  return `m-0 rounded-md px-3 py-[9px] text-[13px] font-bold ${
    isError ? 'bg-[#fff0ee] text-[#b32318]' : 'bg-[#e8f3eb] text-[#0b2a12]'
  }`
}

export default ContactUs
