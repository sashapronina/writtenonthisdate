import { useEffect, useMemo, useState } from 'react'
import type { Poem } from '../lib/poems'

type PoemSheetProps = {
  poem?: Poem
  dateLabel: string
  className?: string
}

const placeholderPoem: Pick<Poem, 'title' | 'author' | 'body' | 'approximateDate'> = {
  title: 'Untitled',
  author: 'Archive',
  approximateDate: true,
  body:
    "While we work on collecting poems that have an exact date, take a moment to appreciate Derek Walcott's Love after Love, written in 1976\n\n" +
    'The time will come\n' +
    'when, with elation,\n' +
    'you will greet yourself arriving\n' +
    'at your own door, in your own mirror\n' +
    "and each will smile at the other's welcome,\n" +
    'and say, sit here. Eat.\n' +
    'You will love again the stranger who was your self.\n' +
    'Give wine. Give bread, Give back your heart\n' +
    'to itself, to the stranger who has loved you\n' +
    'all your life, whom you ignored\n' +
    'for another, who knows you by heart.\n' +
    'Take down the love letters from the bookshelf\n' +
    'the photographs, the desperate notes,\n' +
    'peel your own image from the mirror.\n' +
    'Sit. Feast on your life.',
}

const PER_CHAR_FADE_MS = 1400
const TOTAL_FADE_DURATION_MS = 7500
const MIN_STAGGER_MS = 6
const MAX_STAGGER_MS = 55

export function PoemSheet({ poem, dateLabel, className }: PoemSheetProps) {
  const bodyText = poem?.body ?? placeholderPoem.body
  const [bodyAnimationKey, setBodyAnimationKey] = useState(0)
  const [isAnimationComplete, setIsAnimationComplete] = useState(true)
  const sheetClassName = className ? `poem-sheet ${className}` : 'poem-sheet'

  const characters = useMemo(() => Array.from(bodyText), [bodyText])

  const staggerMs = useMemo(() => {
    if (characters.length <= 1) return 0
    const computed =
      (TOTAL_FADE_DURATION_MS - PER_CHAR_FADE_MS) / (characters.length - 1)
    return Math.min(MAX_STAGGER_MS, Math.max(MIN_STAGGER_MS, computed))
  }, [characters.length])

  const totalAnimationMs = useMemo(() => {
    if (characters.length === 0) return 0
    return (characters.length - 1) * staggerMs + PER_CHAR_FADE_MS
  }, [characters.length, staggerMs])

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (!bodyText) {
      setBodyAnimationKey((key) => key + 1)
      setIsAnimationComplete(true)
      return
    }

    if (prefersReducedMotion) {
      setBodyAnimationKey((key) => key + 1)
      setIsAnimationComplete(true)
      return
    }

    setBodyAnimationKey((key) => key + 1)
    setIsAnimationComplete(false)

    const timeoutId = window.setTimeout(() => {
      setIsAnimationComplete(true)
    }, totalAnimationMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [bodyText, prefersReducedMotion, totalAnimationMs])

  const renderAnimatedText = (text: string) => {
    if (prefersReducedMotion) {
      return text
    }

    return Array.from(text).map((char, idx) => (
      <span
        key={idx}
        className="poem-sheet__char"
        style={{ animationDelay: `${Math.round(idx * staggerMs)}ms` }}
        aria-hidden="true"
      >
        {char}
      </span>
    ))
  }

  if (!poem) {
    return (
      <article className={sheetClassName} aria-live="polite">
        <header className="poem-sheet__header">
          <h1 className="poem-sheet__title">{placeholderPoem.title}</h1>
          {placeholderPoem.approximateDate ? (
            <span className="poem-sheet__approximate-date">Approximate date</span>
          ) : null}
        </header>
        <div className="poem-sheet__scrollable">
          <div
            key={bodyAnimationKey}
            className="poem-sheet__body"
            aria-label={bodyText}
          >
            {renderAnimatedText(bodyText)}
          </div>
          <footer
            key={`footer-${bodyAnimationKey}-${isAnimationComplete ? 'on' : 'off'}`}
            className={`poem-sheet__footer${
              isAnimationComplete ? '' : ' poem-sheet__footer--placeholder'
            }`}
          >
            <p aria-label={placeholderPoem.author}>
              {renderAnimatedText(placeholderPoem.author)}
            </p>
            <p aria-label={dateLabel}>{renderAnimatedText(dateLabel)}</p>
          </footer>
        </div>
      </article>
    )
  }

  const footerDateText = `${dateLabel}${poem.year ? `, ${poem.year}` : ''}`

  return (
    <article className={sheetClassName} aria-live="polite">
      <header className="poem-sheet__header">
        <h1 className="poem-sheet__title">{poem.title}</h1>
        {poem.approximateDate ? (
          <span className="poem-sheet__approximate-date">Approximate date</span>
        ) : null}
      </header>
      <div className="poem-sheet__scrollable">
        <div
          key={bodyAnimationKey}
          className="poem-sheet__body"
          aria-label={bodyText}
        >
          {renderAnimatedText(bodyText)}
        </div>
        <footer
          key={`footer-${bodyAnimationKey}-${isAnimationComplete ? 'on' : 'off'}`}
          className={`poem-sheet__footer${
            isAnimationComplete ? '' : ' poem-sheet__footer--placeholder'
          }`}
        >
          <p aria-label={poem.author}>{renderAnimatedText(poem.author)}</p>
          <p aria-label={footerDateText}>{renderAnimatedText(footerDateText)}</p>
        </footer>
      </div>
    </article>
  )
}
