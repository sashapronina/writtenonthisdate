import type { Poem } from '../lib/poems'

type PoemSheetProps = {
  poem?: Poem
  dateLabel: string
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

export function PoemSheet({ poem, dateLabel }: PoemSheetProps) {
  if (!poem) {
    return (
      <article className="poem-sheet" aria-live="polite">
        <header className="poem-sheet__header">
          <h1 className="poem-sheet__title">{placeholderPoem.title}</h1>
        </header>
        <div className="poem-sheet__scrollable">
          <div className="poem-sheet__body">{placeholderPoem.body}</div>
          <footer className="poem-sheet__footer">
            <p>{placeholderPoem.author}</p>
            <p>{dateLabel}</p>
          </footer>
        </div>
      </article>
    )
  }

  return (
    <article className="poem-sheet" aria-live="polite">
      <header className="poem-sheet__header">
        <h1 className="poem-sheet__title">{poem.title}</h1>
      </header>
      <div className="poem-sheet__scrollable">
        <div className="poem-sheet__body">{poem.body}</div>
        <footer className="poem-sheet__footer">
          <p>{poem.author}</p>
          <p>
            {dateLabel}
            {poem.year ? ` ${poem.year}` : ''}
          </p>
        </footer>
      </div>
    </article>
  )
}
