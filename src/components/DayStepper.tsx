import { useEffect, useState } from 'react'
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
  const [showNextTip, setShowNextTip] = useState(false)

  useEffect(() => {
    if (canGoNext) setShowNextTip(false)
  }, [canGoNext])

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
      <span
        className="stepper-host stepper-host--right"
        onPointerEnter={() => {
          if (!canGoNext) setShowNextTip(true)
        }}
        onPointerLeave={() => setShowNextTip(false)}
      >
        {showNextTip && !canGoNext ? (
          <>
            <span className="stepper-host__hover-catcher" aria-hidden />
            <span className="stepper-host__tooltip" id="stepper-next-tip" role="tooltip">
              Wait till tomorrow to see
              <br />
              the next poem
            </span>
          </>
        ) : null}
        <span className="stepper-host__btn-wrap">
          <button
            aria-label="Show next day"
            className="stepper stepper--nested"
            type="button"
            onClick={onNextDay}
            disabled={!canGoNext}
            aria-describedby={
              !canGoNext && showNextTip ? 'stepper-next-tip' : undefined
            }
          >
            <ArrowRightIcon aria-hidden="true" className="stepper__icon" />
          </button>
        </span>
      </span>
    </>
  )
}
