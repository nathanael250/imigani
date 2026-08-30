/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import {
  CalendarDays,
  Check,
  Mail,
  MapPinned,
  Phone,
  Send,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react'
import { createTourInquiry } from '../services/tourService.js'

const PlanVisitContext = createContext(null)

const initialForm = {
  arrivalDate: '',
  budgetCategory: '',
  departureDate: '',
  email: '',
  interests: [],
  message: '',
  name: '',
  nationality: '',
  people: '',
  phone: '',
}

const budgetCategories = ['Luxury', 'Moderate', 'Budget']

const interestOptions = [
  'Gorilla Tracking',
  'Chimpanzee Tracking',
  'Golden Monkey Tracking',
  'Game Drives',
  'Cultural Safaris',
  'Easy to Moderate Hiking',
  'Moderate to Difficult Hiking',
  'Birding',
  'Boat Trips',
  'Relaxation',
  'Visiting Community Projects',
  'Volunteering',
  'Other',
]

function PlanVisitProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  function openPlanVisit() {
    setIsOpen(true)
  }

  function closePlanVisit() {
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') closePlanVisit()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <PlanVisitContext.Provider value={{ closePlanVisit, isOpen, openPlanVisit }}>
      {children}
      {isOpen && <PlanVisitModal onClose={closePlanVisit} />}
    </PlanVisitContext.Provider>
  )
}

function PlanVisitModal({ onClose }) {
  const [form, setForm] = useState(initialForm)
  const [submitState, setSubmitState] = useState('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function toggleInterest(interest) {
    setForm((current) => {
      const interests = current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest]

      return { ...current, interests }
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitState('sending')
    setSubmitMessage('')

    const inquiry = [
      'Plan Your Visit Request',
      `Nationality: ${form.nationality || 'Not specified'}`,
      `Number of People: ${form.people || 'Not specified'}`,
      `Arrival Date: ${form.arrivalDate || 'Not specified'}`,
      `Departure Date: ${form.departureDate || 'Not specified'}`,
      `Travel Category: ${form.budgetCategory || 'Not specified'}`,
      `Interests: ${form.interests.length > 0 ? form.interests.join(', ') : 'Not specified'}`,
      '',
      form.message || 'No additional message provided.',
    ].join('\n')

    try {
      await createTourInquiry({
        email: form.email,
        inquiry,
        name: form.name,
        phone: form.phone,
        status: 'new',
      })
      setSubmitState('sent')
      setSubmitMessage('Thank you. Your trip request has been sent.')
      setForm(initialForm)
    } catch (error) {
      setSubmitState('error')
      setSubmitMessage(error.message || 'We could not send your request. Please try again.')
    }
  }

  return (
    <div className="plan-visit-modal" role="dialog" aria-modal="true" aria-labelledby="plan-visit-title">
      <button className="plan-visit-backdrop" type="button" aria-label="Close plan visit form" onClick={onClose} />
      <div className="plan-visit-panel">
        <div className="plan-visit-header">
          <div>
            <span className="plan-visit-kicker">
              <CalendarDays aria-hidden="true" />
              Start Planning
            </span>
            <h2 id="plan-visit-title">Your East African Journey</h2>
            <p>Share a few details and our team will help shape a thoughtful trip around your pace and interests.</p>
          </div>
          <button className="plan-visit-close" type="button" aria-label="Close form" onClick={onClose}>
            <X aria-hidden="true" />
          </button>
        </div>

        <form className="plan-visit-form" onSubmit={handleSubmit}>
          <div className="plan-visit-grid">
            <PlanField icon={UserRound} label="Name" name="name" value={form.name} onChange={updateField} placeholder="Enter your full name" required />
            <PlanField icon={Mail} label="Email" name="email" type="email" value={form.email} onChange={updateField} placeholder="Enter your email" required />
            <PlanField icon={Phone} label="Phone Number" name="phone" type="tel" value={form.phone} onChange={updateField} placeholder="Phone number" />
            <PlanField icon={MapPinned} label="Nationality" name="nationality" value={form.nationality} onChange={updateField} placeholder="Enter your nationality" />
            <PlanField icon={UsersRound} label="Number of people" name="people" type="number" min="1" value={form.people} onChange={updateField} placeholder="People" />
            <PlanField icon={CalendarDays} label="Arrival Date" name="arrivalDate" type="date" value={form.arrivalDate} onChange={updateField} />
            <PlanField icon={CalendarDays} label="Departure Date" name="departureDate" type="date" value={form.departureDate} onChange={updateField} />
          </div>

          <fieldset className="plan-visit-options">
            <legend>Categories</legend>
            <div className="plan-visit-radio-grid">
              {budgetCategories.map((category) => (
                <label key={category}>
                  <input
                    type="radio"
                    name="budgetCategory"
                    value={category}
                    checked={form.budgetCategory === category}
                    onChange={updateField}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="plan-visit-options">
            <legend>Interests</legend>
            <div className="plan-visit-interest-grid">
              {interestOptions.map((interest) => {
                const isSelected = form.interests.includes(interest)

                return (
                  <label key={interest}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleInterest(interest)} />
                    <span className={isSelected ? 'is-selected' : ''}>
                      {isSelected && <Check aria-hidden="true" />}
                    </span>
                    {interest}
                  </label>
                )
              })}
            </div>
          </fieldset>

          <label className="plan-visit-message">
            <span>Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={updateField}
              placeholder="Your message or more details"
              rows="5"
            />
          </label>

          <div className="plan-visit-actions">
            <button className="plan-visit-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="plan-visit-submit" type="submit" disabled={submitState === 'sending'}>
              {submitState === 'sending' ? 'Sending...' : 'Send Request'}
              <Send aria-hidden="true" />
            </button>
          </div>

          {submitMessage && (
            <p className={`plan-visit-status ${submitState === 'error' ? 'is-error' : ''}`}>{submitMessage}</p>
          )}
        </form>
      </div>
    </div>
  )
}

function PlanField({ icon: Icon, label, name, onChange, type = 'text', value, ...props }) {
  return (
    <label className="plan-visit-field">
      <span>{label}</span>
      <div>
        <Icon aria-hidden="true" />
        <input name={name} type={type} value={value} onChange={onChange} {...props} />
      </div>
    </label>
  )
}

function usePlanVisit() {
  const context = useContext(PlanVisitContext)

  if (!context) {
    throw new Error('usePlanVisit must be used within PlanVisitProvider')
  }

  return context
}

export { PlanVisitProvider, usePlanVisit }
