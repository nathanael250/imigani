import { ChevronDown, Globe2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from '../contexts/TranslationContext.jsx'

function LanguageMenu({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const { language, languages, setLanguage } = useTranslation()
  const currentLanguage = languages[language] || 'English'

  function chooseLanguage(nextLanguage) {
    setIsOpen(false)
    setLanguage(nextLanguage)
  }

  return (
    <div
      className={`language-menu ${className}`}
      data-no-translate
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false)
        }
      }}
    >
      <button
        className="language-menu-button"
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <Globe2 className="icon-xs" aria-hidden="true" />
        <span>{currentLanguage}</span>
        <ChevronDown className="language-menu-chevron" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="language-menu-list" role="menu">
          {Object.entries(languages).map(([code, label]) => (
            <button
              className={code === language ? 'is-active' : ''}
              type="button"
              role="menuitem"
              key={code}
              onClick={() => chooseLanguage(code)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageMenu
