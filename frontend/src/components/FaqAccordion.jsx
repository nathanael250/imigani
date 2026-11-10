import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const frequentlyAskedQuestions = [
  {
    question: 'Which East African countries do you organize journeys in?',
    answer:
      'We design journeys across Rwanda, Uganda, Kenya, and Tanzania, combining wildlife, culture, nature, and meaningful local experiences.',
  },
  {
    question: 'Can my itinerary be customized?',
    answer:
      'Yes. Every journey can be shaped around your interests, travel dates, preferred pace, group size, and accommodation style.',
  },
  {
    question: 'Do you arrange private and group tours?',
    answer:
      'Yes. We plan private journeys for individuals, couples, and families, as well as tailored travel for schools, companies, organizations, and other groups.',
  },
  {
    question: 'How early should I start planning my safari?',
    answer:
      'Planning several months ahead gives you the best choice of accommodation and activities. Gorilla trekking and peak-season journeys benefit from especially early planning.',
  },
  {
    question: 'Can you help with permits, transport, and accommodation?',
    answer:
      'Yes. Depending on your itinerary, we can coordinate permits, airport transfers, ground transport, accommodation, guides, and included activities.',
  },
  {
    question: 'How do I begin planning with IMIGANI?',
    answer:
      'Share where you would like to go, your preferred dates, the people travelling with you, and the experiences that matter most. Our team will use those details to prepare a thoughtful proposal.',
  },
]

function FaqAccordion({ questions = frequentlyAskedQuestions, idPrefix = 'faq' }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="overflow-hidden rounded-[8px] border border-[#dce5d8] bg-white shadow-[0_18px_42px_rgba(11,42,18,0.07)]">
      {questions.map((item, index) => {
        const isOpen = openIndex === index
        const answerId = `${idPrefix}-answer-${index}`

        return (
          <article className="border-b border-[#e6ece3] last:border-b-0" key={item.question}>
            <h3>
              <button
                aria-controls={answerId}
                aria-expanded={isOpen}
                className="flex min-h-[68px] w-full items-center justify-between gap-5 bg-white px-5 py-4 text-left text-[15px] font-bold leading-[1.45] text-[#18371e] transition hover:bg-[#f8faf6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#d3a14e]/25 sm:min-h-[76px] sm:px-6 sm:text-[17px]"
                onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
                type="button"
              >
                <span>{item.question}</span>
                <span
                  className={`grid h-8 w-8 flex-none place-items-center rounded-full bg-[#e2ece0] text-[#0b2a12] transition ${isOpen ? 'rotate-180 bg-[#0b2a12] text-white' : ''}`}
                >
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </h3>
            <div
              aria-hidden={!isOpen}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              id={answerId}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pr-[68px] text-[13px] font-medium leading-[1.75] text-[#5c695f] sm:px-6 sm:pb-6 sm:pr-[88px] sm:text-[15px]">
                  {item.answer}
                </p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default FaqAccordion
