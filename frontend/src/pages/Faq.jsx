import FaqAccordion from '../components/FaqAccordion.jsx'
import rwandaImage from '../assets/Rwanda.png'

function Faq() {
  return (
    <>
      <section className="relative isolate flex min-h-[230px] items-center overflow-hidden px-5 text-white sm:min-h-[280px]">
        <img
          src={rwandaImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_44%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,11,0.8),rgba(7,24,11,0.55),rgba(65,43,16,0.4))]" />
        <div className="relative mx-auto w-full max-w-[1120px]">
          <p className="text-[14px] font-bold uppercase text-[#e2b15c]">Plan with confidence</p>
          <h1 className="mt-3 text-[38px] font-bold leading-tight sm:text-[54px]">Frequently Asked Questions</h1>
          <p className="mt-4 max-w-[620px] text-[15px] font-medium leading-[1.7] text-white/85 sm:text-[17px]">
            Helpful answers as you begin imagining and planning your East African journey.
          </p>
        </div>
      </section>

      <section className="bg-[#f5f8f3] px-5 py-[68px] sm:py-[82px]" aria-label="Travel questions and answers">
        <div className="mx-auto max-w-[920px]">
          <FaqAccordion idPrefix="faq-page" />
        </div>
      </section>
    </>
  )
}

export default Faq
