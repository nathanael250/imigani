import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function DestinationCard({ destination }) {
  return (
    <article className={`destination-card ${destination.className}`}>
      <img src={destination.image} alt="" />
      <div className="destination-card-shade" />
      <div className="destination-card-content">
        <p className="destination-label">{destination.label}</p>
        <h3>
          {destination.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h3>
        {destination.description && <p className="destination-description">{destination.description}</p>}
        <Link className={destination.featured ? 'destination-button' : 'destination-link'} to={destination.to}>
          {destination.link} <ArrowRight className="ml-2 icon-link" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export default DestinationCard
