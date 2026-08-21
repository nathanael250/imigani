function SectionHeading({ title, light = false }) {
  return (
    <div className="text-center">
      <h2 className={`text-[30px] font-bold leading-tight sm:text-[38px] ${light ? 'text-white' : 'text-[#133417]'}`}>
        {title}
      </h2>
      <span className="section-underline" />
    </div>
  )
}

export default SectionHeading
