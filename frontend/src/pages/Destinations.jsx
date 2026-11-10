import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Binoculars, HandHeart, MapPin, Mountain, Palmtree, Sailboat, Trees, Waves } from 'lucide-react'
import gorillaImage from '../assets/gollira.png'
import akageraImage from '../assets/Destinations/akagera.png'
import destinationRwandaImage from '../assets/Destinations/Rwanda.png'
import amboseliImage from '../assets/Destinations/kenya/Amboseli National Park.png'
import dianiBeachImage from '../assets/Destinations/kenya/Diani Beach.png'
import lakeNakuruImage from '../assets/Destinations/kenya/Lake Nakuru National Park.png'
import maasaiMaraImage from '../assets/Destinations/kenya/Maasai Mara National Reserve.png'
import tsavoEastImage from '../assets/Destinations/kenya/Tsavo East National Park.png'
import mountKilimanjaroImage from '../assets/Destinations/Tanzania/Mount Kilimanjaro National Park.png'
import ngorongoroCraterImage from '../assets/Destinations/Tanzania/Ngorongoro Crater.png'
import serengetiImage from '../assets/Destinations/Tanzania/Serengeti National Park.png'
import tarangireImage from '../assets/Destinations/Tanzania/Tarangire National Park.png'
import zanzibarImage from '../assets/Destinations/Tanzania/Zanzibar Island (Stone Town & Beaches).png'
import bwindiImage from '../assets/Destinations/Uganda/Bwindi Impenetrable Forest.png'
import kibaleImage from '../assets/Destinations/Uganda/Kibale National Park.png'
import lakeBunyonyiImage from '../assets/Destinations/Uganda/Lake Bunyonyi.png'
import murchisonFallsImage from '../assets/Destinations/Uganda/Murchison Falls National Park.png'
import queenElizabethImage from '../assets/Destinations/Uganda/Queen Elizabeth National Park.png'
import kigaliImage from '../assets/Destinations/Kigali.jpg'
import lakeKivuImage from '../assets/Destinations/images.jpeg'
import nyungweImage from '../assets/Destinations/nyungwe-canopy-walk.jpg'
import kenyaImage from '../assets/Kenya.png'
import rwandaImage from '../assets/Rwanda.png'
import tanzaniaImage from '../assets/Tanzania.png'
import ugandaImage from '../assets/Uganda.png'

const destinationTabs = [
  {
    id: 'rwanda',
    country: 'RWANDA',
    tagline: 'The heart of our Story',
  },
  {
    id: 'uganda',
    country: 'UGANDA',
    tagline: 'The Pride of Africa',
  },
  {
    id: 'kenya',
    country: 'KENYA',
    tagline: 'Where the world Comes Alive',
  },
  {
    id: 'tanzania',
    country: 'TANZANIA',
    tagline: 'Wilderness without limits',
  },
]

const countryContent = {
  rwanda: {
    label: 'RWANDA',
    title: 'The Land of a Thousand Hills',
    tagline: 'The heart of Our Story',
    paragraphs: [
      'Rwanda is a country of beautiful contrasts: misty volcanoes, ancient forests, rare wildlife, open savannahs, vibrant culture, and the calm blue waters of Lake Kivu.',
      'It is also home to the IMIGANI story. From unforgettable conservation encounters to thoughtful cultural experiences and quiet moments in the hills, Rwanda invites travelers to slow down, listen closely, and discover meaning in every landscape.',
    ],
    highlights: [
      { label: 'Wildlife', Icon: Binoculars },
      { label: 'Culture', Icon: HandHeart },
      { label: 'Nature', Icon: Trees },
      { label: 'Adventure', Icon: Mountain },
    ],
    figure: {
      src: gorillaImage,
      alt: 'Mountain gorilla surrounded by Rwanda forest greenery',
    },
    discoveryLabel: 'THINGS TO DISCOVER IN RWANDA',
    discoveryTitle: 'Discover Rwanda',
    discoverySubtitle: 'Every landscape reveals another part of the story',
    cards: [
      {
        location: 'Volcanoes National Park',
        title: ['Mountains. Gorillas. Origins.'],
        description: 'Mist-covered peaks, rare gorilla encounters, and conservation stories rooted in the north.',
        src: destinationRwandaImage,
        alt: 'Mountain gorilla and misty volcano forest in Rwanda',
        layout: 'large',
      },
      {
        location: 'Akagera National Park',
        title: ['Wildlife & Safari.'],
        description: 'Open savannah, lakes, and big-game drives where Rwanda reveals its wilder rhythm.',
        src: akageraImage,
        alt: 'Wildlife landscape in Akagera National Park',
        layout: 'top',
      },
      {
        location: 'Nyungwe National Park',
        title: ['Forest & Adventure.'],
        description: 'Ancient rainforest trails, primates, birdsong, and the canopy walk above the treetops.',
        src: nyungweImage,
        alt: 'Canopy walk in Nyungwe National Park rainforest',
        layout: 'middle',
      },
      {
        location: 'Lake Kivu',
        title: ['Lakeside Escapes.'],
        description: "Blue water, quiet beaches, and slow journeys between Rwanda's western lake towns.",
        src: lakeKivuImage,
        alt: 'Lake Kivu shoreline in Rwanda',
        layout: 'bottomLeft',
      },
      {
        location: 'Kigali',
        title: ['Culture. People. City.'],
        description: 'A creative capital shaped by memory, markets, galleries, food, and warm conversation.',
        src: kigaliImage,
        alt: 'Kigali city and cultural life in Rwanda',
        layout: 'bottomRight',
      },
    ],
  },
  uganda: {
    label: 'UGANDA',
    title: 'The Pearl of Africa',
    tagline: 'The Pride of Africa',
    paragraphs: [
      'Uganda is a land of lush forests, powerful rivers, wide lakes, golden savannahs, and warm communities. It is a place where East Africa feels generous, green, and full of life.',
      'From gorilla trekking in ancient forests to boat journeys on the Nile and wildlife encounters across open plains, Uganda invites travelers into journeys shaped by nature, culture, and discovery.',
    ],
    highlights: [
      { label: 'Primates', Icon: Binoculars },
      { label: 'Culture', Icon: HandHeart },
      { label: 'Waterfalls', Icon: Waves },
      { label: 'Adventure', Icon: Mountain },
    ],
    figure: {
      src: ugandaImage,
      alt: 'Green Uganda landscape with river and forest',
    },
    discoveryLabel: 'THINGS TO DISCOVER IN UGANDA',
    discoveryTitle: 'Discover Uganda',
    discoverySubtitle: 'Every journey reveals another side of the Pearl of Africa',
    cards: [
      {
        location: 'Bwindi Impenetrable Forest',
        title: ['Deep Primate Jungle.'],
        description:
          "Trek into a misty, ancient volcanic rainforest to stand face-to-face with half of the world's remaining endangered mountain gorillas.",
        src: bwindiImage,
        alt: 'Bwindi Impenetrable Forest mountain gorilla habitat in Uganda',
        layout: 'large',
      },
      {
        location: 'Queen Elizabeth National Park',
        title: ['Savannahs and Lions.'],
        description:
          'Cruise down the wildlife-rich Kazinga Channel and drive across golden plains to spot rare tree-climbing lions resting in fig trees.',
        src: queenElizabethImage,
        alt: 'Queen Elizabeth National Park savannah landscape in Uganda',
        layout: 'top',
      },
      {
        location: 'Murchison Falls National Park',
        title: ['Roaring Nile Power.'],
        description:
          'Witness the massive Nile River explosively squeeze through a tiny rock gorge and plunge into a thunderous white mist.',
        src: murchisonFallsImage,
        alt: 'Murchison Falls National Park waterfall on the Nile in Uganda',
        layout: 'middle',
      },
      {
        location: 'Lake Bunyonyi',
        title: ['Magical Terraced Islands.'],
        description:
          'Relax, swim, and cruise in a traditional dugout canoe across a peaceful, mist-covered crater lake surrounded by lush green hillsides.',
        src: lakeBunyonyiImage,
        alt: 'Lake Bunyonyi terraced islands and green hills in Uganda',
        layout: 'bottomLeft',
      },
      {
        location: 'Kibale National Park',
        title: ['Wild Chimpanzee Haven.'],
        description:
          'Explore the primate capital of East Africa on a thrilling jungle trek to track and watch habituated communities of wild chimpanzees playing in the canopy.',
        src: kibaleImage,
        alt: 'Kibale National Park chimpanzee forest habitat in Uganda',
        layout: 'bottomRight',
      },
    ],
  },
  kenya: {
    label: 'KENYA',
    title: 'Where the Wild Comes Alive',
    tagline: 'Classic safari, culture, and coast',
    paragraphs: [
      'Kenya is a country of open horizons, iconic wildlife, warm communities, dramatic highlands, and Indian Ocean calm. It is where classic safari stories meet living cultures and landscapes full of movement.',
      'From golden plains and elephant country to creative city life and slow coastal escapes, Kenya invites travelers to experience East Africa with energy, wonder, and meaningful connection.',
    ],
    highlights: [
      { label: 'Safari', Icon: Binoculars },
      { label: 'Culture', Icon: HandHeart },
      { label: 'Coast', Icon: Palmtree },
      { label: 'Adventure', Icon: Mountain },
    ],
    figure: {
      src: kenyaImage,
      alt: 'Giraffe in Kenya savannah with Mount Kilimanjaro in the background',
    },
    discoveryLabel: 'THINGS TO DISCOVER IN KENYA',
    discoveryTitle: 'Discover Kenya',
    discoverySubtitle: 'Every horizon opens into wildlife, culture, and coast',
    cards: [
      {
        location: 'Maasai Mara National Reserve',
        title: ['Epic Savannah Migration.'],
        description:
          'Witness endless golden plains and the dramatic spectacle of millions of wildebeest crossing crocodile-filled rivers during the Great Migration.',
        src: maasaiMaraImage,
        alt: 'Maasai Mara National Reserve savannah migration landscape in Kenya',
        layout: 'large',
      },
      {
        location: 'Amboseli National Park',
        title: ['Giants of Kilimanjaro.'],
        description:
          "Capture unforgettable views of massive, free-roaming elephant herds marching beneath the majestic, snow-capped peak of Africa's highest mountain.",
        src: amboseliImage,
        alt: 'Elephants beneath Mount Kilimanjaro in Amboseli National Park',
        layout: 'top',
      },
      {
        location: 'Diani Beach',
        title: ['Turquoise Coral Coast.'],
        description:
          'Relax along a pristine, palm-fringed shoreline featuring powder-soft white sands, vibrant coral reefs, and warm Indian Ocean waters.',
        src: dianiBeachImage,
        alt: 'Diani Beach turquoise coastline and white sand in Kenya',
        layout: 'middle',
      },
      {
        location: 'Tsavo East National Park',
        title: ['Red Dust Wilderness.'],
        description:
          'Discover a vast, untamed terrain famous for its unique "red elephants" that bathe and roll in the park\'s vibrant, iron-rich soil.',
        src: tsavoEastImage,
        alt: 'Tsavo East National Park red dust wilderness in Kenya',
        layout: 'bottomLeft',
      },
      {
        location: 'Lake Nakuru National Park',
        title: ['Pink Flamingo Sanctuary.'],
        description:
          'Explore a scenic Rift Valley lake packed with massive flocks of bright pink flamingos and highly protected populations of endangered rhinos.',
        src: lakeNakuruImage,
        alt: 'Lake Nakuru National Park flamingos and Rift Valley lake in Kenya',
        layout: 'bottomRight',
      },
    ],
  },
  tanzania: {
    label: 'TANZANIA',
    title: 'Wilderness Without Limits',
    tagline: 'Vast plains, mountains, and islands',
    paragraphs: [
      'Tanzania is a land of sweeping plains, ancient craters, towering mountains, coastal islands, and wildlife spectacles that feel larger than life. Its landscapes move from raw wilderness to turquoise calm.',
      'From Serengeti migrations and Kilimanjaro views to Zanzibar rhythms and generous local hospitality, Tanzania creates journeys filled with scale, beauty, and a deep sense of freedom.',
    ],
    highlights: [
      { label: 'Wildlife', Icon: Binoculars },
      { label: 'Nature', Icon: Trees },
      { label: 'Islands', Icon: Sailboat },
      { label: 'Adventure', Icon: Mountain },
    ],
    figure: {
      src: tanzaniaImage,
      alt: 'Tropical Tanzania coastline with palm trees and blue ocean',
    },
    discoveryLabel: 'THINGS TO DISCOVER IN TANZANIA',
    discoveryTitle: 'Discover Tanzania',
    discoverySubtitle: 'Every route moves from wild plains to blue coast',
    cards: [
      {
        location: 'Serengeti National Park',
        title: ['Endless Wild Plains.'],
        description:
          'Watch the epic Great Migration across infinite golden savannahs teeming with lions, leopards, and millions of wildebeest.',
        src: serengetiImage,
        alt: 'Serengeti National Park endless savannah plains in Tanzania',
        layout: 'large',
      },
      {
        location: 'Ngorongoro Crater',
        title: ['The Volcanic Cradle.'],
        description:
          'Descend into a massive, self-contained volcanic caldera hosting Africa’s densest concentration of large mammals and rare black rhinos.',
        src: ngorongoroCraterImage,
        alt: 'Ngorongoro Crater volcanic caldera landscape in Tanzania',
        layout: 'top',
      },
      {
        location: 'Zanzibar Island',
        title: ['Spice and Sands.'],
        description:
          'Unwind on powdery white beaches or wander through the historic, stone-carved, spice-scented alleyways of ancient Stone Town.',
        src: zanzibarImage,
        alt: 'Zanzibar Island beaches and Stone Town in Tanzania',
        layout: 'middle',
      },
      {
        location: 'Tarangire National Park',
        title: ['Giants and Baobabs.'],
        description:
          'Explore a dramatic landscape dominated by ancient, massive baobab trees and legendary, giant elephant herds.',
        src: tarangireImage,
        alt: 'Tarangire National Park baobab trees and elephants in Tanzania',
        layout: 'bottomLeft',
      },
      {
        location: 'Mount Kilimanjaro',
        title: ['Roof of Africa.'],
        description:
          'Trek through five distinct ecosystem zones to conquer the snow-capped summit of the tallest free-standing mountain on Earth.',
        src: mountKilimanjaroImage,
        alt: 'Mount Kilimanjaro National Park snow-capped summit in Tanzania',
        layout: 'bottomRight',
      },
    ],
  },
}

function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedCountry = searchParams.get('country')
  const activeCountry = countryContent[requestedCountry] ? requestedCountry : 'rwanda'
  const activeDestination = countryContent[activeCountry]

  return (
    <>
      <section className="relative isolate flex min-h-[190px] items-center overflow-hidden px-5 text-white md:min-h-[215px]">
        <img src={rwandaImage} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_45%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,11,0.74),rgba(68,45,15,0.44),rgba(7,24,11,0.34))]" />
        <div className="relative mx-auto w-full max-w-[1120px]">
          <h1 className="text-[44px] font-bold leading-tight sm:text-[58px]">Destinations</h1>
          <span className="mt-2 block h-[4px] w-[82px] rounded bg-[#c6923d]" />
        </div>
      </section>

      <div
        className="bg-[#0b2a12] px-5 shadow-[0_16px_34px_rgba(11,42,18,0.2)]"
        role="tablist"
        aria-label="Destination countries"
      >
        <div className="mx-auto grid max-w-[1120px] grid-cols-2 lg:grid-cols-4">
          {destinationTabs.map((destination, index) => (
            <button
              key={destination.id}
              type="button"
              role="tab"
              className={`group relative flex min-h-[82px] cursor-pointer flex-col justify-center border-b border-white/12 px-2.5 py-3.5 text-center transition sm:min-h-[78px] sm:px-4 sm:py-4 lg:min-h-[92px] lg:border-b-0 lg:border-r lg:border-white/14 lg:px-[22px] lg:pb-[17px] lg:pt-[19px] ${
                index === 0 ? 'lg:border-l' : ''
              } ${index % 2 === 0 ? 'border-r border-white/12' : 'border-r-0'} ${
                activeCountry === destination.id
                  ? 'bg-white/[0.045] text-[#d3a14e] after:absolute after:bottom-0 after:left-[22px] after:right-[22px] after:h-[3px] after:rounded-t-[6px] after:bg-[#d3a14e]'
                  : 'text-white/86 hover:bg-white/[0.045] hover:text-[#d3a14e]'
              }`}
              aria-selected={activeCountry === destination.id}
              disabled={!countryContent[destination.id]}
              onClick={() => {
                if (countryContent[destination.id]) {
                  setSearchParams({ country: destination.id })
                }
              }}
            >
              <span className="text-[14px] font-bold leading-[1.15] sm:text-[16px] sm:leading-none">
                {destination.country}
              </span>
              <small
                className={`mt-2 text-[11px] font-bold leading-[1.35] group-hover:text-white/84 sm:mt-[9px] sm:text-[12px] ${
                  activeCountry === destination.id ? 'text-white/84' : 'text-white/68'
                }`}
              >
                {destination.tagline}
              </small>
            </button>
          ))}
        </div>
      </div>

      <section id={activeCountry} className="bg-white px-5 py-[82px] max-lg:pb-[76px] max-lg:pt-[72px]">
        <div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <div>
            <p className="text-[14px] font-bold uppercase leading-[1.2] text-[#c6923d]">{activeDestination.label}</p>
            <h2 className="text-[clamp(34px,3.25vw,42px)] font-bold leading-[1.16] text-[#263129]">
              {activeDestination.title}
            </h2>
            <p className="mt-3 text-[20px] font-bold leading-snug text-[#314836]">{activeDestination.tagline}</p>
            <div className="mt-7 space-y-5 text-[16px] font-medium leading-[1.78] text-[#3d4940]">
              {activeDestination.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-9 grid grid-cols-2 gap-x-3.5 gap-y-[22px] sm:grid-cols-4 sm:gap-5">
              {activeDestination.highlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="grid justify-items-center gap-3 text-center text-[14px] font-bold text-[#263129]"
                >
                  <span className="inline-flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#d7e3d8] text-[#0b2a12]">
                    <highlight.Icon className="h-[27px] w-[27px] stroke-[1.8]" aria-hidden="true" />
                  </span>
                  <span>{highlight.label}</span>
                </div>
              ))}
            </div>
          </div>

          <figure className="relative min-h-[340px] overflow-hidden rounded-[24px] bg-[#d7e3d8] shadow-[0_26px_70px_rgba(11,42,18,0.14)] before:pointer-events-none before:absolute before:inset-4 before:z-[1] before:rounded-[inherit] before:border-2 before:border-[#d3a14e]/70 md:min-h-[440px] lg:min-h-[510px] lg:rounded-[58%_42%_46%_54%/42%_54%_46%_58%]">
            <img
              className="h-full min-h-[inherit] w-full object-cover object-center"
              src={activeDestination.figure.src}
              alt={activeDestination.figure.alt}
            />
          </figure>
        </div>
      </section>

      <section className="bg-white px-5 pb-[82px] md:pb-[102px]">
        <div className="mx-auto max-w-[1120px]">
          <div className="text-center">
            <p className="text-[14px] font-bold uppercase leading-[1.2] text-[#c6923d]">
              {activeDestination.discoveryLabel}
            </p>
            <h2 className="mt-2 text-[clamp(34px,8vw,42px)] font-bold leading-[1.16] text-[#050505] md:text-[clamp(34px,3.25vw,42px)]">
              {activeDestination.discoveryTitle}
            </h2>
            <p className="mx-auto mt-2.5 max-w-[620px] text-[16px] font-medium leading-[1.55] text-[#050505] md:text-[17px]">
              {activeDestination.discoverySubtitle}
            </p>
          </div>

          <div className="relative mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-[repeat(3,minmax(260px,auto))] sm:gap-[14px] md:grid-rows-[repeat(3,minmax(230px,auto))] lg:grid-rows-[minmax(230px,auto)_minmax(230px,auto)_minmax(330px,auto)]">
            {activeDestination.cards.map((card) => (
              <article
                key={card.location}
                className={`group relative flex items-end overflow-hidden max-sm:min-h-[330px] rounded-xl bg-[#102f16] shadow-[0_22px_54px_rgba(11,42,18,0.12)] isolate ${getDiscoveryCardClass(card.layout)}`}
              >
                <img
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
                  src={card.src}
                  alt={card.alt}
                />
                <div className="absolute inset-0 z-[1] bg-[linear-gradient(0deg,rgba(3,17,8,0.91)_0%,rgba(3,17,8,0.7)_36%,rgba(3,17,8,0.12)_74%),linear-gradient(90deg,rgba(4,15,6,0.76)_0%,rgba(4,15,6,0.42)_44%,rgba(4,15,6,0.08)_78%)]" />
                <div className="relative z-[2] w-full p-[18px] text-white lg:p-[clamp(15px,1.55vw,20px)]">
                  <p className="flex items-center gap-1.5 text-[8px] font-bold uppercase leading-[1.2] text-[#d3a14e]">
                    <MapPin className="h-[13px] w-[13px] flex-none stroke-[2.4]" aria-hidden="true" />
                    <span>{card.location}</span>
                  </p>
                  <h3 className={`mt-2.5 max-w-[620px] font-bold leading-[1.16] ${getDiscoveryTitleClass(card.layout)}`}>
                    {card.title.map((line) => (
                      <span className="block" key={line}>
                        {line}
                      </span>
                    ))}
                  </h3>
                  <span className="mt-2 block h-0.5 w-8 rounded-full bg-[#d3a14e]" aria-hidden="true" />
                  <p className="mt-[9px] max-w-[610px] text-[12px] font-bold leading-[1.45] text-white/88 lg:text-[clamp(11px,0.84vw,12px)]">
                    {card.description}
                  </p>
                  <a
                    className="mt-[9px] inline-flex items-center gap-2 text-[11px] font-bold text-[#d3a14e] transition hover:translate-x-[3px] hover:text-[#f0be62]"
                    href={`#${activeCountry}`}
                    aria-label={`Explore ${card.location}`}
                  >
                    Explore
                    <ArrowRight className="h-[13px] w-[13px] stroke-[2.4]" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function getDiscoveryCardClass(layout) {
  const classes = {
    large: 'sm:col-start-1 sm:row-start-1 sm:row-end-3',
    top: 'sm:col-start-2 sm:row-start-1',
    middle: 'sm:col-start-2 sm:row-start-2',
    bottomLeft: 'sm:col-start-1 sm:row-start-3',
    bottomRight: 'sm:col-start-2 sm:row-start-3',
  }

  return classes[layout] || ''
}

function getDiscoveryTitleClass(layout) {
  if (layout === 'large') {
    return 'text-[clamp(22px,6.5vw,28px)] sm:text-[clamp(20px,3.5vw,26px)] lg:text-[clamp(22px,1.65vw,28px)]'
  }

  return 'text-[clamp(22px,6.5vw,28px)] sm:text-[clamp(20px,3.5vw,26px)] lg:text-[clamp(20px,1.45vw,24px)]'
}

export default Destinations
