import { ArrowRight, Check, ChevronDown, ChevronRight, Clock3, Heart, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlanVisit } from '../contexts/PlanVisitContext.jsx'
import { listTourCategories, listTours } from '../services/tourService'
import gorillaImage from '../assets/gollira.png'
import akageraImage from '../assets/Destinations/akagera.png'
import lakeKivuImage from '../assets/Destinations/images.jpeg'
import maasaiMaraImage from '../assets/Destinations/kenya/Maasai Mara National Reserve.png'
import serengetiImage from '../assets/Destinations/Tanzania/Serengeti National Park.png'
import zanzibarImage from '../assets/Destinations/Tanzania/Zanzibar Island (Stone Town & Beaches).png'
import bwindiImage from '../assets/Destinations/Uganda/Bwindi Impenetrable Forest.png'
import kibaleImage from '../assets/Destinations/Uganda/Kibale National Park.png'
import ugandaImage from '../assets/Uganda.png'
import kenyaImage from '../assets/Kenya.png'
import rwandaImage from '../assets/Rwanda.png'
import tanzaniaImage from '../assets/Tanzania.png'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:6003').replace(/\/$/, '')
const uploadBaseUrl = getUploadBaseUrl()

const fallbackTours = [
  {
    title: '3 Days Gorilla Trekking Adventure',
    category: 'Wildlife Safari',
    place: 'Rwanda',
    days: 3,
    nights: 2,
    priceValue: 1250,
    price: '$1,250',
    image: gorillaImage,
    alt: 'Mountain gorilla in a green Rwanda forest',
    description:
      'Track mountain gorillas in Volcanoes National Park with expert guides, forest walks, and a soft landing in Kigali.',
  },
  {
    title: '5 Days Uganda Wildlife Safari',
    category: 'Wildlife Safari',
    place: 'Uganda',
    days: 5,
    nights: 4,
    priceValue: 2180,
    price: '$2,180',
    image: ugandaImage,
    alt: 'Green Uganda landscape with safari terrain',
    description:
      'Explore Uganda through savannah drives, boat moments, primate country, and generous lodge-to-lodge pacing.',
  },
  {
    title: '7 Days Rwanda Culture & Nature',
    category: 'Cultural Tour',
    place: 'Rwanda',
    days: 7,
    nights: 6,
    priceValue: 1890,
    price: '$1,890',
    image: rwandaImage,
    alt: 'Rwanda hills and cultural landscape',
    description:
      'Pair Kigali, local makers, memorial history, lake country, and highland scenery in one thoughtful Rwanda route.',
  },
  {
    title: '4 Days Lake Kivu Escape',
    category: 'Adventure',
    place: 'Rwanda',
    days: 4,
    nights: 3,
    priceValue: 980,
    price: '$980',
    image: lakeKivuImage,
    alt: 'Lake Kivu shoreline with soft hills',
    description:
      'Slow down beside Lake Kivu with kayaking, coffee routes, relaxed boat time, and sunset views over the water.',
  },
  {
    title: '6 Days Kenya & Tanzania Safari',
    category: 'Cultural Tour',
    place: 'Kenya & Tanzania',
    days: 6,
    nights: 5,
    priceValue: 3450,
    price: '$3,450',
    image: kenyaImage,
    alt: 'Kenya safari landscape with giraffes',
    description:
      'Connect iconic plains, warm communities, and cross-border safari rhythm from Kenya toward northern Tanzania.',
  },
  {
    title: '10 Days Best of East Africa',
    category: 'Adventure',
    place: 'East Africa',
    days: 10,
    nights: 9,
    priceValue: 4250,
    price: '$4,250',
    image: tanzaniaImage,
    alt: 'Tanzania coastline and East African travel landscape',
    description:
      'A broad East African journey through wildlife, forests, culture, lakes, and restorative coastal air.',
  },
  {
    title: '3 Days Chimpanzee Trekking',
    category: 'Wildlife Safari',
    place: 'Uganda',
    days: 3,
    nights: 2,
    priceValue: 1150,
    price: '$1,150',
    image: kibaleImage,
    alt: 'Kibale National Park forest in Uganda',
    description:
      'Enter Kibale forest for chimpanzee trekking, birdlife, community encounters, and quiet nights near the canopy.',
  },
  {
    title: '8 Days Great Migration Safari',
    category: 'Wildlife Safari',
    place: 'Tanzania',
    days: 8,
    nights: 7,
    priceValue: 4680,
    price: '$4,680',
    image: serengetiImage,
    alt: 'Serengeti National Park plains in Tanzania',
    description:
      'Follow the movement of the Serengeti with patient game drives, migration timing, and expansive camp stays.',
  },
  {
    title: '5 Days Rwanda Highlights Tour',
    category: 'Cultural Tour',
    place: 'Rwanda',
    days: 5,
    nights: 4,
    priceValue: 1480,
    price: '$1,480',
    image: akageraImage,
    alt: 'Akagera National Park safari landscape',
    description:
      'Blend Kigali culture, Akagera wildlife, highland views, and carefully paced moments with local hosts.',
  },
  {
    title: '7 Days Tanzania Wildlife Safari',
    category: 'Wildlife Safari',
    place: 'Tanzania',
    days: 7,
    nights: 6,
    priceValue: 3950,
    price: '$3,950',
    image: maasaiMaraImage,
    alt: 'Wide East African savannah used for Tanzania wildlife safari',
    description:
      'Move between open plains, crater country, and elephant landscapes with classic Tanzania safari comfort.',
  },
  {
    title: '6 Days Zanzibar Beach Escape',
    category: 'Honeymoon & Romance',
    place: 'Tanzania',
    days: 6,
    nights: 5,
    priceValue: 2250,
    price: '$2,250',
    image: zanzibarImage,
    alt: 'Zanzibar coastline and turquoise water',
    description:
      'Rest into island pace with Stone Town texture, spice routes, blue water, and beach time built for two.',
  },
  {
    title: '2 Days Akagera National Park',
    category: 'Adventure',
    place: 'Rwanda',
    days: 2,
    nights: 1,
    priceValue: 650,
    price: '$650',
    image: bwindiImage,
    alt: 'Green national park forest and safari habitat',
    description:
      'A compact wildlife break with Akagera game drives, lake views, and an easy return route from Kigali.',
  },
]

const durationFilters = [
  { id: '1-3', label: '1 - 3 Days', max: 3, min: 1 },
  { id: '4-7', label: '4 - 7 Days', max: 7, min: 4 },
  { id: '8-14', label: '8 - 14 Days', max: 14, min: 8 },
  { id: '15+', label: '15+ Days', max: Infinity, min: 15 },
]

const toursPerPage = 6

function Tours() {
  const { openPlanVisit } = usePlanVisit()
  const [apiCategories, setApiCategories] = useState([])
  const [apiTours, setApiTours] = useState([])
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const [selectedDurations, setSelectedDurations] = useState(new Set())
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(null)
  const [sortBy, setSortBy] = useState('recommended')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let isMounted = true

    async function loadTours() {
      try {
        const [tours, categories] = await Promise.all([
          listTours({ filters: { status: 'published' }, limit: 100 }),
          listTourCategories({ filters: { status: 'active' }, limit: 100 }),
        ])

        if (isMounted) {
          setApiTours(Array.isArray(tours) ? tours.map(mapApiTour) : [])
          setApiCategories(Array.isArray(categories) ? categories : [])
        }
      } catch {
        if (isMounted) {
          setApiCategories([])
          setApiTours([])
        }
      }
    }

    loadTours()

    return () => {
      isMounted = false
    }
  }, [])

  const tours = apiTours.length > 0 ? apiTours : fallbackTours
  const categoryOptions = useMemo(() => buildCategoryOptions(tours, apiCategories), [apiCategories, tours])
  const durationOptions = useMemo(() => buildDurationOptions(tours), [tours])
  const priceRange = useMemo(() => getPriceRange(tours), [tours])
  const activeMaxPrice =
    priceRange.max > 0 ? Math.min(Math.max(selectedMaxPrice ?? priceRange.max, priceRange.min), priceRange.max) : 0

  const visibleTours = useMemo(() => {
    const filtered = tours.filter((tour) => {
      const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(tour.category)
      const tourPrice = Number(tour.priceValue || 0)
      const priceMatch = activeMaxPrice <= 0 || tourPrice === 0 || tourPrice <= activeMaxPrice
      const durationMatch =
        selectedDurations.size === 0 ||
        durationFilters.some(
          (filter) =>
            selectedDurations.has(filter.id) &&
            Number(tour.days || 0) >= filter.min &&
            Number(tour.days || 0) <= filter.max,
        )

      return categoryMatch && durationMatch && priceMatch
    })

    return [...filtered].sort((first, second) => {
      if (sortBy === 'price-low') return Number(first.priceValue || 0) - Number(second.priceValue || 0)
      if (sortBy === 'duration') return Number(first.days || 0) - Number(second.days || 0)
      return 0
    })
  }, [activeMaxPrice, selectedCategories, selectedDurations, sortBy, tours])

  const totalPages = Math.max(1, Math.ceil(visibleTours.length / toursPerPage))
  const activePage = Math.min(currentPage, totalPages)
  const paginatedTours = useMemo(() => {
    const startIndex = (activePage - 1) * toursPerPage
    return visibleTours.slice(startIndex, startIndex + toursPerPage)
  }, [activePage, visibleTours])
  const paginationPages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <>
      <section className="relative isolate flex min-h-[210px] items-center overflow-hidden px-5 text-white sm:min-h-[220px]">
        <img src={maasaiMaraImage} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_52%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,11,0.8),rgba(117,78,23,0.48),rgba(7,24,11,0.28))]" />
        <div className="relative mx-auto w-full max-w-[1120px]">
          <p className="inline-flex items-center gap-1.5 text-[12px] font-bold leading-none text-white/82">
            <Link className="text-white transition hover:text-[#d3a14e]" to="/">
              Home
            </Link>
            <ChevronRight className="h-[13px] w-[13px] stroke-[2.4]" aria-hidden="true" />
            <span>Tour Packages</span>
          </p>
          <h1 className="mt-4 text-[42px] font-bold leading-tight sm:text-[58px]">Tours & Safaris</h1>
          <span className="mt-2 block h-[4px] w-[88px] rounded bg-[#c6923d]" />
          <p className="mt-4 max-w-[620px] text-[15px] font-bold leading-7 text-white/88 sm:text-[17px]">
            Explore our handpicked tours and safaris across Rwanda and East Africa.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-[62px] md:py-[76px]">
        <div className="mx-auto grid max-w-[1120px] gap-9 lg:grid-cols-[276px_minmax(0,1fr)] lg:items-start">
          <aside
            className="relative rounded-[8px] border border-[#0b2a12]/12 bg-[#fbfcfa] p-[15px] shadow-[0_18px_42px_rgba(11,42,18,0.08)] lg:sticky lg:top-[22px] lg:p-[22px_20px]"
            aria-label="Tour filters"
          >
            <div className="flex items-center gap-3 border-b-0 pb-0 md:border-b md:border-[#0b2a12]/12 md:pb-5">
              <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[7px] bg-[#0b2a12] text-white md:h-[38px] md:w-[38px]">
                <SlidersHorizontal className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <h2 className="flex-1 text-[18px] font-bold leading-[1.2] text-[#102f16]">Filter Tours</h2>
              <button
                className="inline-flex min-h-[34px] items-center justify-center gap-1.5 rounded-md border border-[#0b2a12]/14 bg-white px-2.5 text-[12px] font-bold text-[#0b2a12] md:hidden"
                type="button"
                aria-expanded={isFilterOpen}
                aria-controls="tour-filter-body"
                onClick={() => setIsFilterOpen((current) => !current)}
              >
                {isFilterOpen ? 'Hide' : 'Show'}
                <ChevronDown className={`h-[15px] w-[15px] transition ${isFilterOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
            </div>

            <div
              id="tour-filter-body"
              className={`mt-4 border-t border-[#0b2a12]/12 pt-0 md:mt-0 md:block md:border-t-0 ${
                isFilterOpen ? 'block' : 'hidden'
              }`}
            >
              <FilterGroup
                title="Categories"
                items={categoryOptions}
                selectedItems={selectedCategories}
                onToggle={(category) => {
                  toggleSetValue(setSelectedCategories, category)
                  setCurrentPage(1)
                }}
              />
              <FilterGroup
                title="Duration"
                items={durationOptions}
                selectedItems={selectedDurations}
                onToggle={(duration) => {
                  toggleSetValue(setSelectedDurations, duration)
                  setCurrentPage(1)
                }}
              />

              <div className="pt-[18px] md:pt-[23px]">
                <h3 className="text-[16px] font-bold leading-[1.2] text-[#102f16] md:text-[18px]">Price Range</h3>
                <label className="mt-4 block">
                  <span className="sr-only">Maximum tour price</span>
                  <input
                    className="h-1.5 w-full cursor-pointer accent-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-40"
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    step={getPriceStep(priceRange)}
                    value={activeMaxPrice}
                    disabled={priceRange.max <= 0}
                    onChange={(event) => {
                      setSelectedMaxPrice(Number(event.target.value))
                      setCurrentPage(1)
                    }}
                  />
                </label>
                <div className="mt-2.5 flex justify-between text-[12px] font-bold text-[#536057]">
                  <span>{formatMoney(priceRange.min)}</span>
                  <span>{formatMoney(activeMaxPrice)}+</span>
                </div>
                <p className="mt-2 text-[12px] font-bold text-[#536057]">Showing tours up to {formatMoney(activeMaxPrice)}</p>
              </div>

              <button
                className="mt-[18px] inline-flex min-h-10 w-full items-center justify-center rounded-[5px] bg-[#c6923d] text-[13px] font-bold text-white transition hover:-translate-y-px hover:bg-[#a96e19] md:mt-6 md:min-h-11 md:text-[14px]"
                type="button"
                onClick={() => {
                  setSelectedCategories(new Set())
                  setSelectedDurations(new Set())
                  setSelectedMaxPrice(priceRange.max || null)
                  setCurrentPage(1)
                }}
              >
                Clear Filters
              </button>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 flex flex-col items-start gap-[18px] border-b border-[#0b2a12]/12 pb-[18px] md:flex-row md:items-center md:justify-between">
              <p className="text-[15px] font-bold leading-[1.4] text-[#263129]">
                Showing {paginatedTours.length} of {visibleTours.length} curated journeys
              </p>
              <label className="inline-flex w-full items-center justify-between gap-2.5 text-[13px] font-bold text-[#59655d] md:w-auto">
                <span>Sort by</span>
                <select
                  className="min-h-[38px] min-w-[180px] cursor-pointer rounded-[5px] border border-[#0b2a12]/16 bg-white py-0 pl-3 pr-[34px] text-[13px] font-bold text-[#263129]"
                  value={sortBy}
                  aria-label="Sort tours"
                  onChange={(event) => {
                    setSortBy(event.target.value)
                    setCurrentPage(1)
                  }}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="duration">Duration</option>
                </select>
              </label>
            </div>

            {paginatedTours.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-[22px] gap-y-[25px] sm:grid-cols-2 min-[1101px]:grid-cols-3">
                {paginatedTours.map((tour) => (
                  <TourCard tour={tour} key={tour.id || tour.title} />
                ))}
              </div>
            ) : (
              <div className="grid min-h-[260px] place-items-center content-center gap-2 rounded-[8px] border border-dashed border-[#0b2a12]/18 bg-[#fbfcfa] p-[34px] text-center">
                <strong className="text-[18px] font-bold text-[#0b2a12]">No tours match those filters.</strong>
                <span className="max-w-[430px] text-[14px] font-bold leading-[1.7] text-[#667169]">
                  Clear the filters or contact us for a custom East African journey.
                </span>
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mt-6 flex flex-wrap items-center justify-center gap-[9px]" aria-label="Tours pagination">
                {paginationPages.map((page) => (
                  <button
                    type="button"
                    className={getPageButtonClass(page === activePage)}
                    key={page}
                    aria-current={page === activePage ? 'page' : undefined}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  className={getPageControlClass()}
                  disabled={activePage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                >
                  Next
                </button>
                <button
                  type="button"
                  className={getPageControlClass()}
                  disabled={activePage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  Last
                </button>
              </nav>
            )}

            <section className="mt-[34px] flex flex-col items-start justify-between gap-6 rounded-[8px] bg-[#0b2a12] px-5 py-6 text-white shadow-[0_22px_46px_rgba(11,42,18,0.18)] sm:px-7 sm:py-7 md:flex-row md:items-center md:px-8">
              <div className="max-w-[560px]">
                <p className="text-[12px] font-bold uppercase leading-[1.2] text-[#d3a14e]">Need a custom route?</p>
                <h2 className="mt-2 text-[clamp(24px,2.2vw,32px)] font-bold leading-[1.18]">
                  Can&apos;t find what you&apos;re looking for?
                </h2>
                <p className="mt-2.5 max-w-[520px] text-[13px] font-bold leading-[1.65] text-white/75 sm:text-[14px]">
                  Tell us what you would love to experience and we will shape a private East African journey around you.
                </p>
              </div>
              <button
                className="inline-flex min-h-11 w-full flex-none items-center justify-center gap-2 rounded-[5px] bg-white px-5 text-[13px] font-bold text-[#0b2a12] shadow-sm transition hover:-translate-y-px hover:bg-[#d3a14e] hover:text-white sm:w-auto"
                type="button"
                onClick={openPlanVisit}
              >
                Plan Custom Trip <ArrowRight className="h-[15px] w-[15px] stroke-[2.4]" aria-hidden="true" />
              </button>
            </section>
          </div>
        </div>
      </section>
    </>
  )
}

function TourCard({ tour }) {
  const detailPath = `/tours/${tour.id || slugify(tour.title)}`

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[8px] border border-[#0b2a12]/11 bg-white shadow-[0_15px_34px_rgba(11,42,18,0.08)] transition hover:-translate-y-1 hover:border-[#c6923d]/40 hover:shadow-[0_24px_46px_rgba(11,42,18,0.15)]">
      <Link className="relative block h-[220px] overflow-hidden bg-[#d7e3d8] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(7,24,11,0.1),rgba(7,24,11,0.36))] sm:h-[178px]" to={detailPath} aria-label={tour.title}>
        <img
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
          src={tour.image || gorillaImage}
          alt={tour.alt}
          loading="lazy"
          onError={(event) => {
            if (event.currentTarget.src !== gorillaImage) {
              event.currentTarget.src = gorillaImage
            }
          }}
        />
        <span className="absolute bottom-[13px] left-[13px] z-[1] max-w-[calc(100%-62px)] rounded bg-white/95 px-[9px] py-[7px] text-[10px] font-bold leading-[1.1] text-[#102f16]">
          {tour.category}
        </span>
      </Link>
      <button
        className="absolute right-3 top-3 z-[2] inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#c6923d] transition hover:-translate-y-px hover:bg-[#c6923d] hover:text-white"
        type="button"
        aria-label={`Save ${tour.title}`}
      >
        <Heart className="h-4 w-4 stroke-[2.3]" aria-hidden="true" />
      </button>
      <div className="flex min-h-0 flex-1 flex-col p-[20px_18px_18px] sm:min-h-[286px]">
        <p className="text-[11px] font-bold uppercase leading-[1.2] text-[#c6923d]">{tour.place}</p>
        <h3 className="mt-[9px] text-[19px] font-bold leading-[1.24] text-[#102f16]">
          <Link className="text-inherit transition hover:text-[#c6923d]" to={detailPath}>
            {tour.title}
          </Link>
        </h3>
        <p className="mt-[13px] inline-flex items-center gap-[7px] text-[12px] font-bold leading-[1.3] text-[#526058]">
          <Clock3 className="h-[15px] w-[15px] text-[#c6923d] stroke-[2.3]" aria-hidden="true" />
          {tour.days} Days / {tour.nights || Math.max(Number(tour.days || 1) - 1, 0)} Nights
        </p>
        <p className="mt-[13px] text-[13px] font-semibold leading-[1.58] text-[#4b594f]">{tour.description}</p>
        <div className="mt-auto flex flex-col items-start gap-3.5 pt-[18px] sm:flex-row sm:items-end sm:justify-between">
          <p className="grid text-[20px] font-bold leading-[1.1] text-[#102f16]">
            <span className="mb-1 text-[11px] text-[#7b867e]">From</span>
            {tour.price}
          </p>
          <Link
            className="inline-flex flex-none items-center gap-1.5 text-[12px] font-bold leading-none text-[#855113] transition hover:translate-x-[3px] hover:text-[#0b2a12]"
            to={detailPath}
          >
            View Details <ArrowRight className="h-[14px] w-[14px] flex-none stroke-[2.4]" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function FilterGroup({ title, items, selectedItems, onToggle }) {
  return (
    <div className="pt-[18px] md:pt-[23px]">
      <h3 className="text-[16px] font-bold leading-[1.2] text-[#102f16] md:text-[18px]">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 md:grid-cols-1 md:gap-[13px]">
        {items.map((item) => {
          const isSelected = selectedItems.has(item.value)

          return (
            <label
              key={item.value}
              className="relative grid cursor-pointer grid-cols-[18px_minmax(0,1fr)_auto] items-center gap-2 text-[12px] font-bold leading-[1.35] text-[#3c4c40] md:grid-cols-[20px_minmax(0,1fr)_auto] md:gap-2.5 md:text-[13px]"
            >
              <span
                className={`inline-flex h-[17px] w-[17px] items-center justify-center rounded border md:h-[18px] md:w-[18px] ${
                  isSelected ? 'border-[#c6923d] bg-[#c6923d] text-white' : 'border-[#0b2a12]/24 bg-white'
                }`}
              >
                {isSelected ? <Check className="h-[13px] w-[13px] stroke-[3]" aria-hidden="true" /> : null}
              </span>
              <span>{item.label}</span>
              <em className="text-[12px] not-italic text-[#7a857d]">{item.count}</em>
              <input className="absolute opacity-0 pointer-events-none" type="checkbox" checked={isSelected} onChange={() => onToggle(item.value)} />
            </label>
          )
        })}
      </div>
    </div>
  )
}

function buildCategoryOptions(tours, categories = []) {
  const counts = tours.reduce((result, tour) => {
    const category = tour.category || 'Tour Package'
    result.set(category, (result.get(category) || 0) + 1)
    return result
  }, new Map())
  const categoryNames = new Set([
    ...categories.map(getCategoryName).filter(Boolean),
    ...counts.keys(),
  ])

  return [...categoryNames]
    .sort((first, second) => first.localeCompare(second))
    .map((label) => ({ count: counts.get(label) || 0, label, value: label }))
}

function buildDurationOptions(tours) {
  return durationFilters.map((filter) => ({
    ...filter,
    count: tours.filter((tour) => Number(tour.days || 0) >= filter.min && Number(tour.days || 0) <= filter.max).length,
    value: filter.id,
  }))
}

function toggleSetValue(setter, value) {
  setter((current) => {
    const next = new Set(current)

    if (next.has(value)) {
      next.delete(value)
    } else {
      next.add(value)
    }

    return next
  })
}

function mapApiTour(tour) {
  const priceValue = Number(tour.lowest_price || 0)

  return {
    alt: tour.name,
    category: tour.category_name || 'Tour Package',
    days: Number(tour.duration_days || 0),
    description: plainTextSummary(tour.description, 130) || 'A thoughtfully designed East African journey by IMIGANI.',
    id: tour.id,
    image: mediaPreviewUrl(tour.cover_image_url) || gorillaImage,
    nights: Number(tour.duration_nights || 0),
    place: tour.destination_names || 'East Africa',
    price: priceValue ? `${tour.currency_symbol || '$'}${priceValue.toLocaleString()}` : 'On request',
    priceValue,
    title: tour.name,
  }
}

function getPriceRange(tours) {
  const prices = tours.map((tour) => Number(tour.priceValue || 0)).filter((price) => price > 0)

  if (prices.length === 0) {
    return { max: 0, min: 0 }
  }

  return {
    max: Math.max(...prices),
    min: Math.min(...prices),
  }
}

function getPriceStep(range) {
  const spread = Number(range.max || 0) - Number(range.min || 0)

  if (spread <= 500) return 25
  if (spread <= 2000) return 50
  return 100
}

function formatMoney(value) {
  return value ? `$${Number(value).toLocaleString()}` : '$0'
}

function getPageButtonClass(isActive) {
  const base =
    'inline-flex h-10 min-w-10 items-center justify-center rounded border text-[13px] font-bold leading-none transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0'

  if (isActive) {
    return `${base} border-[#0b2a12] bg-[#0b2a12] text-white`
  }

  return `${base} border-[#0b2a12]/13 text-[#2f3f34] hover:border-[#c6923d] hover:text-[#c6923d]`
}

function getPageControlClass() {
  return 'inline-flex h-10 min-w-[66px] items-center justify-center rounded border border-[#0b2a12]/13 text-[13px] font-bold leading-none text-[#2f3f34] transition hover:-translate-y-px hover:border-[#c6923d] hover:text-[#c6923d] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0'
}

function getCategoryName(category) {
  return String(category?.name || category?.category_name || category?.title || category?.label || '').trim()
}

function plainTextSummary(value, maxLength = 130) {
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

function slugify(value) {
  return String(value || 'tour')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default Tours
