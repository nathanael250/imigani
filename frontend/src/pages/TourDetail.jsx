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
const uploadBaseUrl = getUploadBaseUrl()

const fallbackGallery = [gorillaImage, volcanoImage, kigaliImage, nyungweImage]
const tourPanelClass =
  'scroll-mt-[90px] rounded-[8px] border border-[#0b2a12]/11 bg-white p-[22px] shadow-[0_16px_36px_rgba(11,42,18,0.07)] sm:p-7'
const richTextClass =
  'text-[13px] font-bold leading-[1.75] text-[#455349] [&_li::marker]:text-[#c6923d] [&_ol]:grid [&_ol]:gap-[9px] [&_ol]:pl-[18px] [&_p+_p]:mt-2.5 [&_p+_ul]:mt-2.5 [&_ul+_p]:mt-2.5 [&_ul]:grid [&_ul]:gap-[9px] [&_ul]:pl-[18px]'

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
    <section className="bg-[linear-gradient(180deg,#f7faf5_0,#ffffff_360px),#ffffff] px-4 pb-16 pt-[26px] sm:px-5 sm:pb-[82px] sm:pt-[34px]">
      <div className="mx-auto w-full max-w-[1120px]">
        <nav className="flex flex-wrap items-center gap-[7px] text-[12px] font-bold leading-[1.4] text-[#68756c]" aria-label="Breadcrumb">
          <Link className="text-[#0b2a12] transition hover:text-[#c6923d]" to="/">
            Home
          </Link>
          <ChevronRight className="h-[13px] w-[13px] text-[#0b2a12]/38 stroke-[2.5]" aria-hidden="true" />
          <Link className="text-[#0b2a12] transition hover:text-[#c6923d]" to="/tours">
            Tours & Safaris
          </Link>
          <ChevronRight className="h-[13px] w-[13px] text-[#0b2a12]/38 stroke-[2.5]" aria-hidden="true" />
          <span>{tour.category || 'Wildlife Safaris'}</span>
          <ChevronRight className="h-[13px] w-[13px] text-[#0b2a12]/38 stroke-[2.5]" aria-hidden="true" />
          <strong className="text-[#2f3f34]">{tour.title}</strong>
        </nav>

        {isLoading ? (
          <div
            className="mt-[18px] inline-flex items-center gap-2.5 rounded-[7px] border border-[#c6923d]/24 bg-[#fffaf0]/90 px-[14px] py-3 text-[12px] font-bold leading-[1.5] text-[#6b4b20]"
            role="status"
          >
            <span className="h-[14px] w-[14px] animate-[tourSpin_780ms_linear_infinite] rounded-full border-2 border-[#c6923d]/30 border-t-[#c6923d]" />
            Preparing your safari details...
          </div>
        ) : null}

        <header className="mt-7 flex items-end justify-between gap-6">
          <div>
            <p className="text-[12px] font-bold uppercase leading-[1.2] text-[#855113]">{tour.category || 'Wildlife Safaris'}</p>
            <h1 className="mt-2.5 max-w-[800px] text-[34px] font-bold leading-[1.08] text-[#0b2a12] sm:text-[clamp(34px,5vw,58px)]">
              {tour.title}
            </h1>
            <div className="mt-[17px] flex flex-wrap items-center gap-x-4 gap-y-3 text-[13px] font-bold leading-[1.4] text-[#56635b]">
              <span className="inline-flex gap-[3px] text-[#d3a14e]" aria-label={`${tour.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star className="h-[15px] w-[15px] fill-current stroke-[1.8]" key={star} aria-hidden="true" />
                ))}
              </span>
              <strong>
                {tour.rating} ({tour.reviewCount})
              </strong>
              <em className="inline-flex items-center gap-1.5 text-[#314238] not-italic">
                <MapPin className="h-[15px] w-[15px] text-[#855113] stroke-[1.8]" aria-hidden="true" />
                {tour.destination}
              </em>
            </div>
          </div>
        </header>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_318px]">
          <div className="grid min-w-0 gap-3">
            <Gallery gallery={gallery} title={tour.title} />
            <BookingSummary tour={tour} />
          </div>
          <BookingCard tour={tour} />
        </div>

        <nav className="sticky top-0 z-[5] -mx-4 mt-7 grid grid-cols-2 gap-2 overflow-visible border-y border-[#0b2a12]/10 bg-white/95 p-2 shadow-[0_18px_38px_rgba(11,42,18,0.08)] sm:mx-0 sm:flex sm:overflow-x-auto sm:rounded-[8px] sm:border" aria-label="Tour detail sections">
          {['Overview', 'Itinerary', 'Inclusions', 'Exclusions', 'Extra Info', 'Map'].map((tab) => (
            <a
              className="inline-flex min-h-9 flex-none items-center justify-center rounded-[5px] px-[13px] text-[12px] font-bold text-[#3f4d43] transition hover:bg-[#d7e3d8]/70 hover:text-[#0b2a12]"
              href={`#${tab.toLowerCase().replace(/\s+/g, '-')}`}
              key={tab}
            >
              {tab}
            </a>
          ))}
        </nav>

        <div className="mt-[34px] grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_318px]">
          <main className="grid gap-6">
            <section className={tourPanelClass} id="overview">
              <SectionIntro icon={Compass} label="Overview" title="A carefully paced encounter with Rwanda's wild heart" />
              <p className="mt-[18px] text-[15px] font-bold leading-[1.82] text-[#405046]">{plainText(tour.description, 900)}</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {tour.highlights.map((highlight, index) => (
                  <article
                    className="inline-flex max-w-full items-center rounded-[5px] border border-[#c6923d]/24 bg-[#fffaf0] px-[11px] py-[9px]"
                    key={`${typeof highlight === 'string' ? highlight : highlight.title}-${index}`}
                  >
                    <p className="m-0 break-words text-[12px] font-bold leading-[1.35] text-[#5f421a]">
                      {typeof highlight === 'string' ? highlight : highlight.title}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className={tourPanelClass} id="itinerary">
              <h2 className="m-0 text-[clamp(26px,3vw,34px)] font-bold leading-[1.16] text-[#0b2a12]">Itinerary</h2>
              <div className="relative mt-[18px] grid overflow-hidden bg-white before:absolute before:bottom-[calc(18px+11px+4.5px)] before:left-[3.5px] before:top-[calc(18px+11px+4.5px)] before:z-0 before:w-0.5 before:bg-[#0b2a12]/28 sm:before:bottom-[calc(22px+11px+4.5px)] sm:before:top-[calc(22px+11px+4.5px)]">
                {tour.itinerary.map((day, index) => (
                  <article
                    className="relative z-[1] grid grid-cols-[9px_minmax(0,1fr)_20px] gap-x-[13px] gap-y-2.5 py-[18px] before:absolute before:left-[22px] before:right-0 before:top-0 before:h-px before:bg-[#0b2a12]/12 first:before:hidden sm:grid-cols-[9px_auto_minmax(0,1fr)_24px] sm:gap-x-[18px] sm:gap-y-0 sm:py-[22px]"
                    key={`${day.day_number}-${day.title}`}
                  >
                    <span className="relative z-[2] col-start-1 row-start-1 mt-[11px] block h-[9px] w-[9px] rounded-full bg-[#0b2a12] shadow-[0_0_0_4px_#fff]" aria-hidden="true" />
                    <span className="col-start-2 row-start-1 inline-flex h-9 w-fit min-w-[64px] items-center justify-center self-start rounded-[4px] bg-[#0b2a12] px-3 text-[12px] font-bold leading-none text-white shadow-[0_2px_5px_rgba(11,42,18,0.24)]">
                      Day {day.day_number || index + 1}
                    </span>
                    <div className="col-start-2 col-end-[-1] row-start-2 min-w-0 sm:col-start-3 sm:col-end-4 sm:row-start-1">
                      <h3 className="text-[19px] font-bold leading-[1.28] text-[#0b2a12]">{day.title || `Day ${index + 1}`}</h3>
                      <div
                        className={`${richTextClass} mt-[7px]`}
                        dangerouslySetInnerHTML={{ __html: richTextOrParagraph(day.description) }}
                      />
                    </div>
                    <ChevronDown className="col-start-3 row-start-1 mt-1.5 h-[19px] w-[19px] justify-self-end text-[#0b2a12]/58 stroke-[2.3] sm:col-start-4" aria-hidden="true" />
                  </article>
                ))}
              </div>
            </section>

            <section
              className="scroll-mt-[90px] rounded-[8px] border border-white/10 bg-[#0b2a12] p-[22px] text-white shadow-[0_18px_42px_rgba(11,42,18,0.16)] sm:p-7"
              id="extra-info"
            >
              <SectionIntro icon={Info} label="Extra Information" title="Useful details before you travel" light />
              <div
                className={`${richTextClass} mt-[18px] text-white/90 [&_li]:text-white/90 [&_li::marker]:text-[#d3a14e] [&_p]:text-white/90`}
                dangerouslySetInnerHTML={{ __html: richTextOrParagraph(tour.extras) }}
              />
            </section>

            <section className={`${tourPanelClass} grid gap-[18px]`} id="map">
              <SectionIntro icon={Map} label="Route Map" title={routeMapQuery} />
              <div className="relative min-h-[360px] overflow-hidden rounded-[8px] border border-[#0b2a12]/12 bg-[#d7e3d8]">
                <iframe
                  className="absolute inset-0 h-full w-full border-0"
                  title={`${routeMapQuery} map`}
                  src={routeMapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <a
                  className="absolute bottom-3.5 right-3.5 z-[2] inline-flex min-h-[38px] items-center justify-center gap-[7px] rounded-[5px] border border-white/30 bg-[#0b2a12] px-[13px] text-[12px] font-bold leading-[1.2] text-white shadow-[0_12px_22px_rgba(11,42,18,0.2)] transition hover:-translate-y-px hover:bg-[#c6923d]"
                  href={routeMapExternalUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin className="h-[15px] w-[15px] flex-none stroke-[2.3]" aria-hidden="true" />
                  Open in Google Maps
                </a>
              </div>
            </section>
          </main>

          <aside className="relative top-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:sticky lg:top-[72px] lg:grid-cols-1">
            <RichPanel id="inclusions" icon={Check} title="Included" content={tour.inclusions} />
            <RichPanel id="exclusions" icon={X} title="Excluded" content={tour.exclusions} />
          </aside>
        </div>

        

        <section className="mt-[34px]">
          <div className="flex flex-col items-start justify-between gap-[18px] sm:flex-row sm:items-end">
            <SectionIntro icon={Sparkles} label="You May Also Like" title="More journeys with the same spirit" />
            <Link
              className="inline-flex flex-none items-center gap-[7px] text-[13px] font-bold text-[#855113] transition hover:translate-x-[3px] hover:text-[#0b2a12]"
              to="/tours"
            >
              View all tours <ArrowRight className="h-[15px] w-[15px]" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 min-[861px]:grid-cols-4 sm:grid-cols-2">
            {relatedTours.map((item) => (
              <Link
                className="group relative block min-h-[210px] overflow-hidden rounded-[8px] bg-[#d7e3d8] text-white shadow-[0_16px_34px_rgba(11,42,18,0.12)] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(7,24,11,0.12),rgba(7,24,11,0.76))]"
                to={item.path || `/tours/${slugify(item.title)}`}
                key={item.title}
              >
                <SafeImage
                  className="h-full min-h-[210px] w-full object-cover transition duration-500 group-hover:scale-[1.045]"
                  src={item.image}
                  alt=""
                  fallback={gorillaImage}
                />
                <span className="absolute bottom-[58px] left-4 right-4 z-[1] text-[11px] font-bold uppercase text-[#d3a14e]">{item.meta}</span>
                <strong className="absolute bottom-[18px] left-4 right-4 z-[1] text-[17px] font-bold leading-[1.25]">{item.title}</strong>
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
    <section
      className="grid min-w-0 gap-3 overflow-hidden"
      aria-label={`${title} photos`}
    >
      <button
        className="relative aspect-[4/3] min-h-[280px] w-full cursor-pointer overflow-hidden rounded-[8px] border-0 bg-[#d7e3d8] shadow-[0_18px_42px_rgba(11,42,18,0.12)] sm:aspect-[16/9] sm:min-h-[360px] lg:aspect-[16/10] lg:max-h-[468px]"
        type="button"
        onClick={() => setLightboxOpen(true)}
      >
        <SafeImage
          className="h-full w-full object-cover"
          src={activeImage}
          alt={title}
          fallback={gorillaImage}
        />
        <span className="absolute bottom-[18px] right-[18px] inline-flex items-center gap-2 rounded-[5px] bg-white/95 px-3 py-2.5 text-[12px] font-bold leading-none text-[#0b2a12] shadow-[0_12px_24px_rgba(7,24,11,0.18)]">
          <Camera className="h-4 w-4 text-[#855113] stroke-[2.2]" aria-hidden="true" />
          Open Gallery
        </span>
      </button>
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {thumbs.map((image, index) => (
          <button
            className={`relative h-[72px] min-h-0 cursor-pointer overflow-hidden rounded-[8px] border-0 bg-[#d7e3d8] shadow-[0_10px_24px_rgba(11,42,18,0.09)] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent,rgba(7,24,11,0.42))] after:opacity-0 after:transition hover:after:opacity-100 sm:h-[92px] lg:h-[84px] ${
              activeImage === image ? 'outline outline-[3px] outline-offset-[-3px] outline-[#d3a14e]' : ''
            }`}
            type="button"
            key={`${image}-${index}`}
            onClick={() => {
              setActiveIndex(Math.min(index + 1, gallery.length - 1))
              if (index === 2) {
                setLightboxOpen(true)
              }
            }}
          >
            <SafeImage className="h-full w-full object-cover" src={image} alt="" fallback={gorillaImage} />
            {index === 2 ? (
              <span className="absolute inset-auto bottom-2 left-2 right-2 z-[1] inline-flex items-center justify-center gap-1 rounded-[5px] bg-white/92 px-2 py-1.5 text-[10px] font-bold leading-[1.1] text-[#0b2a12] sm:text-[11px]">
                <Camera className="h-3.5 w-3.5 text-[#855113] stroke-[2.2]" aria-hidden="true" />
                <span className="hidden sm:inline">View All Photos</span>
                <span className="sm:hidden">All Photos</span>
              </span>
            ) : null}
          </button>
        ))}
      </div>
      {isLightboxOpen ? (
        <div
          className="fixed inset-0 z-[80] grid place-items-center gap-[18px] bg-[#07180b]/90 px-5 py-[30px]"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
        >
          <button
            className="absolute right-[18px] top-[18px] inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            type="button"
            aria-label="Close gallery"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-[22px] w-[22px] stroke-[2.5]" aria-hidden="true" />
          </button>
          <SafeImage
            className="max-h-[72vh] w-[min(980px,100%)] rounded-[8px] object-contain shadow-[0_28px_70px_rgba(0,0,0,0.34)]"
            src={activeImage}
            alt={title}
            fallback={gorillaImage}
          />
          <div className="flex max-w-[min(980px,100%)] gap-2.5 overflow-x-auto pb-1">
            {gallery.map((image, index) => (
              <button
                className={`h-[68px] w-24 flex-none overflow-hidden rounded-md border-2 bg-[#d7e3d8] ${
                  index === safeActiveIndex ? 'border-[#d3a14e]' : 'border-transparent'
                }`}
                type="button"
                key={`${image}-lightbox-${index}`}
                aria-label={`Show photo ${index + 1}`}
                onClick={() => setActiveIndex(index)}
              >
                <SafeImage className="h-full w-full object-cover" src={image} alt="" fallback={gorillaImage} />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function SafeImage({ alt, className, fallback = gorillaImage, src }) {
  return (
    <img
      className={className}
      src={src || fallback}
      alt={alt}
      loading="lazy"
      onError={(event) => {
        if (event.currentTarget.src !== fallback) {
          event.currentTarget.src = fallback
        }
      }}
    />
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

function SectionIntro({ icon: Icon, label, title, light = false }) {
  return (
    <div>
      <span className="inline-flex items-center gap-[7px] text-[11px] font-bold uppercase leading-[1.2] text-[#c6923d]">
        <Icon className="h-[15px] w-[15px] stroke-[2.3]" aria-hidden="true" />
        {label}
      </span>
      <h2
        className={`mt-2 max-w-[700px] text-[clamp(24px,3vw,34px)] font-bold leading-[1.18] ${
          light ? 'text-white' : 'text-[#0b2a12]'
        }`}
      >
        {title}
      </h2>
    </div>
  )
}

function RichPanel({ id, icon: Icon, title, content }) {
  return (
    <section className="scroll-mt-[90px] rounded-[8px] border border-[#0b2a12]/11 bg-white px-[22px] py-[23px] shadow-[0_16px_36px_rgba(11,42,18,0.07)]" id={id}>
      <h2 className="inline-flex items-center gap-2 text-[20px] font-bold leading-[1.25] text-[#0b2a12]">
        <Icon className="h-[18px] w-[18px] text-[#c6923d] stroke-[2.5]" aria-hidden="true" />
        {title}
      </h2>
      <div className={`${richTextClass} mt-4`} dangerouslySetInnerHTML={{ __html: richTextOrParagraph(content) }} />
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
  if (!url || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }

  if (/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/uploads/i.test(url)) {
    return `${uploadBaseUrl}${new URL(url).pathname}`
  }

  if (url.startsWith('http')) {
    return url
  }

  if (url.startsWith('/uploads')) {
    return `${uploadBaseUrl}${url}`
  }

  return url
}

function getUploadBaseUrl() {
  if (typeof window === 'undefined') {
    return apiBaseUrl
  }

  const apiHost = new URL(apiBaseUrl, window.location.origin).hostname
  const pageHost = window.location.hostname
  const apiIsLocal = apiHost === '127.0.0.1' || apiHost === 'localhost'
  const pageIsLocal = pageHost === '127.0.0.1' || pageHost === 'localhost'

  return apiIsLocal && !pageIsLocal ? '' : apiBaseUrl
}

function richTextOrParagraph(value) {
  const content = String(value || '').trim()
  const visibleText = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!visibleText) {
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
