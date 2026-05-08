type LightOverlayProps = {
  mode?: 'sunlit' | 'figma'
}

export function LightOverlay({ mode = 'figma' }: LightOverlayProps) {
  const modeClassName = mode === 'sunlit' ? 'light-overlay__image--sunlit' : 'light-overlay__image--figma'

  return (
    <div id="dappled-light" aria-hidden="true">
      <img
        className={`light-overlay__image ${modeClassName}`}
        src="/window-light-shadow.png"
        alt=""
        draggable={false}
      />
    </div>
  )
}
