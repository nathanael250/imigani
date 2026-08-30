function SectionHeading({ title, light = false }) {
  return (
    <div className="text-center">
      <h2 className={`text-[30px] font-bold leading-tight sm:text-[38px] ${light ? 'text-white' : 'text-[#133417]'}`}>
        {title}
      </h2>
      <span className="mx-auto mt-4 block h-[4px] w-[76px] rounded-full bg-[#d3a14e]" />
    </div>
  )
}

export default SectionHeading
