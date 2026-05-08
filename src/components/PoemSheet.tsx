import { useEffect, useState } from 'react'
import type { Poem } from '../lib/poems'

type PoemSheetProps = {
  poem?: Poem
  dateLabel: string
  className?: string
}

const placeholderPoem: Pick<Poem, 'title' | 'author' | 'body'> = {
  title: 'Untitled (placeholder)',
  author: 'Archive placeholder',
  body:
    'This is placeholder text for dates where we do not have a poem yet.\n\n' +
    'Use this page to validate long-form rhythm, line wrapping, and scroll behavior.\n' +
    'The final poem text can be swapped in later without layout changes.\n\n' +
    'The quick brown fox jumps over the lazy dog.\n' +
    'Sphinx of black quartz, judge my vow.\n' +
    'Pack my box with five dozen liquor jugs.\n\n' +
    'Until an authentic entry is added to the archive, this placeholder keeps\n' +
    'the paper presentation realistic and testable across dates.',
}

const TYPEWRITER_DURATION_MS = 800
const TYPEWRITER_TICK_MS = 16

export function PoemSheet({ poem, dateLabel, className }: PoemSheetProps) {
  const bodyText = poem?.body ?? placeholderPoem.body
  const [visibleBody, setVisibleBody] = useState(bodyText)
  const sheetClassName = className ? `poem-sheet ${className}` : 'poem-sheet'

  useEffect(() => {
    if (!bodyText) {
      const frameId = window.requestAnimationFrame(() => {
        setVisibleBody('')
      })
      return () => {
        window.cancelAnimationFrame(frameId)
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const frameId = window.requestAnimationFrame(() => {
        setVisibleBody(bodyText)
      })
      return () => {
        window.cancelAnimationFrame(frameId)
      }
    }

    const initialFrameId = window.requestAnimationFrame(() => {
      setVisibleBody('')
    })

    const totalChars = bodyText.length
    const totalTicks = Math.max(1, Math.ceil(TYPEWRITER_DURATION_MS / TYPEWRITER_TICK_MS))
    const charsPerTick = Math.max(1, Math.ceil(totalChars / totalTicks))
    let currentCharCount = 0

    const intervalId = window.setInterval(() => {
      currentCharCount = Math.min(totalChars, currentCharCount + charsPerTick)
      setVisibleBody(bodyText.slice(0, currentCharCount))

      if (currentCharCount >= totalChars) {
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
        </header>
        <div className="poem-sheet__scrollable">
          <div className="poem-sheet__body">{visibleBody}</div>
          <footer className="poem-sheet__footer">
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
      </header>
      <div className="poem-sheet__scrollable">
        <div className="poem-sheet__body">{visibleBody}</div>
        <footer className="poem-sheet__footer">
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
