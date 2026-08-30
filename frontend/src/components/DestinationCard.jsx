import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function DestinationCard({ destination }) {
  const heightClass = getDestinationHeightClass(destination)
  const titleClass = destination.featured
    ? 'text-[25px] leading-[1.14] sm:text-[30px] lg:text-[33px]'
    : 'text-[22px] leading-[1.16] sm:text-[25px] lg:text-[26px]'
  const linkClass = destination.featured
    ? 'mt-4 inline-flex min-h-[42px] items-center justify-center rounded-[5px] bg-[#0f5a23] px-5 text-[13px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0b481b] sm:mt-[18px] sm:min-h-[46px] sm:px-[22px] sm:text-[15px]'
    : 'mt-3 inline-flex items-center justify-center text-[13px] font-bold text-[#d3a14e] transition hover:-translate-y-0.5 sm:mt-[18px] sm:text-[15px]'

  return (
    <article
      className={`group relative overflow-hidden rounded-[8px] bg-[#102f16] shadow-[0_24px_54px_rgba(0,0,0,0.13)] sm:rounded-[15px] ${heightClass}`}
    >
      <img
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
        src={destination.image}
        alt=""
      />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,12,4,0.84)_0%,rgba(6,18,8,0.58)_34%,rgba(6,18,8,0.08)_72%),linear-gradient(90deg,rgba(0,0,0,0.28),transparent_56%)]" />
      <div className="absolute inset-x-0 bottom-0 px-5 pb-6 text-white sm:px-6 sm:pb-7">
        <p className="text-[12px] font-bold uppercase leading-none text-[#d3a14e] sm:text-[15px]">{destination.label}</p>
        <h3 className={`mt-3 font-bold ${titleClass}`}>
          {destination.title.map((line) => (
            <span className="block" key={line}>{line}</span>
          ))}
        </h3>
        {destination.description && (
          <p className="mt-3 max-w-[360px] text-[13px] font-semibold leading-[1.5] text-white/86 sm:mt-[14px] sm:text-[16px]">
            {destination.description}
          </p>
        )}
        <Link className={linkClass} to={destination.to}>
          {destination.link} <ArrowRight className="ml-2 icon-link" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

function getDestinationHeightClass(destination) {
  if (destination.featured) {
    return 'min-h-[285px] sm:min-h-[340px] lg:h-[430px]'
  }

  if (destination.className === 'destination-tanzania') {
    return 'min-h-[285px] sm:min-h-[310px] lg:h-[183px]'
  }

  return 'min-h-[285px] sm:min-h-[310px] lg:h-full'
}

export default DestinationCard
