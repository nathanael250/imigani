/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const TranslationContext = createContext(null)
const originalTextNodes = new WeakMap()
const originalAttributes = new WeakMap()
const translationMemory = new Map()
const cachePrefix = 'imigani-translation:'
const languages = {
  en: 'English',
  fr: 'French',
}

function TranslationProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === 'undefined') return 'en'

    return localStorage.getItem('imigani-language') || 'en'
  })

  function setLanguage(nextLanguage) {
    const safeLanguage = languages[nextLanguage] ? nextLanguage : 'en'
    if (safeLanguage === language) return

    setLanguageState(safeLanguage)
    localStorage.setItem('imigani-language', safeLanguage)
    document.documentElement.lang = safeLanguage
    window.location.reload()
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <TranslationContext.Provider value={{ language, languages, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  )
}

function TranslationRoot({ children }) {
  const rootRef = useRef(null)
  const runIdRef = useRef(0)
  const { pathname } = useLocation()
  const { language } = useTranslation()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    let timeoutId
    let isCancelled = false
    const runId = runIdRef.current + 1
    runIdRef.current = runId

    const scheduleTranslation = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        translateRoot(root, language, runId, runIdRef).catch(() => {
          restoreRoot(root)
        })
      }, 80)
    }

    if (language === 'en') {
      restoreRoot(root)
      return undefined
    }

    scheduleTranslation()

    const observer = new MutationObserver(() => {
      if (!isCancelled) scheduleTranslation()
    })

    observer.observe(root, { childList: true, subtree: true })

    return () => {
      isCancelled = true
      observer.disconnect()
      window.clearTimeout(timeoutId)
    }
  }, [language, pathname])

  return <div ref={rootRef}>{children}</div>
}

function useTranslation() {
  const context = useContext(TranslationContext)

  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider')
  }

  return context
}

async function translateRoot(root, language, runId, runIdRef) {
  if (language === 'en') {
    restoreRoot(root)
    return
  }

  const textNodes = collectTextNodes(root)
  const attributes = collectTranslatableAttributes(root)

  for (const node of textNodes) {
    if (runId !== runIdRef.current) return

    const original = originalTextNodes.get(node) || node.nodeValue
    originalTextNodes.set(node, original)

    const translated = await translateText(original, language)
    if (translated && runId === runIdRef.current) {
      node.nodeValue = keepWhitespace(original, translated)
    }
  }

  for (const item of attributes) {
    if (runId !== runIdRef.current) return

    const original = getOriginalAttribute(item.element, item.attribute)
    const translated = await translateText(original, language)
    if (translated && runId === runIdRef.current) {
      item.element.setAttribute(item.attribute, translated)
    }
  }
}

function restoreRoot(root) {
  collectTextNodes(root).forEach((node) => {
    const original = originalTextNodes.get(node)
    if (original != null && node.nodeValue !== original) {
      node.nodeValue = original
    }
  })

  collectTranslatableAttributes(root).forEach(({ element, attribute }) => {
    const original = getOriginalAttribute(element, attribute)
    if (original && element.getAttribute(attribute) !== original) {
      element.setAttribute(attribute, original)
    }
  })
}

function collectTextNodes(root) {
  const nodes = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = originalTextNodes.get(node) || node.nodeValue || ''
      const parent = node.parentElement

      if (!parent || shouldSkipElement(parent) || !isTranslatableText(text)) {
        return NodeFilter.FILTER_REJECT
      }

      return NodeFilter.FILTER_ACCEPT
    },
  })

  while (walker.nextNode()) {
    nodes.push(walker.currentNode)
  }

  return nodes
}

function collectTranslatableAttributes(root) {
  const attributes = []
  const selector = '[placeholder], [title], [aria-label], img[alt]'

  root.querySelectorAll(selector).forEach((element) => {
    if (shouldSkipElement(element)) return

    ;['placeholder', 'title', 'aria-label', 'alt'].forEach((attribute) => {
      const value = element.getAttribute(attribute)

      if (isTranslatableText(value)) {
        attributes.push({ attribute, element })
      }
    })
  })

  return attributes
}

function shouldSkipElement(element) {
  return Boolean(
    element.closest(
      [
        'script',
        'style',
        'noscript',
        'code',
        'pre',
        'textarea',
        'input',
        'select',
        'option',
        '[contenteditable="true"]',
        '[data-no-translate]',
        '.dashboard-rich-editor-content',
        '.language-menu',
      ].join(','),
    ),
  )
}

function isTranslatableText(value) {
  const text = String(value || '').trim()

  if (!text) return false
  if (text.length < 2) return false
  if (/^[\d\s.,:;+\-/()&|#]+$/.test(text)) return false
  if (/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(text)) return false
  if (/^(https?:\/\/|mailto:|tel:)/i.test(text)) return false

  return /[a-z]/i.test(text)
}

function getOriginalAttribute(element, attribute) {
  let elementAttributes = originalAttributes.get(element)

  if (!elementAttributes) {
    elementAttributes = new Map()
    originalAttributes.set(element, elementAttributes)
  }

  if (!elementAttributes.has(attribute)) {
    elementAttributes.set(attribute, element.getAttribute(attribute) || '')
  }

  return elementAttributes.get(attribute)
}

async function translateText(value, language) {
  const text = String(value || '')
  const trimmed = text.trim()
  if (!isTranslatableText(trimmed)) return text

  const key = `${language}:${trimmed}`
  const cached = getCachedTranslation(key)
  if (cached) return cached

  const translated = await translateSegments(splitIntoSegments(trimmed), language)
  const cleanTranslation = translated || trimmed
  setCachedTranslation(key, cleanTranslation)

  return cleanTranslation
}

async function translateSegments(segments, language) {
  const translatedSegments = []

  for (const segment of segments) {
    const cached = getCachedTranslation(`${language}:${segment}`)
    if (cached) {
      translatedSegments.push(cached)
      continue
    }

    const url = new URL('https://api.mymemory.translated.net/get')
    url.searchParams.set('q', segment)
    url.searchParams.set('langpair', `en|${language}`)

    const response = await fetch(url)
    if (!response.ok) {
      translatedSegments.push(segment)
      continue
    }

    const data = await response.json()
    const translated = data?.responseData?.translatedText || segment
    setCachedTranslation(`${language}:${segment}`, translated)
    translatedSegments.push(translated)
  }

  return translatedSegments.join(' ')
}

function splitIntoSegments(text) {
  const maxLength = 420
  if (text.length <= maxLength) return [text]

  const parts = text.match(/[^.!?]+[.!?]+|\S+/g) || [text]
  const segments = []
  let current = ''

  parts.forEach((part) => {
    const next = current ? `${current} ${part.trim()}` : part.trim()

    if (next.length > maxLength && current) {
      segments.push(current)
      current = part.trim()
      return
    }

    current = next
  })

  if (current) segments.push(current)

  return segments
}

function keepWhitespace(original, translated) {
  const leading = original.match(/^\s*/)?.[0] || ''
  const trailing = original.match(/\s*$/)?.[0] || ''

  return `${leading}${translated.trim()}${trailing}`
}

function getCachedTranslation(key) {
  if (translationMemory.has(key)) return translationMemory.get(key)

  try {
    const cached = localStorage.getItem(`${cachePrefix}${key}`)
    if (cached) {
      translationMemory.set(key, cached)
      return cached
    }
  } catch {
    return ''
  }

  return ''
}

function setCachedTranslation(key, value) {
  translationMemory.set(key, value)

  try {
    localStorage.setItem(`${cachePrefix}${key}`, value)
  } catch {
    // Browser storage can fill up; in-memory cache still helps for this session.
  }
}

export { TranslationProvider, TranslationRoot, useTranslation }
