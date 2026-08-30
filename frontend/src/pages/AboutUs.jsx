import {
  BookOpenText,
  Eye,
  Globe2,
  Lightbulb,
  ShieldCheck,
  Star,
  Target,
  UsersRound,
} from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import VisionCard from '../components/VisionCard.jsx'
import { usePlanVisit } from '../contexts/PlanVisitContext.jsx'
import imiganiStoryImage from '../assets/AboutUs/Imigani_Story.png'
import planJourneyImage from '../assets/AboutUs/plan your journey.png'
import rwandaImage from '../assets/Rwanda.png'

const aboutValues = [
  {
    Icon: ShieldCheck,
    title: 'Authenticity',
    text: 'We value genuine experiences, honest relationships, and the real character of every destination.',
  },
  {
    Icon: BookOpenText,
    title: 'Excellence',
    text: 'We believe stories give destinations meaning and make experiences memorable.',
  },
  {
    Icon: UsersRound,
    title: 'Innovation',
    text: 'We connect travellers with people, cultures, communities, nature, and places.',
  },
  {
    Icon: Star,
    title: 'Connection',
    text: 'We care about the details that shape exceptional experiences.',
  },
  {
    Icon: Lightbulb,
    title: 'Storytelling',
    text: 'We seek thoughtful and creative ways to make travel better.',
  },
  {
    Icon: Globe2,
    title: 'Responsibility',
    text: 'We respect the environment, cultures, communities, and destinations we work with.',
  },
]

function AboutUs() {
  const { openPlanVisit } = usePlanVisit()

  return (
    <>
      <section className="about-hero relative isolate flex min-h-[175px] items-center overflow-hidden px-5 text-white">
        <img src={rwandaImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,11,0.72),rgba(65,43,16,0.45),rgba(7,24,11,0.42))]" />
        <div className="relative mx-auto w-full max-w-[1120px]">
          <h1 className="text-[42px] font-bold leading-tight sm:text-[54px]">About Us</h1>
          <span className="mt-2 block h-[4px] w-[78px] rounded bg-[#c6923d]" />
        </div>
      </section>

      <section className="about-intro-section bg-white px-5 py-[82px]">
        <div className="mx-auto grid max-w-[1120px] gap-9 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <img className="about-main-image" src={rwandaImage} alt="Mountain gorilla in Rwanda landscape" />
          <div>
            <h2 className="about-title">
              Born in Rwanda.
              <span>Inspired by Stories.</span>
            </h2>
            <span className="about-title-line" />
            <div className="mt-6 space-y-5 text-[17px] font-medium leading-[1.55] text-[#263129]">
              <p>
                IMIGANI is a boutique East African travel company creating authentic and meaningful journeys
                through wildlife, adventure, culture, education, and storytelling.
              </p>
              <p>
                We connect travelers with the people, places, nature, and stories that make East Africa unforgettable.
              </p>
              <p>Authentic experiences. Personal service. Meaningful stories.</p>
            </div>

            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              <VisionCard
                Icon={Target}
                title="OUR VISION"
                text="To become a trusted boutique travel company in East Africa, known for authentic, personalized, and meaningful journeys."
              />
              <VisionCard
                Icon={Eye}
                title="OUR MISSION"
                text="To thoughtfully design and deliver authentic East African journeys that connect travelers with nature, cultures, communities, and stories."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-[88px]">
        <div className="mx-auto max-w-[1120px]">
          <SectionHeading title="Our Values" />
          <div className="mt-[58px] grid gap-9 sm:grid-cols-2 lg:grid-cols-6">
            {aboutValues.map((value) => (
              <article key={value.title} className="text-center">
                <div className="mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#a9c5b2] text-white">
                  <value.Icon className="icon-about-value" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-[17px] font-bold text-[#263129]">{value.title}</h3>
                <p className="mx-auto mt-4 max-w-[170px] text-[13px] font-semibold leading-[1.45] text-[#263129]">
                  {value.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-name-section bg-[#d7e7dc] px-5 py-[62px]">
        <div className="mx-auto grid max-w-[1120px] gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <h2 className="text-[30px] font-bold  leading-tight text-[#263129] sm:text-[38px]">
              Why the name IMIGANI?
            </h2>
            <div className="mt-6 space-y-5 text-[16px] font-medium leading-[1.6] text-[#263129]">
              <p>
                The name IMIGANI is inspired by the tradition of storytelling the passing of stories,
                wisdom, knowledge, and experiences from one generation to another.
              </p>
              <p>For us, it represents the belief that:</p>
              <p className="text-[22px] font-bold leading-[1.25] text-[#35583c]">
                Every destination has a story.
                <span className="block">Every journey creates a memory.</span>
              </p>
              <p>Our role is to help you discover both.</p>
            </div>
          </div>
          <img
            className="about-illustration-image"
            src={imiganiStoryImage}
            alt="Storytelling illustration for the meaning of IMIGANI"
          />
        </div>
      </section>

      <section className="bg-white px-5 py-[76px]">
        <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-[16px] font-bold text-[#c6923d]">Plan your journey</p>
            <h2 className="mt-4 text-[32px] font-bold leading-tight text-[#263129] sm:text-[42px]">
              Tell Us Your Story
            </h2>
            <div className="mt-8 space-y-5 text-[16px] font-medium leading-[1.6] text-[#263129]">
              <p>
                Not sure where to begin?
                <span className="block">
                  Tell us where you want to go, what you want to experience, when you want to travel,
                  and who you are travelling with.
                </span>
              </p>
              <p>We will help turn your idea into a thoughtfully designed East African journey.</p>
            </div>
            <button
              className="mt-7 inline-flex min-h-[44px] items-center rounded bg-[#b77b2d] px-8 text-[15px] font-bold text-white transition hover:bg-[#855113]"
              type="button"
              onClick={openPlanVisit}
            >
              Start Planning
            </button>
          </div>
          <img
            className="about-illustration-image"
            src={planJourneyImage}
            alt="Traveler planning an East African journey"
          />
        </div>
      </section>
    </>
  )
}

export default AboutUs
