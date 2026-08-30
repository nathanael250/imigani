function VisionCard({ Icon, title, text }) {
  return (
    <article className="rounded-[20px] bg-[#f2f3ef] px-[26px] pb-[30px] pt-7 text-[#263129]">
      <div className="flex items-center gap-4">
        <div className="inline-flex h-[55px] w-[55px] flex-none items-center justify-center rounded-full bg-[#15351a] text-white">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-[20px] font-bold leading-[1.1] text-[#516459]">{title}</h3>
          <span className="mt-2 block h-[3px] w-[50px] rounded-full bg-[#c6923d]" />
        </div>
      </div>
      <p className="mt-[26px] text-[14px] font-bold leading-[1.45]">{text}</p>
    </article>
  )
}

export default VisionCard
