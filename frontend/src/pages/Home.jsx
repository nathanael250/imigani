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
import { Link } from 'react-router-dom'
import DestinationCard from '../components/DestinationCard.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import heroGorilla from '../assets/gollira.png'
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
]

const destinations = [
  {
    label: 'RWANDA',
    title: ['The heart of Our Story'],
    description: 'Our home and where the IMIGANI journey begins',
    link: 'Explore Rwanda',
    to: '/destinations?country=rwanda',
    image: rwandaImage,
    className: 'destination-rwanda',
    featured: true,
  },
  {
    label: 'UGANDA',
    title: ['The Pearl of Africa'],
    link: 'Explore Uganda',
    to: '/destinations?country=uganda',
    image: ugandaImage,
    className: 'destination-uganda',
  },
  {
    label: 'KENYA',
    title: ['Where the Wild', 'Comes Alive'],
    link: 'Explore Kenya',
    to: '/destinations?country=kenya',
    image: kenyaImage,
    className: 'destination-kenya',
  },
  {
    label: 'TANZANIA',
    title: ['Wilderness Without Limits'],
    link: 'Explore Tanzania',
    to: '/destinations?country=tanzania',
    image: tanzaniaImage,
    className: 'destination-tanzania',
  },
]

function Home() {
  return (
    <>
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
            <h1 className="text-[42px] font-bold leading-[1.18] text-white sm:text-[54px]">
              Muraho Neza!
              <span className="mt-1 block">Welcome to IMIGANI.</span>
            </h1>
            <p className="mt-7 max-w-[690px] whitespace-pre-line text-[18px] font-medium leading-[1.85] text-white/92">
              {`IMIGANI Safaris and Tours is a boutique East African travel company rooted in Rwanda, creating authentic and meaningful journeys across Rwanda, Uganda, Kenya, and Tanzania.

From wildlife and adventure to culture, education, and leisure, we thoughtfully design experiences that connect travelers with the people, places, nature, and stories that make East Africa unforgettable.`}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
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
          <SectionHeading title="Why IMIGANI?" />
          <div className="mt-[52px] grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => (
              <article key={item.title} className="text-center">
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
          <SectionHeading title="Experiences" light />
          <div className="mx-auto mt-7 max-w-[760px] text-center">
            <h2 className="text-[30px] font-bold leading-tight text-white sm:text-[40px]">Travel With Meaning</h2>
            <p className="mx-auto mt-5 max-w-[820px] text-[17px] font-medium leading-[1.8] text-white/78">
              Whether you are seeking adventure, wildlife, culture, learning, or simply time to reconnect,
              we create journeys around how you want to experience East Africa.
            </p>
          </div>

          <div className="mt-12 grid items-center gap-5 lg:grid-cols-[44px_1fr_44px]">
            <button className="carousel-button" aria-label="Previous experience">
              <ArrowLeft className="icon-arrow" aria-hidden="true" />
            </button>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {experiences.map((experience) => (
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
            <button className="carousel-button" aria-label="Next experience">
              <ArrowRight className="icon-arrow" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-10 flex justify-center gap-2.5" aria-label="Experience carousel slides">
            {[0, 1, 2, 3, 4, 5].map((dot) => (
              <span key={dot} className={`experience-dot ${dot === 0 ? 'experience-dot-active' : ''}`} />
            ))}
          </div>
        </div>
      </section>

      <section id="destinations" className="destinations-section bg-white px-5">
        <div className="destinations-shell mx-auto">
          <div className="text-center">
            <h2 className="destinations-heading">Destinations</h2>
            <span className="destinations-underline" />
          </div>

          <div className="destinations-composition">
            <div className="destinations-left">
              <div className="destinations-intro">
                <h3>
                  Discover East Africa
                  <span>Through Its Stories</span>
                </h3>
                <p>
                  Four Countries, Different landscapes,
                  <span>Diverse cultures, Countless stories</span>
                </p>
              </div>
              <DestinationCard destination={destinations[0]} />
            </div>

            <div className="destinations-right">
              <div className="destinations-pair">
                <DestinationCard destination={destinations[1]} />
                <DestinationCard destination={destinations[2]} />
              </div>
              <DestinationCard destination={destinations[3]} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
