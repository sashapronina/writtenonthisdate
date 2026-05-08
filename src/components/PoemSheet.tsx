import { useEffect, useState } from 'react'
import type { Poem } from '../lib/poems'

type PoemSheetProps = {
  poem?: Poem
  dateLabel: string
  className?: string
}

const placeholderPoem: Pick<Poem, 'title' | 'author' | 'body' | 'approximateDate'> = {
  title: 'Untitled (placeholder)',
  author: 'Archive placeholder',
  approximateDate: true,
  body:
    "We don't have all the poems just yet, but we will. While we work on collecting poems that have an exact date, take a moment to appreciate Derek Walcott's Love after Love. Written in 1976 without an exact date\n\n" +
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

const TYPEWRITER_DURATION_MS = 3600
const TYPEWRITER_TICK_MS = 16

export function PoemSheet({ poem, dateLabel, className }: PoemSheetProps) {
  const bodyText = poem?.body ?? placeholderPoem.body
  const [visibleBody, setVisibleBody] = useState(bodyText)
  const [bodyAnimationKey, setBodyAnimationKey] = useState(0)
  const [isTypingComplete, setIsTypingComplete] = useState(true)
  const sheetClassName = className ? `poem-sheet ${className}` : 'poem-sheet'

  useEffect(() => {
    if (!bodyText) {
      const frameId = window.requestAnimationFrame(() => {
        setVisibleBody('')
        setBodyAnimationKey((key) => key + 1)
        setIsTypingComplete(true)
      })
      return () => {
        window.cancelAnimationFrame(frameId)
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const frameId = window.requestAnimationFrame(() => {
        setVisibleBody(bodyText)
        setBodyAnimationKey((key) => key + 1)
        setIsTypingComplete(true)
      })
      return () => {
        window.cancelAnimationFrame(frameId)
      }
    }

    const initialFrameId = window.requestAnimationFrame(() => {
      setVisibleBody('')
      setBodyAnimationKey((key) => key + 1)
      setIsTypingComplete(false)
    })

    const totalChars = bodyText.length
    const totalTicks = Math.max(1, Math.ceil(TYPEWRITER_DURATION_MS / TYPEWRITER_TICK_MS))
    const charsPerTick = Math.max(1, Math.ceil(totalChars / totalTicks))
    let currentCharCount = 0

    const intervalId = window.setInterval(() => {
      currentCharCount = Math.min(totalChars, currentCharCount + charsPerTick)
      setVisibleBody(bodyText.slice(0, currentCharCount))

      if (currentCharCount >= totalChars) {
        setIsTypingComplete(true)
        window.clearInterval(intervalId)
      }
    }, TYPEWRITER_TICK_MS)

    return () => {
      window.cancelAnimationFrame(initialFrameId)
      window.clearInterval(intervalId)
    }
  }, [bodyText])

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
          <div key={bodyAnimationKey} className="poem-sheet__body poem-sheet__body--fade-in">
            {visibleBody}
          </div>
          <footer
            className={`poem-sheet__footer ${
              isTypingComplete ? 'poem-sheet__footer--visible' : 'poem-sheet__footer--hidden'
            }`}
          >
            <p>{placeholderPoem.author}</p>
            <p>{dateLabel}</p>
          </footer>
        </div>
      </article>
    )
  }

  return (
    <article className={sheetClassName} aria-live="polite">
      <header className="poem-sheet__header">
        <h1 className="poem-sheet__title">{poem.title}</h1>
        {poem.approximateDate ? (
          <span className="poem-sheet__approximate-date">Approximate date</span>
        ) : null}
      </header>
      <div className="poem-sheet__scrollable">
        <div key={bodyAnimationKey} className="poem-sheet__body poem-sheet__body--fade-in">
          {visibleBody}
        </div>
        <footer
          className={`poem-sheet__footer ${
            isTypingComplete ? 'poem-sheet__footer--visible' : 'poem-sheet__footer--hidden'
          }`}
        >
          <p>{poem.author}</p>
          <p>
            {dateLabel}
            {poem.year ? `, ${poem.year}` : ''}
          </p>
        </footer>
      </div>
    </article>
  )
}
