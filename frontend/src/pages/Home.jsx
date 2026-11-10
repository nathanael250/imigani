import {
  ArrowLeft,
  ArrowRight,
  Binoculars,
  BookOpenText,
  Compass,
  GraduationCap,
  Mountain,
  Route as RouteIcon,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DestinationCard from '../components/DestinationCard.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import heroGorilla from '../assets/gollira.png'
import attaLogo from '../assets/affiliations/atta logo.png'
import rttaLogo from '../assets/affiliations/RTTA.jpeg'
import visitRwandaLogo from '../assets/affiliations/visit_rwanda_logo.png'
import destinationKenyaImage from '../assets/Destinations/Kenya.png'
import destinationRwandaImage from '../assets/Destinations/rd.png'
import destinationTanzaniaImage from '../assets/Destinations/Tanzania.png'
import destinationUgandaImage from '../assets/Destinations/uganda.png'
import kenyaImage from '../assets/Kenya.png'
import rwandaImage from '../assets/Rwanda.png'
import safariImage from '../assets/young-mountain-gorilla-virunga-national-park-africa-drc-central-africa_191971-22582.avif'
import tanzaniaImage from '../assets/Tanzania.png'
import ugandaImage from '../assets/Uganda.png'
import { listAffiliations } from '../services/affiliationService.js'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:6003').replace(/\/$/, '')
const heroSlides = [safariImage, heroGorilla, rwandaImage, ugandaImage, kenyaImage]
const heroTypewriterPhrases = ['Welcome to IMIGANI SAFARIS AND TOURS', 'Adventure Storytelling']

const fallbackAffiliations = [
  {
    name: 'Rwanda Tours and Travel Association',
    slug: 'rtta',
  },
  {
    name: 'African Travel & Tourism Association',
    slug: 'atta',
  },
  {
    name: 'Visit Rwanda',
    slug: 'visit-rwanda',
  },
]

const affiliationFallbackLogos = {
  atta: attaLogo,
  rtta: rttaLogo,
  'visit-rwanda': visitRwandaLogo,
}

const whyItems = [
  {
    Icon: Compass,
    title: 'Authentic Experience',
    text: 'We go beyond sightseeing to create genuine connections with destinations, cultures, people, and nature.',
  },
  {
    Icon: Sparkles,
    title: 'Boutique Service',
    text: 'We choose quality over volume, giving every journey personal attention and thoughtful detail.',
  },
  {
    Icon: RouteIcon,
    title: 'Adventure storytelling',
    text: 'We believe travel becomes more meaningful when adventure, discovery, and stories come together.',
  },
  {
    Icon: UsersRound,
    title: 'Meaningful Journeys',
    text: 'We create experiences that stay with you long after you return home.',
  },
]

const experiences = [
  {
    title: 'Safari & Wildlife',
    Icon: Binoculars,
    image: safariImage,
    text: 'Encounter mountain gorillas, golden monkeys, big cats, savannah wildlife, and the natural wonders of East Africa.',
  },
  {
    title: 'Adventure',
    Icon: Mountain,
    image: heroGorilla,
    text: 'Hike volcanic trails, follow forest paths, paddle calm waters, and discover landscapes made for active exploration.',
  },
  {
    title: 'Culture & Heritage',
    Icon: BookOpenText,
    image: rwandaImage,
    text: 'Meet local communities, learn from tradition keepers, and experience food, dance, craft, and everyday life.',
  },
  {
    title: 'Educational Journeys',
    Icon: GraduationCap,
    image: ugandaImage,
    text: 'Purposeful learning trips for students, researchers, and groups seeking deeper context across East Africa.',
  },
  {
    title: 'Leisure & Private Journeys',
    Icon: Sparkles,
    image: kenyaImage,
    text: 'Travel at your own pace with carefully designed experiences for individuals, couples, families, and private groups.',
  },
  {
    title: 'Tailor-Made Journeys',
    Icon: Compass,
    image: tanzaniaImage,
    text: "Tell us what you want to experience, and we'll help shape it into a journey that fits you.",
  },
  {
    title: 'Group & Incentive Travel',
    Icon: UsersRound,
    image: ugandaImage,
    text: 'Thoughtfully planned experiences for schools, organizations, companies, families, and groups.',
  },
]

const destinations = [
  {
    label: 'RWANDA',
    title: ['The heart of Our Story'],
    description: 'Our home and where the IMIGANI journey begins',
    link: 'Explore Rwanda',
    to: '/destinations?country=rwanda',
    image: destinationRwandaImage,
    className: 'destination-rwanda',
    featured: true,
  },
  {
    label: 'UGANDA',
    title: ['The Pearl of Africa'],
    link: 'Explore Uganda',
    to: '/destinations?country=uganda',
    image: destinationUgandaImage,
    className: 'destination-uganda',
  },
  {
    label: 'KENYA',
    title: ['Where the Wild', 'Comes Alive'],
    link: 'Explore Kenya',
    to: '/destinations?country=kenya',
    image: destinationKenyaImage,
    className: 'destination-kenya',
  },
  {
    label: 'TANZANIA',
    title: ['Wilderness Without Limits'],
    link: 'Explore Tanzania',
    to: '/destinations?country=tanzania',
    image: destinationTanzaniaImage,
    className: 'destination-tanzania',
  },
]

function Home() {
  const visibleExperienceCount = 4
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [experienceStart, setExperienceStart] = useState(0)
  const [managedAffiliations, setManagedAffiliations] = useState(fallbackAffiliations)
  const [heroPhraseIndex, setHeroPhraseIndex] = useState(0)
  const [heroTypedText, setHeroTypedText] = useState(() =>
    prefersReducedMotion ? heroTypewriterPhrases[0] : '',
  )
  const [isHeroDeleting, setIsHeroDeleting] = useState(false)
  const visibleExperiences = Array.from({ length: visibleExperienceCount }, (_, index) => {
    return experiences[(experienceStart + index) % experiences.length]
  })

  useEffect(() => {
    let isMounted = true

    async function loadManagedAffiliations() {
      try {
        const rows = await listAffiliations({ filters: { status: 'active' }, limit: 50 })
        if (isMounted) setManagedAffiliations(Array.isArray(rows) ? rows : [])
      } catch {
        if (isMounted) setManagedAffiliations(fallbackAffiliations)
      }
    }

    loadManagedAffiliations()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const activePhrase = heroTypewriterPhrases[heroPhraseIndex]

    if (prefersReducedMotion) {
      return undefined
    }

    let delay = isHeroDeleting ? 50 : 90

    if (!isHeroDeleting && heroTypedText === activePhrase) {
      delay = 3000
    } else if (isHeroDeleting && heroTypedText === '') {
      delay = 420
    }

    const timeoutId = window.setTimeout(() => {
      if (!isHeroDeleting && heroTypedText === activePhrase) {
        setIsHeroDeleting(true)
        return
      }

      if (isHeroDeleting && heroTypedText === '') {
        setIsHeroDeleting(false)
        setHeroPhraseIndex((current) => (current + 1) % heroTypewriterPhrases.length)
        return
      }

      const nextLength = heroTypedText.length + (isHeroDeleting ? -1 : 1)
      setHeroTypedText(activePhrase.slice(0, nextLength))
    }, delay)

    return () => window.clearTimeout(timeoutId)
  }, [heroPhraseIndex, heroTypedText, isHeroDeleting, prefersReducedMotion])

  const showPreviousExperiences = () => {
    setExperienceStart((current) => (current === 0 ? experiences.length - 1 : current - 1))
  }

  const showNextExperiences = () => {
    setExperienceStart((current) => (current + 1) % experiences.length)
  }

  return (
    <div>
      <section
        id="home"
        className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-[#0b2a12] bg-[position:58%_center] px-5 py-16 text-white sm:min-h-[620px] sm:py-20"
      >
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          {heroSlides.map((image, index) => (
            <img
              key={image}
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-0 animate-[heroFade_40s_infinite]"
              style={{ animationDelay: `${index * 8}s` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,11,0.82),rgba(8,27,12,0.58)_48%,rgba(8,27,12,0.28))]" />
        <div className="relative mx-auto w-full max-w-[1120px]">
          <div className="max-w-[690px]">
            <h1 className="text-[34px] font-bold leading-[1.18] text-white sm:text-[54px]">
              Muraho Neza!
              <span
                className="mt-1 block min-h-[1.18em] whitespace-nowrap text-[14px] min-[375px]:text-[16px] min-[420px]:text-[18px] sm:text-[28px] lg:text-[34px]"
                aria-hidden="true"
              >
                {heroTypedText}
                {!prefersReducedMotion ? (
                  <span className="ml-1 inline-block h-[0.92em] w-[3px] animate-[pulse_1s_steps(1,end)_infinite] bg-[#d3a14e] align-[-0.06em]" />
                ) : null}
              </span>
              <span className="sr-only">Welcome to IMIGANI Safaris and Tours. Adventure storytelling.</span>
            </h1>
            <p className="mt-7 max-w-[690px] whitespace-pre-line text-[14px] font-medium leading-[1.72] text-white/92 sm:text-[18px] sm:leading-[1.85]">
              {`IMIGANI Safaris and Tours is a boutique East African travel company rooted in Rwanda, creating authentic and meaningful journeys across Rwanda, Uganda, Kenya, and Tanzania.

From wildlife and adventure to culture, education, and leisure, we thoughtfully design experiences that connect travelers with the people, places, nature, and stories that make East Africa unforgettable.`}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[5px] bg-[#c6923d] px-6 text-center text-[14px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#a96e19] sm:w-auto"
                href="#experiences"
              >
                Explore our Experience
              </a>
              <Link
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[5px] border border-white/45 bg-white/12 px-6 text-center text-[14px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-[#0b2a12] sm:w-auto"
                to="/destinations"
              >
                Discover our Destinations
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-8 flex justify-center gap-2.5" aria-label="Hero slider dots">
          {heroSlides.map((image, index) => (
            <span
              key={image}
              className="h-[9px] w-[9px] rounded-full bg-white/42 animate-[heroDot_40s_infinite]"
              style={{ animationDelay: `${index * 8}s` }}
            />
          ))}
        </div>
      </section>

      <section id="about-us" className="bg-white px-5 py-[78px]">
        <div className="mx-auto max-w-[1120px]">
          <div>
            <SectionHeading title="Why IMIGANI?" />
          </div>
          <div className="mt-[52px] grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-9 lg:grid-cols-4">
            {whyItems.map((item) => (
              <article key={item.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d7e3d8] text-[#15351a] sm:h-[76px] sm:w-[76px]">
                  <item.Icon className="h-7 w-7 sm:h-9 sm:w-9" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-[14px] font-bold leading-snug text-[#19381d] sm:mt-6 sm:text-[18px]">{item.title}</h3>
                <p className="mx-auto mt-3 max-w-[240px] text-[12px] font-medium leading-[1.55] text-[#637069] sm:max-w-[260px] sm:text-[15px] sm:leading-[1.75]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experiences" className="bg-[#102f16] px-5 py-[78px] text-white">
        <div className="mx-auto max-w-[1120px]">
          <div>
            <SectionHeading title="Experiences" light />
          </div>
          <div className="mx-auto mt-7 max-w-[760px] text-center">
            <h2 className="text-[30px] font-bold leading-tight text-white sm:text-[40px]">Travel With Meaning</h2>
            <p className="mx-auto mt-5 max-w-[820px] text-[14px] font-medium leading-[1.65] text-white/78 sm:text-[17px] sm:leading-[1.8]">
              Whether you are seeking adventure, wildlife, culture, learning, or simply time to reconnect,
              we create journeys around how you want to experience East Africa.
            </p>
          </div>

          <div className="mt-12 grid items-center gap-5 lg:grid-cols-[44px_1fr_44px]">
            <button
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/8 text-white transition hover:-translate-y-0.5 hover:bg-[#d3a14e] lg:inline-flex"
              type="button"
              aria-label="Previous experience"
              onClick={showPreviousExperiences}
            >
              <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {visibleExperiences.map((experience) => (
                <article
                  key={experience.title}
                  className="overflow-hidden rounded-[8px] bg-[#14381b] shadow-[0_22px_42px_rgba(0,0,0,0.16)] transition hover:-translate-y-1 hover:shadow-[0_30px_54px_rgba(0,0,0,0.24)]"
                >
                  <img src={experience.image} alt="" className="h-[118px] w-full object-cover transition duration-500 hover:scale-[1.045] sm:h-[168px]" />
                  <div className="min-h-[180px] bg-[#14381b] p-4 sm:min-h-[190px] sm:p-5">
                    <h3 className="flex items-center gap-2 text-[14px] font-bold leading-snug text-white sm:text-[18px]">
                      <experience.Icon className="h-[18px] w-[18px] flex-none text-[#d3a14e] sm:h-5 sm:w-5" aria-hidden="true" />
                      {experience.title}
                    </h3>
                    <p className="mt-3 text-[12px] font-medium leading-[1.55] text-white/72 sm:text-[14px] sm:leading-[1.7]">{experience.text}</p>
                    <a className="mt-4 inline-flex items-center text-[13px] font-bold text-[#d3a14e] sm:text-[14px]" href="#">
                      Learn More <ArrowRight className="ml-1 h-[15px] w-[15px]" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <button
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/8 text-white transition hover:-translate-y-0.5 hover:bg-[#d3a14e] lg:inline-flex"
              type="button"
              aria-label="Next experience"
              onClick={showNextExperiences}
            >
              <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-10 flex justify-center gap-2.5" aria-label="Experience carousel slides">
            {experiences.map((experience, index) => (
              <button
                key={experience.title}
                type="button"
                className={`h-[9px] w-[9px] rounded-full transition hover:scale-110 ${
                  index === experienceStart ? 'bg-[#d3a14e]' : 'bg-white/34'
                }`}
                aria-label={`Show ${experience.title}`}
                onClick={() => setExperienceStart(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="destinations" className="relative z-[1] scroll-mt-6 bg-white px-5 py-16 sm:py-20 lg:pb-[78px] lg:pt-[106px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="text-center">
            <h2 className="text-[38px] font-bold leading-[1.05] text-[#050505] sm:text-[48px] lg:text-[62px]">
              Destinations
            </h2>
            <span className="mx-auto mt-4 block h-[6px] w-[92px] rounded-[8px] bg-[#d3a14e]" />
          </div>

          <div className="mt-9 grid gap-5 sm:mt-11 lg:mt-14 lg:grid-cols-[minmax(0,0.47fr)_minmax(0,0.53fr)] lg:items-start">
            <div className="grid gap-5 lg:grid-rows-[auto_430px]">
              <div className="text-center text-[#0b0b0b] lg:mb-2 lg:text-left">
                <h3 className="mx-auto max-w-[340px] text-[30px] font-bold leading-[1.16] sm:max-w-[500px] sm:text-[36px] lg:mx-0 lg:text-[43px]">
                  Discover East Africa
                  <span className="block">Through Its Stories</span>
                </h3>
                <p className="mx-auto mt-4 max-w-[320px] text-[15px] font-semibold leading-[1.5] text-[#151515] sm:max-w-[500px] sm:text-[18px] lg:mx-0 lg:mt-6 lg:text-[23px]">
                  Four Countries, Different landscapes,
                  <span className="block">Diverse cultures, Countless stories</span>
                </p>
              </div>
              <DestinationCard destination={destinations[0]} />
            </div>

            <div className="grid gap-5 lg:grid-rows-[290px_320px]">
              <div className="grid gap-5 sm:grid-cols-2 lg:min-h-0">
                <DestinationCard destination={destinations[1]} />
                <DestinationCard destination={destinations[2]} />
              </div>
              <DestinationCard destination={destinations[3]} />
            </div>
          </div>
        </div>
      </section>

      {managedAffiliations.length > 0 ? (
        <section className="border-y border-[#0b2a12]/8 bg-[#f5f8f3] px-5 py-14 sm:py-[68px]" aria-labelledby="affiliations-title">
          <div className="mx-auto max-w-[1120px]">
            <div id="affiliations-title">
              <SectionHeading title="Partners & Affiliations" />
            </div>

            <div className="mx-auto mt-9 grid max-w-[900px] grid-cols-1 gap-4 sm:mt-11 sm:grid-cols-3 sm:gap-5">
              {managedAffiliations.map((affiliation) => {
                const logo = publicMediaUrl(affiliation.logo_url) || affiliationFallbackLogos[affiliation.slug]
                const PartnerElement = affiliation.website_url ? 'a' : 'div'

                return (
                  <PartnerElement
                    className="group rounded-[8px] outline-none transition hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-[#d3a14e]/30"
                    href={affiliation.website_url ? normalizeExternalUrl(affiliation.website_url) : undefined}
                    key={affiliation.id || affiliation.slug}
                    rel={affiliation.website_url ? 'noreferrer' : undefined}
                    target={affiliation.website_url ? '_blank' : undefined}
                  >
                    <figure className="flex min-h-[150px] h-full items-center justify-center rounded-[8px] border border-[#0b2a12]/10 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(11,42,18,0.06)] transition group-hover:border-[#d3a14e]/45 group-hover:shadow-[0_18px_36px_rgba(11,42,18,0.1)] sm:min-h-[180px] sm:px-6">
                      {logo ? (
                        <img
                          alt={`${affiliation.name} logo`}
                          className={`${affiliationImageClass(affiliation.slug)} flex-none object-contain`}
                          loading="lazy"
                          src={logo}
                        />
                      ) : null}
                    </figure>
                  </PartnerElement>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default Home

function publicMediaUrl(url) {
  if (!url || url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url
  return url.startsWith('/uploads') ? `${apiBaseUrl}${url}` : url
}

function affiliationImageClass(slug) {
  if (slug === 'rtta') return 'h-[112px] w-[112px] sm:h-[126px] sm:w-[126px]'
  if (slug === 'atta') return 'h-[94px] w-[150px] sm:h-[108px] sm:w-[172px]'
  if (slug === 'visit-rwanda') return 'h-[104px] w-[104px] sm:h-[118px] sm:w-[118px]'
  return 'h-[96px] w-[150px] sm:h-[112px] sm:w-[176px]'
}

function normalizeExternalUrl(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}
