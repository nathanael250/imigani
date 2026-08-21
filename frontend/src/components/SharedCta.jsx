import { ArrowRight } from 'lucide-react'

function SharedCta() {
  return (
    <section className="bg-[#102f16] px-5 py-[62px] text-white">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-7 text-center lg:flex-row lg:text-left">
        <div className="max-w-[720px]">
          <h2 className="text-[32px] font-bold leading-tight sm:text-[42px]">Let’s Create Your Story</h2>
          <p className="mt-4 text-[17px] font-medium leading-[1.8] text-white/78">
            Ready to explore East Africa? Our team is here to help you plan a journey that is authentic,
            meaningful, and unforgettable.
          </p>
        </div>
        <a className="cta-button" href="mailto:info@imiganisafarisandtours.com">
          Plan Your Journey Today <ArrowRight className="ml-2 icon-link" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

export default SharedCta
