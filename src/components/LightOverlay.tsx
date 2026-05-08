type LightOverlayProps = {
  mode?: 'sunlit' | 'figma'
}

export function LightOverlay({ mode = 'figma' }: LightOverlayProps) {
  const modeClassName = mode === 'sunlit' ? 'light-overlay__image--sunlit' : 'light-overlay__image--figma'
  const lightImageSrc = `${import.meta.env.BASE_URL}window-light-shadow.png`

  return (
    <div id="dappled-light" aria-hidden="true">
      <img
        className={`light-overlay__image ${modeClassName}`}
        src={lightImageSrc}
        alt=""
        draggable={false}
      />
    </div>
  )
}
