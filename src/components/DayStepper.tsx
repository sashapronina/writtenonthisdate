import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

type DayStepperProps = {
  onPreviousDay: () => void
  onNextDay: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}

export function DayStepper({
  onPreviousDay,
  onNextDay,
  canGoPrevious,
  canGoNext,
}: DayStepperProps) {
  return (
    <>
      <button
        aria-label="Show previous day"
        className="stepper stepper--left"
        type="button"
        onClick={onPreviousDay}
        disabled={!canGoPrevious}
      >
        <ArrowLeftIcon aria-hidden="true" className="stepper__icon" />
      </button>
      <button
        aria-label="Show next day"
        className="stepper stepper--right"
        type="button"
        onClick={onNextDay}
        disabled={!canGoNext}
      >
        <ArrowRightIcon aria-hidden="true" className="stepper__icon" />
      </button>
    </>
  )
}
