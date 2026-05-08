type LightOverlayProps = {
  mode: 'sunlit' | 'figma'
}

export function LightOverlay({ mode }: LightOverlayProps) {
  if (mode === 'figma') {
    return (
      <div className="figma-light" aria-hidden="true">
        <div className="figma-light__streaks" />
        <div className="figma-light__beam" />
        <div className="figma-light__shadow" />
        <div className="figma-light__grain" />
      </div>
    )
  }

  return (
    <div id="dappled-light" aria-hidden="true">
      <div id="glow" />
      <div id="glow-bounce" />
      <div className="perspective">
        <div id="blinds">
          <div className="shutters">
            <div className="shutter" />
            <div className="shutter" />
            <div className="shutter" />
            <div className="shutter" />
            <div className="shutter" />
            <div className="shutter" />
            <div className="shutter" />
          </div>
          <div className="vertical">
            <div className="bar" />
            <div className="bar" />
          </div>
        </div>
      </div>
      <div id="progressive-blur">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}
