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

function Tours() {
  const { openPlanVisit } = usePlanVisit()
  const [apiCategories, setApiCategories] = useState([])
  const [apiTours, setApiTours] = useState([])
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const [selectedDurations, setSelectedDurations] = useState(new Set())
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(null)
  const [sortBy, setSortBy] = useState('recommended')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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

  return (
    <>
      <section className="tours-hero relative isolate flex min-h-[220px] items-center overflow-hidden px-5 text-white">
        <img src={maasaiMaraImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,11,0.8),rgba(117,78,23,0.48),rgba(7,24,11,0.28))]" />
        <div className="relative mx-auto w-full max-w-[1120px]">
          <p className="tours-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight aria-hidden="true" />
            <span>Tour Packages</span>
          </p>
          <h1 className="mt-4 text-[42px] font-bold leading-tight sm:text-[58px]">Tours & Safaris</h1>
          <span className="mt-2 block h-[4px] w-[88px] rounded bg-[#c6923d]" />
          <p className="mt-4 max-w-[620px] text-[15px] font-bold leading-7 text-white/88 sm:text-[17px]">
            Explore our handpicked tours and safaris across Rwanda and East Africa.
          </p>
        </div>
      </section>

      <section className="tours-section bg-white px-5 py-[76px]">
        <div className="mx-auto grid max-w-[1120px] gap-9 lg:grid-cols-[276px_minmax(0,1fr)] lg:items-start">
          <aside className={`tours-filter-card${isFilterOpen ? ' is-open' : ''}`} aria-label="Tour filters">
            <div className="tours-filter-heading">
              <span>
                <SlidersHorizontal aria-hidden="true" />
              </span>
              <h2>Filter Tours</h2>
              <button
                className="tours-filter-toggle"
                type="button"
                aria-expanded={isFilterOpen}
                aria-controls="tour-filter-body"
                onClick={() => setIsFilterOpen((current) => !current)}
              >
                {isFilterOpen ? 'Hide' : 'Show'}
                <ChevronDown aria-hidden="true" />
              </button>
            </div>

            <div id="tour-filter-body" className="tours-filter-body">
              <FilterGroup
                title="Categories"
                items={categoryOptions}
                selectedItems={selectedCategories}
                onToggle={(category) => toggleSetValue(setSelectedCategories, category)}
              />
              <FilterGroup
                title="Duration"
                items={durationOptions}
                selectedItems={selectedDurations}
                onToggle={(duration) => toggleSetValue(setSelectedDurations, duration)}
              />

              <div className="tours-filter-group">
                <h3>Price Range</h3>
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
                    onChange={(event) => setSelectedMaxPrice(Number(event.target.value))}
                  />
                </label>
                <div className="tours-range-values">
                  <span>{formatMoney(priceRange.min)}</span>
                  <span>{formatMoney(activeMaxPrice)}+</span>
                </div>
                <p className="mt-2 text-[12px] font-bold text-[#536057]">Showing tours up to {formatMoney(activeMaxPrice)}</p>
              </div>

              <button
                className="tours-apply-button"
                type="button"
                onClick={() => {
                  setSelectedCategories(new Set())
                  setSelectedDurations(new Set())
                  setSelectedMaxPrice(priceRange.max || null)
                }}
              >
                Clear Filters
              </button>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="tours-toolbar">
              <p>
                Showing {visibleTours.length} of {tours.length} curated journeys
              </p>
              <label>
                <span>Sort by</span>
                <select value={sortBy} aria-label="Sort tours" onChange={(event) => setSortBy(event.target.value)}>
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="duration">Duration</option>
                </select>
              </label>
            </div>

            {visibleTours.length > 0 ? (
              <div className="tours-grid">
                {visibleTours.map((tour) => (
                  <TourCard tour={tour} key={tour.id || tour.title} />
                ))}
              </div>
            ) : (
              <div className="tours-empty-state">
                <strong>No tours match those filters.</strong>
                <span>Clear the filters or contact us for a custom East African journey.</span>
              </div>
            )}

            <nav className="tours-pagination" aria-label="Tours pagination">
              {[1, 2, 3].map((page) => (
                <button
                  type="button"
                  className={`tours-page-number ${page === 1 ? 'tours-page-number-active' : ''}`}
                  key={page}
                  aria-current={page === 1 ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
              <button type="button" className="tours-page-control">
                Next
              </button>
              <button type="button" className="tours-page-control">
                Last
              </button>
            </nav>

            <section className="tours-helper-band">
              <div>
                <p>Need a custom route?</p>
                <h2>Can&apos;t find what you&apos;re looking for?</h2>
              </div>
              <button className="tours-helper-button" type="button" onClick={openPlanVisit}>
                Plan Custom Trip <ArrowRight aria-hidden="true" />
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
    <article className="tour-card">
      <Link className="tour-card-image" to={detailPath} aria-label={tour.title}>
        <img src={tour.image} alt={tour.alt} />
        <span>{tour.category}</span>
      </Link>
      <button className="tour-favorite" type="button" aria-label={`Save ${tour.title}`}>
        <Heart aria-hidden="true" />
      </button>
      <div className="tour-card-body">
        <p className="tour-place">{tour.place}</p>
        <h3>
          <Link to={detailPath}>{tour.title}</Link>
        </h3>
        <p className="tour-duration">
          <Clock3 aria-hidden="true" />
          {tour.days} Days / {tour.nights || Math.max(Number(tour.days || 1) - 1, 0)} Nights
        </p>
        <p className="tour-description">{tour.description}</p>
        <div className="tour-card-footer">
          <p>
            <span>From</span>
            {tour.price}
          </p>
          <Link className="tour-details-link" to={detailPath}>
            View Details <ArrowRight className="icon-link" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function FilterGroup({ title, items, selectedItems, onToggle }) {
  return (
    <div className="tours-filter-group">
      <h3>{title}</h3>
      <div className="tours-check-list">
        {items.map((item) => {
          const isSelected = selectedItems.has(item.value)

          return (
            <label key={item.value} className="tours-check-row">
              <span className={`tours-checkbox ${isSelected ? 'tours-checkbox-active' : ''}`}>
                {isSelected ? <Check aria-hidden="true" /> : null}
              </span>
              <span>{item.label}</span>
              <em>{item.count}</em>
              <input type="checkbox" checked={isSelected} onChange={() => onToggle(item.value)} />
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
  if (!url || url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }

  if (url.startsWith('/uploads')) {
    return `${apiBaseUrl}${url}`
  }

  return url
}

function slugify(value) {
  return String(value || 'tour')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default Tours
