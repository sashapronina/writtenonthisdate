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
  const poemsForDay = poemsByDayKey.get(toDateKey(cursorDate)) ?? []
  const activePoem = poemsForDay[0]
  const canGoPrevious = cursorDate > oldestArchiveDate
  const canGoNext = cursorDate < today

  return (
    <main className="scene">
      <LightOverlay key={lightingMode} mode={lightingMode} />
      <div className="scene__lighting-debug">{lightingMode.toUpperCase()}</div>
      <header className="scene__header">
        <p className="scene__label">Written on this day</p>
        <div className="scene__date-pill">{dateLabel}</div>
      </header>

      <div className="paper-stack" aria-hidden="true">
        <div className="paper-stack__sheet paper-stack__sheet--left" />
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
            <br />
            Claude McKay
            <br />
            May 10
          </div>
        </div>
      </div>

      <PoemSheet poem={activePoem} dateLabel={dateLabel} />
      <DayStepper
        onPreviousDay={() => {
          setCursorDate((current) => {
            if (current <= oldestArchiveDate) {
              return current
            }

            return shiftByDays(current, -1)
          })
        }}
        onNextDay={() => {
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
