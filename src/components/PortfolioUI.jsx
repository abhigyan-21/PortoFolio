import { useEffect, useRef, useState } from 'react'
import projects from '../data/projects'

const screens = [
  ['home', 'Home'],
  ['projects', 'Projects'],
  ['tech-stack', 'Tech Stack'],
  ['experience', 'Experience'],
  ['certifications', 'Certifications'],
  ['about', 'About'],
  ['contact', 'Contact'],
]

function ScreenHeader({ number, title, onBack }) {
  return (
    <div className="portfolio-screen-header">
      {onBack && <button type="button" className="screen-back" onClick={onBack} aria-label="Back">‹</button>}
      <span>{number}. {title}</span>
    </div>
  )
}

function HomeScreen({ onSelect, selectedIndex }) {
  const menuRef = useRef(null)

  useEffect(() => {
    menuRef.current?.children[selectedIndex]?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  return (
    <div className="portfolio-home">
      <div className="portfolio-ready">READY.</div>
      <p>Explore the work,<br />then stay curious.</p>
      <div className="home-menu" ref={menuRef}>
        {screens.map(([id, label], index) => (
          <button className={selectedIndex === index ? 'is-selected' : ''} key={id} type="button" onClick={() => onSelect(id)}>
            <span>0{index + 1}</span>{label}<b>›</b>
          </button>
        ))}
      </div>
    </div>
  )
}

function ProjectsScreen({ onBack }) {
  const [selected, setSelected] = useState(null)
  const project = projects.find((item) => item.id === selected)

  if (project) {
    return (
      <div className="portfolio-detail">
        <ScreenHeader number="02" title={project.title} onBack={() => setSelected(null)} />
        <p className="detail-description">{project.description}</p>
        <span className="detail-year">{project.year}</span>
        <strong>TECHNOLOGIES</strong>
        <p>{project.technologies.join(' · ')}</p>
        <div className="detail-links"><a href={project.github} target="_blank" rel="noreferrer">GITHUB ↗</a><a href={project.demo} target="_blank" rel="noreferrer">DEMO ↗</a></div>
      </div>
    )
  }

  return (
    <div className="portfolio-list">
      <ScreenHeader number="02" title="PROJECTS" onBack={onBack} />
      {projects.map((project) => <button key={project.id} type="button" onClick={() => setSelected(project.id)}><b>›</b><span>{project.title}<small>{project.description}</small></span></button>)}
    </div>
  )
}

function SimpleScreen({ id, onBack }) {
  const content = {
    'tech-stack': ['03', 'TECH STACK', 'Java · Python · React', 'Node.js · MongoDB · Git'],
    experience: ['04', 'EXPERIENCE', '2025 - Present', 'Software Engineering Intern'],
    certifications: ['05', 'CERTIFICATIONS', 'AWS Cloud Practitioner', 'Google GenAI Essentials'],
    about: ['06', 'ABOUT', 'Curious builder who loves', 'turning ideas into useful tools.'],
    contact: ['07', 'CONTACT', 'hello@example.com', 'LinkedIn · GitHub'],
  }[id]

  return <div className="portfolio-simple"><ScreenHeader number={content[0]} title={content[1]} onBack={onBack} /><p>{content[2]}</p><strong>{content[3]}</strong><button type="button" onClick={onBack}>‹ HOME</button></div>
}

function PortfolioUI() {
  const [activeScreen, setActiveScreen] = useState('home')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const uiRef = useRef(null)

  useEffect(() => {
    if (uiRef.current) uiRef.current.scrollTop = 0
  }, [activeScreen])

  useEffect(() => {
    const scrollScreen = (direction) => {
      uiRef.current?.scrollBy({
        top: direction * 28,
        behavior: 'smooth',
      })
    }

    const moveSelection = (direction) => {
      setSelectedIndex((index) => (index + direction + screens.length) % screens.length)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveScreen('home')
        setSelectedIndex(0)
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        scrollScreen(1)
        if (activeScreen === 'home') moveSelection(1)
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        scrollScreen(-1)
        if (activeScreen === 'home') moveSelection(-1)
      }
      if (activeScreen !== 'home') return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        moveSelection(1)
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        moveSelection(-1)
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        setActiveScreen(screens[selectedIndex][0])
      }
    }
    const handleConsoleControl = (event) => {
      const control = event.detail
      if (control === 'b') {
        setActiveScreen('home')
        setSelectedIndex(0)
        return
      }
      if (control === 'up') {
        scrollScreen(-1)
        if (activeScreen === 'home') moveSelection(-1)
      }
      if (control === 'down') {
        scrollScreen(1)
        if (activeScreen === 'home') moveSelection(1)
      }
      if (activeScreen !== 'home') return
      if (control === 'left') moveSelection(-1)
      if (control === 'right') moveSelection(1)
      if (control === 'a') setActiveScreen(screens[selectedIndex][0])
    }
    const ui = uiRef.current
    ui.addEventListener('keydown', handleKeyDown)
    window.addEventListener('portfolio-control', handleConsoleControl)
    return () => {
      ui.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('portfolio-control', handleConsoleControl)
    }
  }, [activeScreen, selectedIndex])

  const renderScreen = () => {
    if (activeScreen === 'home') return <HomeScreen onSelect={setActiveScreen} selectedIndex={selectedIndex} />
    if (activeScreen === 'projects') return <ProjectsScreen onBack={() => setActiveScreen('home')} />
    return <SimpleScreen id={activeScreen} onBack={() => setActiveScreen('home')} />
  }

  return <div className="portfolio-ui" ref={uiRef} tabIndex="0" aria-label="Portfolio navigation">{renderScreen()}</div>
}

export default PortfolioUI
