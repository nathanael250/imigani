function VisionCard({ Icon, title, text }) {
  return (
    <article className="vision-card">
      <div className="flex items-center gap-4">
        <div className="vision-icon">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
        <div>
          <h3>{title}</h3>
          <span />
        </div>
      </div>
      <p>{text}</p>
    </article>
  )
}

export default VisionCard
