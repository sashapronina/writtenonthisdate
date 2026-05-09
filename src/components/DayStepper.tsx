import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

type DayStepperProps = {
  onPreviousDay: () => void
  onNextDay: () => void
  /** When true (mobile), the next control stays focusable and shows `onNextBlocked` instead of native disabled. */
  useInteractiveNextBlock?: boolean
  onNextBlocked?: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}

export function DayStepper({
  onPreviousDay,
  onNextDay,
  useInteractiveNextBlock = false,
  onNextBlocked,
  canGoPrevious,
  canGoNext,
}: DayStepperProps) {
  const nextIsSoftBlocked = !canGoNext && useInteractiveNextBlock

  return (
    <nav className="day-stepper" aria-label="Day navigation">
      <button
        type="button"
        className="day-stepper__btn day-stepper__btn--prev"
        onClick={onPreviousDay}
        disabled={!canGoPrevious}
        aria-label="Show previous day"
      >
        <ArrowLeftIcon aria-hidden="true" className="day-stepper__icon" />
        <span className="day-stepper__label">Previous day</span>
      </button>
      <button
        type="button"
        className={`day-stepper__btn day-stepper__btn--next${nextIsSoftBlocked ? ' day-stepper__btn--next-blocked' : ''}`}
        onClick={() => {
          if (nextIsSoftBlocked) {
            onNextBlocked?.()
            return
          }
          onNextDay()
        }}
        disabled={!canGoNext && !nextIsSoftBlocked}
        aria-label={
          canGoNext ? 'Show next day' : 'Wait until tomorrow for the next poem'
        }
        aria-disabled={!canGoNext}
      >
        <span className="day-stepper__label">
          {canGoNext ? 'Next day' : 'Wait till tomorrow'}
        </span>
        <ArrowRightIcon aria-hidden="true" className="day-stepper__icon" />
      </button>
    </nav>
  )
}
