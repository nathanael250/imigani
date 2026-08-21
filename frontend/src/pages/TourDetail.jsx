import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  Info,
  LockKeyhole,
  Mail,
  Map,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Star,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createTourInquiry, getFullTourPackage } from '../services/tourService'
import gorillaImage from '../assets/gollira.png'
import volcanoImage from '../assets/young-mountain-gorilla-virunga-national-park-africa-drc-central-africa_191971-22582.avif'
import kigaliImage from '../assets/Destinations/Kigali.jpg'
import nyungweImage from '../assets/Destinations/nyungwe-canopy-walk.jpg'
import akageraImage from '../assets/Destinations/akagera.png'
import bwindiImage from '../assets/Destinations/Uganda/Bwindi Impenetrable Forest.png'
import lakeBunyonyiImage from '../assets/Destinations/Uganda/Lake Bunyonyi.png'
import serengetiImage from '../assets/Destinations/Tanzania/Serengeti National Park.png'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:6003').replace(/\/$/, '')

const fallbackGallery = [gorillaImage, volcanoImage, kigaliImage, nyungweImage]

const sampleTour = {
  badges: ['Private guide', 'Permit support', 'Kigali transfers'],
  bestTime: 'June to September',
  category: 'Wildlife Safaris',
  description:
    "A compact, high-touch journey into Rwanda's volcano country. Begin with a soft Kigali welcome, continue through terraced highlands to Volcanoes National Park, and spend one unforgettable morning tracking a habituated gorilla family with expert ranger guides.",
  destination: 'Volcanoes National Park, Rwanda',
  duration: '3 Days / 2 Nights',
  extras:
    '<ul><li>Gorilla permits are limited and confirmed after availability checks.</li><li>Recommended fitness level: moderate forest walking at altitude.</li><li>Extensions to Lake Kivu or Akagera can be added on request.</li></ul>',
  gallery: fallbackGallery,
  groupSize: '2 - 8 Guests',
  highlights: [
    { title: 'One guided gorilla trekking experience in Volcanoes National Park' },
    { title: 'Private Kigali arrival, transfer, and cultural orientation' },
    { title: "Scenic drive through Rwanda's volcanic highlands" },
  ],
  inclusions:
    '<ul><li>Private 4x4 transport with professional driver-guide</li><li>Two nights in handpicked lodge accommodation</li><li>Daily breakfast, selected meals, and drinking water</li><li>Gorilla permit planning and on-ground assistance</li></ul>',
  exclusions:
    '<ul><li>International flights and visa fees</li><li>Gorilla trekking permit fee unless quoted in final proposal</li><li>Travel insurance, tips, and personal expenses</li><li>Optional activities not listed in the itinerary</li></ul>',
  itinerary: [
    {
      day_number: 1,
      description:
        'Arrive in Kigali for a warm IMIGANI welcome, then take a short orientation through the city before driving north toward the Virunga foothills. Settle into your lodge with views of the volcanoes.',
      title: 'Kigali Welcome & Volcano Country',
    },
    {
      day_number: 2,
      description:
        'After an early briefing, enter the forest with ranger guides for your gorilla trekking experience. The pace is unhurried, respectful, and shaped by the gorilla family location on the day.',
      title: 'Gorilla Trekking in Volcanoes National Park',
    },
    {
      day_number: 3,
      description:
        'Enjoy a relaxed breakfast, optional cultural visit, and a scenic return to Kigali. Continue to the airport or extend the journey toward Lake Kivu.',
      title: 'Highland Morning & Return to Kigali',
    },
  ],
  price: '$1,250',
  priceNote: 'per person sharing',
  rating: '4.9',
  reviewCount: '48 Reviews',
  title: '3 Days Gorilla Trekking Adventure',
}

const relatedTours = [
  {
    image: akageraImage,
    meta: 'Rwanda',
    path: '/tours/5-days-rwanda-highlights-tour',
    title: '5 Days Rwanda Highlights Tour',
  },
  {
    image: bwindiImage,
    meta: 'Uganda',
    path: '/tours/3-days-gorilla-trekking-extension',
    title: '3 Days Gorilla Trekking Extension',
  },
  {
    image: lakeBunyonyiImage,
    meta: 'Uganda',
    path: '/tours/4-days-lake-bunyonyi-escape',
    title: '4 Days Lake Bunyonyi Escape',
  },
  {
    image: serengetiImage,
    meta: 'Tanzania',
    path: '/tours/8-days-great-migration-safari',
    title: '8 Days Great Migration Safari',
  },
]

function TourDetail() {
  const { id } = useParams()
  const [apiTour, setApiTour] = useState(null)
  const [status, setStatus] = useState(/^\d+$/.test(id || '') ? 'loading' : 'static')

  useEffect(() => {
    let isMounted = true

    async function loadTour() {
      if (!/^\d+$/.test(id || '')) {
        setStatus('static')
        setApiTour(null)
        return
      }

      setStatus('loading')

      try {
        const tour = await getFullTourPackage(id)

        if (isMounted) {
          setApiTour(tour)
          setStatus('ready')
        }
      } catch {
        if (isMounted) {
          setApiTour(null)
          setStatus('static')
        }
      }
    }

    loadTour()

    return () => {
      isMounted = false
    }
  }, [id])

  const tour = useMemo(() => (apiTour ? mapApiTour(apiTour) : sampleTour), [apiTour])
  const isLoading = status === 'loading'
  const gallery = tour.gallery.length > 0 ? tour.gallery : fallbackGallery
  const routeMapQuery = tour.destination || tour.title || 'Rwanda safari destination'
  const encodedRouteMapQuery = encodeURIComponent(routeMapQuery)
  const routeMapEmbedUrl = `https://www.google.com/maps?q=${encodedRouteMapQuery}&output=embed`
  const routeMapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodedRouteMapQuery}`

  return (
    <section className="tour-detail-page">
      <div className="tour-detail-shell">
        <nav className="tour-detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight aria-hidden="true" />
          <Link to="/tours">Tours & Safaris</Link>
          <ChevronRight aria-hidden="true" />
          <span>{tour.category || 'Wildlife Safaris'}</span>
          <ChevronRight aria-hidden="true" />
          <strong>{tour.title}</strong>
        </nav>

        {isLoading ? (
          <div className="tour-detail-loading" role="status">
            <span />
            Preparing your safari details...
          </div>
        ) : null}

        <header className="tour-detail-heading">
          <div>
            <p className="tour-detail-kicker">{tour.category || 'Wildlife Safaris'}</p>
            <h1>{tour.title}</h1>
            <div className="tour-detail-rating">
              <span aria-label={`${tour.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} aria-hidden="true" />
                ))}
              </span>
              <strong>
                {tour.rating} ({tour.reviewCount})
              </strong>
              <em>
                <MapPin aria-hidden="true" />
                {tour.destination}
              </em>
            </div>
          </div>
        </header>

        <div className="tour-detail-top">
          <div className="grid min-w-0 gap-3">
            <Gallery gallery={gallery} title={tour.title} />
            <BookingSummary tour={tour} />
          </div>
          <BookingCard tour={tour} />
        </div>

        <nav className="tour-detail-tabs" aria-label="Tour detail sections">
          {['Overview', 'Itinerary', 'Inclusions', 'Exclusions', 'Extra Info', 'Map'].map((tab) => (
            <a href={`#${tab.toLowerCase().replace(/\s+/g, '-')}`} key={tab}>
              {tab}
            </a>
          ))}
        </nav>

        <div className="tour-detail-content">
          <main>
            <section className="tour-detail-section" id="overview">
              <SectionIntro icon={Compass} label="Overview" title="A carefully paced encounter with Rwanda's wild heart" />
              <p className="tour-detail-description">{plainText(tour.description, 900)}</p>
              <div className="tour-highlight-grid">
                {tour.highlights.map((highlight, index) => (
                  <article key={`${typeof highlight === 'string' ? highlight : highlight.title}-${index}`}>
                    <p>{typeof highlight === 'string' ? highlight : highlight.title}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="tour-detail-section" id="itinerary">
              <h2 className="tour-itinerary-title">Itinerary</h2>
              <div className="tour-itinerary-timeline">
                {tour.itinerary.map((day, index) => (
                  <article className="tour-itinerary-card" key={`${day.day_number}-${day.title}`}>
                    <span className="tour-itinerary-dot" aria-hidden="true" />
                    <span className="tour-itinerary-day">Day {day.day_number || index + 1}</span>
                    <div className="tour-itinerary-copy">
                      <h3>{day.title || `Day ${index + 1}`}</h3>
                      <div
                        className="tour-rich-text"
                        dangerouslySetInnerHTML={{ __html: richTextOrParagraph(day.description) }}
                      />
                    </div>
                    <ChevronDown className="tour-itinerary-chevron" aria-hidden="true" />
                  </article>
                ))}
              </div>
            </section>

            <section className="tour-info-strip" id="extra-info">
              <SectionIntro icon={Info} label="Extra Information" title="Useful details before you travel" />
              <div className="tour-rich-text" dangerouslySetInnerHTML={{ __html: richTextOrParagraph(tour.extras) }} />
            </section>

            <section className="tour-map-panel" id="map">
              <SectionIntro icon={Map} label="Route Map" title={routeMapQuery} />
              <div className="tour-map-frame">
                <iframe
                  title={`${routeMapQuery} map`}
                  src={routeMapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <a className="tour-map-open-link" href={routeMapExternalUrl} target="_blank" rel="noreferrer">
                  <MapPin aria-hidden="true" />
                  Open in Google Maps
                </a>
              </div>
            </section>
          </main>

          <aside className="tour-side-panels">
            <RichPanel id="inclusions" icon={Check} title="Included" content={tour.inclusions} />
            <RichPanel id="exclusions" icon={X} title="Excluded" content={tour.exclusions} />
          </aside>
        </div>

        

        <section className="tour-related">
          <div className="tour-related-head">
            <SectionIntro icon={Sparkles} label="You May Also Like" title="More journeys with the same spirit" />
            <Link to="/tours">
              View all tours <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="tour-related-row">
            {relatedTours.map((item) => (
              <Link className="tour-related-card" to={item.path || `/tours/${slugify(item.title)}`} key={item.title}>
                <img src={item.image} alt="" />
                <span>{item.meta}</span>
                <strong>{item.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

function Gallery({ gallery, title }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setLightboxOpen] = useState(false)
  const safeActiveIndex = Math.min(activeIndex, Math.max(gallery.length - 1, 0))
  const activeImage = gallery[safeActiveIndex] || gallery[0]
  const thumbs = [gallery[1] || gallery[0], gallery[2] || gallery[0], gallery[3] || gallery[0]]

  return (
    <section className="tour-gallery" aria-label={`${title} photos`}>
      <button className="tour-gallery-cover" type="button" onClick={() => setLightboxOpen(true)}>
        <img src={activeImage} alt={title} />
        <span>
          <Camera aria-hidden="true" />
          Open Gallery
        </span>
      </button>
      <div className="tour-gallery-thumbs">
        {thumbs.map((image, index) => (
          <button
            className={`tour-gallery-thumb ${activeImage === image ? 'is-active' : ''}`}
            type="button"
            key={`${image}-${index}`}
            onClick={() => {
              setActiveIndex(Math.min(index + 1, gallery.length - 1))
              if (index === 2) {
                setLightboxOpen(true)
              }
            }}
          >
            <img src={image} alt="" />
            {index === 2 ? (
              <span>
                <Camera aria-hidden="true" />
                View All Photos
              </span>
            ) : null}
          </button>
        ))}
      </div>
      {isLightboxOpen ? (
        <div className="tour-lightbox" role="dialog" aria-modal="true" aria-label={`${title} photo gallery`}>
          <button className="tour-lightbox-close" type="button" aria-label="Close gallery" onClick={() => setLightboxOpen(false)}>
            <X aria-hidden="true" />
          </button>
          <img src={activeImage} alt={title} />
          <div className="tour-lightbox-strip">
            {gallery.map((image, index) => (
              <button
                className={index === safeActiveIndex ? 'is-active' : ''}
                type="button"
                key={`${image}-lightbox-${index}`}
                aria-label={`Show photo ${index + 1}`}
                onClick={() => setActiveIndex(index)}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function BookingCard({ tour }) {
  const [formData, setFormData] = useState({
    arrivalDate: '',
    email: '',
    message: '',
    name: '',
    phone: '',
    tickets: '',
  })
  const [submitState, setSubmitState] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitState('sending')
    setSubmitMessage('')

    const inquiry = [
      `Tour: ${tour.title}`,
      `Tickets: ${formData.tickets || 'Not specified'}`,
      `Arrival Date: ${formData.arrivalDate || 'Not specified'}`,
      '',
      formData.message || 'No additional message provided.',
    ].join('\n')

    try {
      await createTourInquiry({
        email: formData.email,
        inquiry,
        name: formData.name,
        phone: formData.phone,
        status: 'new',
      })
      setSubmitState('sent')
      setSubmitMessage('Your booking message has been sent.')
      setFormData({
        arrivalDate: '',
        email: '',
        message: '',
        name: '',
        phone: '',
        tickets: '',
      })
    } catch (error) {
      setSubmitState('error')
      setSubmitMessage(error.message || 'We could not send your booking message. Please try again.')
    }
  }

  return (
    <aside
      className="sticky top-6 rounded-lg border border-[var(--sage)] bg-white p-6 shadow-[0_24px_56px_rgb(11_42_18_/_0.12)]"
      aria-label="Booking message form"
    >
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <div className="mb-2 grid gap-2">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--sage)] text-[var(--deep-green)]">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <h2 className="m-0 text-[18px] font-black leading-tight text-[var(--deep-green)]">Send an Inquiry</h2>
          </div>
          <p className="m-0 text-[12px] font-bold leading-relaxed text-[#5f6b63]">
            Send us a message and our team will get back to you as soon as possible.
          </p>
        </div>
        <label className="relative block">
          <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#68756c]" aria-hidden="true" />
          <input
            className="min-h-12 w-full rounded-md border border-[var(--sage)] bg-white py-3 pl-11 pr-4 text-[13px] font-bold text-[var(--deep-green)] outline-none placeholder:text-[#8f9390] focus:border-[var(--gold)] focus:ring-4 focus:ring-[rgb(198_146_61_/_0.16)]"
            name="name"
            type="text"
            value={formData.name}
            onChange={updateField}
            placeholder="Your Name"
            required
          />
        </label>
        <label className="relative block">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#68756c]" aria-hidden="true" />
          <input
            className="min-h-12 w-full rounded-md border border-[var(--sage)] bg-white py-3 pl-11 pr-4 text-[13px] font-bold text-[var(--deep-green)] outline-none placeholder:text-[#8f9390] focus:border-[var(--gold)] focus:ring-4 focus:ring-[rgb(198_146_61_/_0.16)]"
            name="email"
            type="email"
            value={formData.email}
            onChange={updateField}
            placeholder="Your Email"
            required
          />
        </label>
        <label className="relative block">
          <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#68756c]" aria-hidden="true" />
          <input
            className="min-h-12 w-full rounded-md border border-[var(--sage)] bg-white py-3 pl-11 pr-4 text-[13px] font-bold text-[var(--deep-green)] outline-none placeholder:text-[#8f9390] focus:border-[var(--gold)] focus:ring-4 focus:ring-[rgb(198_146_61_/_0.16)]"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={updateField}
            placeholder="Your Phone Number"
          />
        </label>
        <label className="relative block">
          <Users className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#68756c]" aria-hidden="true" />
          <select
            className="min-h-12 w-full appearance-none rounded-md border border-[var(--sage)] bg-white py-3 pl-11 pr-10 text-[13px] font-bold text-[var(--deep-green)] outline-none focus:border-[var(--gold)] focus:ring-4 focus:ring-[rgb(198_146_61_/_0.16)]"
            name="tickets"
            value={formData.tickets}
            onChange={updateField}
          >
            <option value="">Travelers</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
              <option value={count} key={count}>
                {count}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#68756c]" aria-hidden="true" />
        </label>
        <label className="relative block">
          <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#68756c]" aria-hidden="true" />
          <input
            className="min-h-12 w-full rounded-md border border-[var(--sage)] bg-white py-3 pl-11 pr-4 text-[13px] font-bold text-[var(--deep-green)] outline-none placeholder:text-[#8f9390] focus:border-[var(--gold)] focus:ring-4 focus:ring-[rgb(198_146_61_/_0.16)]"
            name="arrivalDate"
            type="text"
            value={formData.arrivalDate}
            onChange={updateField}
            placeholder="Arrival Date (Optional)"
          />
        </label>
        <label className="block">
          <textarea
            className="min-h-[110px] w-full resize-y rounded-md border border-[var(--sage)] bg-white px-4 py-3 text-[13px] font-bold text-[var(--deep-green)] outline-none placeholder:text-[#8f9390] focus:border-[var(--gold)] focus:ring-4 focus:ring-[rgb(198_146_61_/_0.16)]"
            name="message"
            value={formData.message}
            onChange={updateField}
            placeholder="Tell us about your preferred dates, interests or any special requests..."
            rows="4"
          />
        </label>
        <button
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--deep-green)] px-5 text-[13px] font-black text-white transition hover:-translate-y-0.5 hover:bg-[var(--forest)] disabled:cursor-wait disabled:opacity-75"
          type="submit"
          disabled={submitState === 'sending'}
        >
          {submitState === 'sending' ? 'Sending...' : 'Send'}
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
        {submitMessage ? (
          <p
            className={`m-0 rounded-md px-3 py-2 text-xs font-extrabold leading-snug ${
              submitState === 'error' ? 'bg-[#fff6f4] text-[#9b2f22]' : 'bg-[#edf6ee] text-[var(--deep-green)]'
            }`}
          >
            {submitMessage}
          </p>
        ) : null}
        <p className="m-0 mt-2 flex items-start gap-2 text-[11px] font-bold leading-relaxed text-[#5f6b63]">
          <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--deep-green)]" aria-hidden="true" />
          We respect your privacy. Your information will never be shared.
        </p>
      </form>
    </aside>
  )
}

function BookingSummary({ tour }) {
  const facts = getTourFacts(tour)

  return (
    <section
      className="rounded-lg border border-[var(--sage)] bg-white px-4 py-3 shadow-[0_10px_24px_rgb(11_42_18_/_0.05)]"
      aria-label="Tour booking summary"
    >
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="shrink-0 md:min-w-[150px]">
          <p className="m-0 text-[9px] font-bold uppercase leading-tight text-[#68756c]">From</p>
          <strong className="mt-0.5 block text-[24px] font-bold leading-none text-[var(--deep-green)]">{tour.price}</strong>
          <span className="mt-0.5 block text-[10px] font-bold leading-snug text-[var(--button-gold)]">
            {tour.priceNote || 'per person sharing'}
          </span>
        </div>
        <dl className="m-0 grid flex-1 gap-x-5 gap-y-2 sm:grid-cols-3">
          {facts.map(({ icon: Icon, label, value }) => (
            <div className="min-w-0 border-l border-[var(--sage)] pl-3" key={label}>
              <dt className="flex items-center gap-1.5 text-[9px] font-bold uppercase leading-tight text-[#68756c]">
                <Icon className="h-3 w-3 shrink-0 text-[var(--gold)]" aria-hidden="true" />
                {label}
              </dt>
              <dd className="m-0 mt-0.5 text-[12px] font-bold leading-snug text-[var(--deep-green)]">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function getTourFacts(tour) {
  return [
    { icon: Clock3, label: 'Duration', value: tour.duration },
    { icon: MapPin, label: 'Destination', value: tour.destination },
    { icon: CalendarDays, label: 'Best Time', value: tour.bestTime },
  ]
}

function SectionIntro({ icon: Icon, label, title }) {
  return (
    <div className="tour-section-intro">
      <span>
        <Icon aria-hidden="true" />
        {label}
      </span>
      <h2>{title}</h2>
    </div>
  )
}

function RichPanel({ id, icon: Icon, title, content }) {
  return (
    <section className="tour-rich-panel" id={id}>
      <h2>
        <Icon aria-hidden="true" />
        {title}
      </h2>
      <div className="tour-rich-text" dangerouslySetInnerHTML={{ __html: richTextOrParagraph(content) }} />
    </section>
  )
}

function mapApiTour(data) {
  const basic = data.basic || data.package || {}
  const destinations = Array.isArray(data.destinations) ? data.destinations : []
  const destination = destinations.map((item) => item.name).filter(Boolean).join(', ') || 'East Africa'
  const category = basic.category_name || data.package?.category_name || 'Wildlife Safaris'
  const gallery = [
    data.cover_image_url,
    ...(Array.isArray(data.media) ? data.media.filter((item) => item.media_type !== 'video').map((item) => item.url) : []),
  ]
    .map(mediaPreviewUrl)
    .filter(Boolean)
  const price = getLowestPrice(data.prices)
  const durationDays = Number(basic.duration_days || 0)
  const durationNights = Number(basic.duration_nights || Math.max(durationDays - 1, 0))

  return {
    badges: ['Private planning', 'Local guide team', 'Flexible extensions'],
    bestTime: 'Year-round',
    category,
    description: basic.description || sampleTour.description,
    destination,
    duration: durationDays ? `${durationDays} Days / ${durationNights} Nights` : sampleTour.duration,
    exclusions: data.exclusions || sampleTour.exclusions,
    extras: data.extras || sampleTour.extras,
    gallery,
    groupSize: 'Custom group',
    highlights: Array.isArray(data.highlights) && data.highlights.length > 0 ? data.highlights : sampleTour.highlights,
    inclusions: data.inclusions || sampleTour.inclusions,
    itinerary:
      Array.isArray(data.itinerary_days) && data.itinerary_days.length > 0 ? data.itinerary_days : sampleTour.itinerary,
    price: price.label,
    priceNote: price.note,
    rating: '4.9',
    reviewCount: '48 Reviews',
    title: basic.name || data.package?.name || sampleTour.title,
  }
}

function getLowestPrice(prices = []) {
  const validPrices = prices
    .map((price) => ({ ...price, price: Number(price.price || 0) }))
    .filter((price) => price.price > 0)
    .sort((first, second) => first.price - second.price)

  if (validPrices.length === 0) {
    return { label: 'On request', note: 'tailored quotation' }
  }

  const first = validPrices[0]
  const symbol = first.currency_symbol || '$'

  return {
    label: `${symbol}${first.price.toLocaleString()}`,
    note: first.price_note || 'per person sharing',
  }
}

function mediaPreviewUrl(url) {
  if (!url || url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }

  if (url.startsWith('/uploads')) {
    return `${apiBaseUrl}${url}`
  }

  return url
}

function richTextOrParagraph(value) {
  const content = String(value || '').trim()

  if (!content) {
    return '<p>Details are confirmed during proposal planning.</p>'
  }

  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content
  }

  return content
    .split(/\n+/)
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')
}

function plainText(value, maxLength = 180) {
  const text = String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength - 1).trim()}...`
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function slugify(value) {
  return String(value || 'tour')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default TourDetail
