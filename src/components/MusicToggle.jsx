import { useEffect, useRef, useState } from 'react'

const notes = [220, 277.18, 329.63, 277.18, 246.94, 329.63, 369.99, 329.63]
const customMusicPath = '/music.mp3'

function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => () => {
    audioRef.current?.stop()
  }, [])

  function playDefaultNotes() {
    const context = new AudioContext()
    const gain = context.createGain()
    const loopLength = 2.4
    let loopId

    gain.gain.value = 0.045
    gain.connect(context.destination)

    const playLoop = () => {
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator()
        const noteGain = context.createGain()
        const start = context.currentTime + index * 0.3

        oscillator.type = 'triangle'
        oscillator.frequency.value = frequency
        noteGain.gain.setValueAtTime(0, start)
        noteGain.gain.linearRampToValueAtTime(0.8, start + 0.02)
        noteGain.gain.exponentialRampToValueAtTime(0.001, start + 0.27)
        oscillator.connect(noteGain)
        noteGain.connect(gain)
        oscillator.start(start)
        oscillator.stop(start + 0.28)
      })
      loopId = window.setTimeout(playLoop, loopLength * 1000)
    }

    playLoop()
    return {
      stop: () => {
        window.clearTimeout(loopId)
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08)
        window.setTimeout(() => context.close(), 100)
      },
    }
  }

  async function toggleMusic() {
    if (audioRef.current) {
      audioRef.current.stop()
      audioRef.current = null
      setIsPlaying(false)
      return
    }

    const customAudio = new Audio(customMusicPath)
    customAudio.loop = true
    customAudio.volume = 0.35

    try {
      await customAudio.play()
      audioRef.current = {
        stop: () => {
          customAudio.pause()
          customAudio.currentTime = 0
        },
      }
    } catch {
      audioRef.current = playDefaultNotes()
    }
    setIsPlaying(true)
  }

  return (
    <button
      className={`music-toggle${isPlaying ? ' is-playing' : ''}`}
      type="button"
      aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
      aria-pressed={isPlaying}
      onClick={toggleMusic}
    >
      <span className="tape-reel tape-reel-left" aria-hidden="true" />
      <span className="tape-reel tape-reel-right" aria-hidden="true" />
      <span className="tape-window" aria-hidden="true"><i /><i /></span>
      <span className="tape-label">{isPlaying ? 'ON' : 'PLAY'}</span>
      <span className="tape-light" aria-hidden="true" />
    </button>
  )
}

export default MusicToggle