import { useEffect, useState } from 'react'
import PortfolioUI from './PortfolioUI'

function sendConsoleControl(control) {
  window.dispatchEvent(new CustomEvent('portfolio-control', { detail: control }))
}

function Handheld() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const clock = window.setInterval(() => setCurrentTime(new Date()), 1000)
    return () => window.clearInterval(clock)
  }, [])

  const dateTime = currentTime.toISOString()
  const displayTime = `${String(currentTime.getDate()).padStart(2, '0')}/${String(currentTime.getMonth() + 1).padStart(2, '0')} ${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`

  return (
    <div className="handheld" aria-label="Retro handheld portfolio device">
      <div className="console-top-speaker" aria-hidden="true"><i /><i /><i /><i /><i /></div> 
      <span className="console-led" aria-hidden="true" />
      <div className="console-screen">
        <div className="screen-status"><span>AD</span><span>V1.0</span><time dateTime={dateTime}>{displayTime}</time></div>
        <PortfolioUI />
      </div>
      <div className="console-controls">
        <div className="d-pad" aria-label="Directional pad">
          <span aria-hidden="true" />
          <button type="button" className="d-pad-up" onClick={() => sendConsoleControl('up')} aria-label="Move up">▲</button>
          <button type="button" className="d-pad-down" onClick={() => sendConsoleControl('down')} aria-label="Move down">▼</button>
          <button type="button" className="d-pad-left" onClick={() => sendConsoleControl('left')} aria-label="Move left">◀</button>
          <button type="button" className="d-pad-right" onClick={() => sendConsoleControl('right')} aria-label="Move right">▶</button>
        </div>
        <div className="action-buttons">
          <button type="button" onClick={() => sendConsoleControl('a')} aria-label="A button">A</button>
          <button type="button" onClick={() => sendConsoleControl('b')} aria-label="B button">B</button>
        </div>
      </div>
      <div className="console-details" aria-hidden="true"><span>SELECT</span><span>START</span></div>
    </div>
  )
}

export default Handheld
