import { useEffect, useMemo, useState } from 'react'
import { DayStepper } from './components/DayStepper'
import { LightOverlay } from './components/LightOverlay'
import { PoemSheet } from './components/PoemSheet'
import { formatDisplayDate, shiftByDays, toDateKey } from './lib/date'
import { buildPoemsByDayKey, getAllPoems } from './lib/poems'

type LightingMode = 'sunlit' | 'figma'

function getLightingModeFromUrl(): LightingMode {
  const params = new URLSearchParams(window.location.search)
  const rawMode = params.get('lighting')?.trim().toLowerCase()
  return rawMode === 'sunlit' ? 'sunlit' : 'figma'
}

function App() {
  const [cursorDate, setCursorDate] = useState(() => new Date())
  const [pageMotion, setPageMotion] = useState<'from-left' | 'from-right' | null>(null)
  const [lightingMode, setLightingMode] = useState<LightingMode>(() => getLightingModeFromUrl())

  useEffect(() => {
    const syncModeFromUrl = () => {
      setLightingMode(getLightingModeFromUrl())
    }

    syncModeFromUrl()
    window.addEventListener('popstate', syncModeFromUrl)

    return () => {
      window.removeEventListener('popstate', syncModeFromUrl)
    }
  }, [])
  const today = useMemo(() => new Date(), [])
  const oldestArchiveDate = useMemo(
    () => new Date(today.getFullYear(), 0, 1),
    [today],
  )
  const poemsByDayKey = useMemo(() => buildPoemsByDayKey(getAllPoems()), [])
  const dateLabel = formatDisplayDate(cursorDate)
  const monthLabel = cursorDate
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase()
  const monthLabelMobile = cursorDate.toLocaleString('en-US', { month: 'short' })
  const dateIsoLocal = `${cursorDate.getFullYear()}-${String(cursorDate.getMonth() + 1).padStart(2, '0')}-${String(cursorDate.getDate()).padStart(2, '0')}`
  const dayLabel = cursorDate.getDate()
  const poemsForDay = poemsByDayKey.get(toDateKey(cursorDate)) ?? []
  const activePoem = poemsForDay[0]
  const canGoPrevious = cursorDate > oldestArchiveDate
  const canGoNext = cursorDate < today

  return (
    <main className="scene">
      <LightOverlay key={lightingMode} mode={lightingMode} />
      <header className="scene__header">
        <div className="scene__header-mobile">
          <p className="scene__header-mobile__label">Written on this day</p>
          <time className="scene__header-mobile__date" dateTime={dateIsoLocal}>
            <span className="scene__header-mobile__day">{dayLabel}</span>{' '}
            <span className="scene__header-mobile__month">{monthLabelMobile}</span>
          </time>
        </div>
        <div className="scene__header-desktop">
          <div className="scene__calendar" aria-label={dateLabel}>
            <div className="scene__calendar__stack">
              <span className="scene__calendar__month">{monthLabel}</span>
              <span className="scene__calendar__day">{dayLabel}</span>
            </div>
            <p className="scene__calendar__title">Written on this day</p>
          </div>
        </div>
      </header>

      <div className="paper-stack" aria-hidden="true">
        <div className="paper-stack__sheet paper-stack__sheet--left">
          <div className="paper-stack__placeholder">
            If we must die, let it not be like hogs
            <br />
            Hunted and penned in an inglorious spot,
            <br />
            While round us bark the mad and hungry dogs,
            <br />
            Making their mock at our accursed lot.
            <br />
            <br />
            If we must die, O let us nobly die,
            <br />
            So that our precious blood may not be shed
            <br />
            In vain; then even the monsters we defy
            <br />
            Shall be constrained to honor us though dead!
            <br />
            <br />
            Claude McKay
            <br />
            May 10, 1923
          </div>
        </div>
        <div className="paper-stack__sheet paper-stack__sheet--right">
          <div className="paper-stack__placeholder">
            If we must die, let it not be like hogs
            <br />
            Hunted and penned in an inglorious spot,
            <br />
            While round us bark the mad and hungry dogs,
            <br />
            Making their mock at our accursed lot.
            <br />
            <br />
            Though far outnumbered let us show us brave,
            <br />
            And for their thousand blows deal one death-blow.
            <br />
            What though before us lies the open grave?
            <br />
            Like men we&apos;ll face the murderous, cowardly pack,
            <br />
            Pressed to the wall, dying, but fighting back!
            <br />
            <br />
            Claude McKay
            <br />
            May 10, 1923
          </div>
        </div>
      </div>

      <div className="discarded-page" aria-hidden="true">
        <div className="discarded-page__content">
          On the seashore of endless worlds children meet.
          <br />
          The infinite sky is motionless overhead and the
          <br />
          restless water is boisterous. On the seashore
          <br />
          of endless worlds the children meet with shouts
          <br />
          and dances. They build their houses with sand,
          <br />
          and they play with empty shells. With withered
          <br />
          leaves they weave their boats and smilingly float
          <br />
          them on the vast deep.
          <br />
          <br />
          They know not how to swim, they know not how
          <br />
          to cast nets. Pearl-fishers dive for pearls,
          <br />
          merchants sail in their ships, while children
          <br />
          gather pebbles and scatter them again. They
          <br />
          seek not for hidden treasures, they know not
          <br />
          how to cast nets. The sea surges up with laughter
          <br />
          and pale gleams the smile of the sea-beach.
          <br />
          Death-dealing waves sing meaningless ballads to
          <br />
          the children, even like a mother while rocking
          <br />
          her baby&apos;s cradle. The sea plays with children,
          <br />
          and pale gleams the smile of the sea-beach.
          <br />
          <br />
          On the seashore of endless worlds children meet.
          <br />
          Tempest roams in the pathless sky, ships get
          <br />
          wrecked in the trackless water, death is abroad
          <br />
          and children play. On the seashore of endless
          <br />
          worlds is the great meeting of children.
        </div>
      </div>

      <PoemSheet
        key={toDateKey(cursorDate)}
        poem={activePoem}
        dateLabel={dateLabel}
        className={
          pageMotion === 'from-left'
            ? 'poem-sheet--nudge-from-left'
            : pageMotion === 'from-right'
              ? 'poem-sheet--nudge-from-right'
              : undefined
        }
      />

      <div className="paperclips" aria-hidden="true">
        <img className="paperclips__clip paperclips__clip--top" src="./paperclip.png" alt="" />
        <img className="paperclips__clip paperclips__clip--bottom" src="./paperclip.png" alt="" />
      </div>

      <DayStepper
        onPreviousDay={() => {
          setPageMotion('from-left')
          setCursorDate((current) => {
            if (current <= oldestArchiveDate) {
              return current
            }

            return shiftByDays(current, -1)
          })
        }}
        onNextDay={() => {
          setPageMotion('from-right')
          setCursorDate((current) => {
            if (current >= today) {
              return current
            }

            return shiftByDays(current, 1)
          })
        }}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />
    </main>
  )
}

export default App
