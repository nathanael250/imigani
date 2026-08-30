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
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import DestinationCard from '../components/DestinationCard.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import heroGorilla from '../assets/gollira.png'
import destinationKenyaImage from '../assets/Destinations/Kenya.png'
import destinationRwandaImage from '../assets/Destinations/rd.png'
import destinationTanzaniaImage from '../assets/Destinations/Tanzania.png'
import destinationUgandaImage from '../assets/Destinations/uganda.png'
import kenyaImage from '../assets/Kenya.png'
import rwandaImage from '../assets/Rwanda.png'
import safariImage from '../assets/young-mountain-gorilla-virunga-national-park-africa-drc-central-africa_191971-22582.avif'
import tanzaniaImage from '../assets/Tanzania.png'
import ugandaImage from '../assets/Uganda.png'

const heroSlides = [safariImage, heroGorilla, rwandaImage, ugandaImage, kenyaImage]

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
  const revealRootRef = useHomeReveal()
  const visibleExperienceCount = 4
  const [experienceStart, setExperienceStart] = useState(0)
  const visibleExperiences = Array.from({ length: visibleExperienceCount }, (_, index) => {
    return experiences[(experienceStart + index) % experiences.length]
  })

  const showPreviousExperiences = () => {
    setExperienceStart((current) => (current === 0 ? experiences.length - 1 : current - 1))
  }

  const showNextExperiences = () => {
    setExperienceStart((current) => (current + 1) % experiences.length)
  }

  return (
    <div ref={revealRootRef} className="home-page">
      <section
        id="home"
        className="hero-panel relative isolate flex min-h-[620px] items-center overflow-hidden px-5 py-20 text-white"
      >
        <div className="hero-slides" aria-hidden="true">
          {heroSlides.map((image, index) => (
            <img
              key={image}
              src={image}
              alt=""
              className="hero-slide"
              style={{ animationDelay: `${index * 8}s` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,11,0.82),rgba(8,27,12,0.58)_48%,rgba(8,27,12,0.28))]" />
        <div className="relative mx-auto w-full max-w-[1120px]">
          <div className="max-w-[690px]">
            <h1 className="home-reveal text-[42px] font-bold leading-[1.18] text-white sm:text-[54px]">
              Muraho Neza!
              <span className="mt-1 block">Welcome to IMIGANI.</span>
            </h1>
            <p className="home-reveal mt-7 max-w-[690px] whitespace-pre-line text-[18px] font-medium leading-[1.85] text-white/92" style={{ '--reveal-delay': '120ms' }}>
              {`IMIGANI Safaris and Tours is a boutique East African travel company rooted in Rwanda, creating authentic and meaningful journeys across Rwanda, Uganda, Kenya, and Tanzania.

From wildlife and adventure to culture, education, and leisure, we thoughtfully design experiences that connect travelers with the people, places, nature, and stories that make East Africa unforgettable.`}
            </p>
            <div className="home-reveal mt-9 flex flex-wrap gap-4" style={{ '--reveal-delay': '240ms' }}>
              <a className="hero-button hero-button-gold" href="#experiences">
                Explore our Experience
              </a>
              <Link className="hero-button hero-button-light" to="/destinations">
                Discover our Destinations
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-8 flex justify-center gap-2.5" aria-label="Hero slider dots">
          {heroSlides.map((image, index) => (
            <span key={image} className="hero-dot" style={{ animationDelay: `${index * 8}s` }} />
          ))}
        </div>
      </section>

      <section id="about-us" className="bg-white px-5 py-[78px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="home-reveal">
            <SectionHeading title="Why IMIGANI?" />
          </div>
          <div className="why-grid mt-[52px] grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item, index) => (
              <article key={item.title} className="home-reveal text-center" style={{ '--reveal-delay': `${index * 90}ms` }}>
                <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#d7e3d8] text-[30px] font-bold text-[#15351a]">
                  <item.Icon className="icon-value" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-[18px] font-bold leading-snug text-[#19381d]">{item.title}</h3>
                <p className="mx-auto mt-3 max-w-[260px] text-[15px] font-medium leading-[1.75] text-[#637069]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experiences" className="bg-[#102f16] px-5 py-[78px] text-white">
        <div className="mx-auto max-w-[1120px]">
          <div className="home-reveal">
            <SectionHeading title="Experiences" light />
          </div>
          <div className="home-reveal mx-auto mt-7 max-w-[760px] text-center" style={{ '--reveal-delay': '100ms' }}>
            <h2 className="text-[30px] font-bold leading-tight text-white sm:text-[40px]">Travel With Meaning</h2>
            <p className="mx-auto mt-5 max-w-[820px] text-[17px] font-medium leading-[1.8] text-white/78">
              Whether you are seeking adventure, wildlife, culture, learning, or simply time to reconnect,
              we create journeys around how you want to experience East Africa.
            </p>
          </div>

          <div className="home-reveal mt-12 grid items-center gap-5 lg:grid-cols-[44px_1fr_44px]" style={{ '--reveal-delay': '180ms' }}>
            <button className="carousel-button" type="button" aria-label="Previous experience" onClick={showPreviousExperiences}>
              <ArrowLeft className="icon-arrow" aria-hidden="true" />
            </button>
            <div className="experience-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {visibleExperiences.map((experience) => (
                <article key={experience.title} className="experience-card">
                  <img src={experience.image} alt="" className="h-[168px] w-full object-cover" />
                  <div className="min-h-[190px] bg-[#14381b] p-5">
                    <h3 className="flex items-center gap-2 text-[18px] font-bold leading-snug text-white">
                      <experience.Icon className="icon-card" aria-hidden="true" />
                      {experience.title}
                    </h3>
                    <p className="mt-3 text-[14px] font-medium leading-[1.7] text-white/72">{experience.text}</p>
                    <a className="mt-4 inline-flex text-[14px] font-bold text-[#d3a14e]" href="#">
                      Learn More <ArrowRight className="ml-1 icon-link" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <button className="carousel-button" type="button" aria-label="Next experience" onClick={showNextExperiences}>
              <ArrowRight className="icon-arrow" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-10 flex justify-center gap-2.5" aria-label="Experience carousel slides">
            {experiences.map((experience, index) => (
              <button
                key={experience.title}
                type="button"
                className={`experience-dot ${index === experienceStart ? 'experience-dot-active' : ''}`}
                aria-label={`Show ${experience.title}`}
                onClick={() => setExperienceStart(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="destinations" className="scroll-mt-6 bg-white px-5 py-16 sm:py-20 lg:py-[106px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="home-reveal text-center">
            <h2 className="text-[38px] font-bold leading-[1.05] text-[#050505] sm:text-[48px] lg:text-[62px]">
              Destinations
            </h2>
            <span className="mx-auto mt-4 block h-[6px] w-[92px] rounded-[8px] bg-[#d3a14e]" />
          </div>

          <div className="mt-9 grid gap-5 sm:mt-11 lg:mt-14 lg:grid-cols-[minmax(0,0.47fr)_minmax(0,0.53fr)] lg:items-stretch">
            <div className="home-reveal grid gap-5" style={{ '--reveal-delay': '100ms' }}>
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

            <div className="home-reveal grid gap-5 lg:grid-rows-[minmax(0,1fr)_183px]" style={{ '--reveal-delay': '220ms' }}>
              <div className="grid gap-5 sm:grid-cols-2">
                <DestinationCard destination={destinations[1]} />
                <DestinationCard destination={destinations[2]} />
              </div>
              <DestinationCard destination={destinations[3]} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function useHomeReveal() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const items = Array.from(root.querySelectorAll('.home-reveal'))

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
    )

    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return rootRef
}

export default Home
