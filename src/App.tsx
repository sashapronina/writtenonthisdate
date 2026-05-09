import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { AuthorPortrait } from './components/AuthorPortrait'
import { DayStepper } from './components/DayStepper'
import { LightOverlay } from './components/LightOverlay'
import { PoemSheet } from './components/PoemSheet'
import { Toast } from './components/Toast'
import { formatDisplayDate, mobilePoemSheetTiltDeg, shiftByDays, toDateKey } from './lib/date'
import { buildPoemsByDayKey, getAllPoems } from './lib/poems'

type LightingMode = 'sunlit' | 'figma'

function getLightingModeFromUrl(): LightingMode {
  const params = new URLSearchParams(window.location.search)
  const rawMode = params.get('lighting')?.trim().toLowerCase()
  return rawMode === 'sunlit' ? 'sunlit' : 'figma'
}

const SWIPE_NAV_RATIO = 1.12
const SWIPE_ARM_PX = 14

const MOBILE_LAYOUT_MQ = '(max-width: 800px)'
const FUTURE_DAY_TOAST =
  'Come back tomorrow. Poems are released on the day. But you can go back into the archive of the previous days.'

function useMobileLayout() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_LAYOUT_MQ).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_LAYOUT_MQ)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

function App() {
  const [cursorDate, setCursorDate] = useState(() => new Date())
  const [pageMotion, setPageMotion] = useState<'from-left' | 'from-right' | null>(null)
  const [lightingMode, setLightingMode] = useState<LightingMode>(() => getLightingModeFromUrl())
  const [swipePx, setSwipePx] = useState(0)
  const swipePxRef = useRef(0)
  const isMobileLayout = useMobileLayout()
  const [toastOpen, setToastOpen] = useState(false)
  const [carouselNudge, setCarouselNudge] = useState(0)
  const carouselTrackRef = useRef<HTMLDivElement>(null)
  const currentSheetWrapRef = useRef<HTMLDivElement>(null)
  const swipeDragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    horizontal: boolean | null
  } | null>(null)

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

  const prevDate = useMemo(
    () => (canGoPrevious ? shiftByDays(cursorDate, -1) : null),
    [canGoPrevious, cursorDate],
  )
  const nextDate = useMemo(
    () => (canGoNext ? shiftByDays(cursorDate, 1) : null),
    [canGoNext, cursorDate],
  )
  const prevPoem = prevDate ? (poemsByDayKey.get(toDateKey(prevDate)) ?? [])[0] : undefined
  const nextPoem = nextDate ? (poemsByDayKey.get(toDateKey(nextDate)) ?? [])[0] : undefined
  const prevLabel = prevDate ? formatDisplayDate(prevDate) : ''
  const nextLabel = nextDate ? formatDisplayDate(nextDate) : ''

  const closeToast = useCallback(() => setToastOpen(false), [])

  useLayoutEffect(() => {
    if (!isMobileLayout) {
      setCarouselNudge(0)
      return
    }

    const track = carouselTrackRef.current
    const cur = currentSheetWrapRef.current
    if (!track || !cur) return

    const measure = () => {
      if (swipePxRef.current !== 0) return
      const rect = cur.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const target = window.innerWidth / 2
      setCarouselNudge((prev) => prev + (target - center))
    }

    measure()
    const ro = new ResizeObserver(() => measure())
    ro.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [isMobileLayout, cursorDate, canGoPrevious, canGoNext, activePoem])

  const goPreviousDay = () => {
    setPageMotion('from-left')
    setCursorDate((current) => {
      if (current <= oldestArchiveDate) return current
      return shiftByDays(current, -1)
    })
  }

  const goNextDay = () => {
    setPageMotion('from-right')
    setCursorDate((current) => {
      if (current >= today) return current
      return shiftByDays(current, 1)
    })
  }

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

      <div
        className={[
          activePoem?.portraitUrl ? 'poem-focus poem-focus--with-portrait' : 'poem-focus',
          isMobileLayout ? 'poem-focus--mobile' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={
          {
            '--poem-swipe-x': isMobileLayout ? '0px' : `${swipePx}px`,
          } as CSSProperties
        }
        onPointerDown={(e) => {
          if (e.button !== 0) return
          swipeDragRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            horizontal: null,
          }
        }}
        onPointerMove={(e) => {
          const drag = swipeDragRef.current
          if (!drag || drag.pointerId !== e.pointerId) return

          const dx = e.clientX - drag.startX
          const dy = e.clientY - drag.startY

          if (drag.horizontal === null) {
            if (Math.abs(dx) < SWIPE_ARM_PX && Math.abs(dy) < SWIPE_ARM_PX) return
            if (Math.abs(dy) > Math.abs(dx) * SWIPE_NAV_RATIO) {
              swipeDragRef.current = null
              return
            }
            drag.horizontal = true
            ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
          }

          if (!drag.horizontal) return

          e.preventDefault()
          let x = dx
          if (dx > 0 && !canGoPrevious) x = dx * 0.22
          if (dx < 0 && !canGoNext) x = dx * 0.22
          swipePxRef.current = x
          setSwipePx(x)
        }}
        onPointerUp={(e) => {
          const drag = swipeDragRef.current
          if (!drag || drag.pointerId !== e.pointerId) return
          swipeDragRef.current = null
          try {
            ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
          } catch {
            /* already released */
          }

          const endedX = swipePxRef.current
          if (drag.horizontal) {
            const threshold = Math.min(80, Math.max(56, window.innerWidth * 0.16))
            if (endedX > threshold && canGoPrevious) goPreviousDay()
            else if (endedX < -threshold && canGoNext) goNextDay()
          }
          swipePxRef.current = 0
          setSwipePx(0)
        }}
        onPointerCancel={(e) => {
          const drag = swipeDragRef.current
          if (!drag || drag.pointerId !== e.pointerId) return
          swipeDragRef.current = null
          try {
            ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
          } catch {
            /* */
          }
          swipePxRef.current = 0
          setSwipePx(0)
        }}
      >
        {isMobileLayout ? (
          <div className="poem-carousel__viewport">
            <div
              className="poem-carousel__nudge"
              style={{ transform: `translateX(${carouselNudge}px)` }}
            >
              <div
                ref={carouselTrackRef}
                className="poem-carousel__track"
                style={{ transform: `translateX(${swipePx}px)` }}
              >
                {canGoPrevious && prevDate ? (
                  <div className="poem-carousel__cell" aria-hidden="true">
                    <PoemSheet
                      key={toDateKey(prevDate)}
                      poem={prevPoem}
                      dateLabel={prevLabel}
                      className="poem-sheet--carousel-peer"
                      tiltDeg={mobilePoemSheetTiltDeg(prevDate)}
                    />
                  </div>
                ) : null}
                <div
                  ref={currentSheetWrapRef}
                  className="poem-carousel__cell poem-carousel__cell--current"
                >
                  <PoemSheet
                    key={toDateKey(cursorDate)}
                    poem={activePoem}
                    dateLabel={dateLabel}
                    tiltDeg={mobilePoemSheetTiltDeg(cursorDate)}
                    className={
                      pageMotion === 'from-left'
                        ? 'poem-sheet--nudge-from-left'
                        : pageMotion === 'from-right'
                          ? 'poem-sheet--nudge-from-right'
                          : undefined
                    }
                  />
                </div>
                {canGoNext && nextDate ? (
                  <div className="poem-carousel__cell" aria-hidden="true">
                    <PoemSheet
                      key={toDateKey(nextDate)}
                      poem={nextPoem}
                      dateLabel={nextLabel}
                      className="poem-sheet--carousel-peer"
                      tiltDeg={mobilePoemSheetTiltDeg(nextDate)}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <>
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
            {activePoem?.portraitUrl ? (
              <AuthorPortrait author={activePoem.author} imageUrl={activePoem.portraitUrl} />
            ) : null}
          </>
        )}
      </div>

      <div className="paperclips" aria-hidden="true">
        <img
          className="paperclips__clip paperclips__clip--top"
          src={`${import.meta.env.BASE_URL}paperclip.png`}
          alt=""
        />
        <img
          className="paperclips__clip paperclips__clip--bottom"
          src={`${import.meta.env.BASE_URL}paperclip.png`}
          alt=""
        />
      </div>

      <DayStepper
        onPreviousDay={goPreviousDay}
        onNextDay={goNextDay}
        useInteractiveNextBlock={isMobileLayout}
        onNextBlocked={() => setToastOpen(true)}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />

      <Toast
        message={FUTURE_DAY_TOAST}
        open={toastOpen && isMobileLayout}
        onClose={closeToast}
      />
    </main>
  )
}

export default App
