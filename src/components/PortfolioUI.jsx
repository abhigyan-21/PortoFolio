import { useEffect, useRef, useState } from 'react'
import about from '../data/about'
import certifications from '../data/certifications'
import contact from '../data/contact'
import experience from '../data/expirience'
import projects from '../data/projects'
import techStack from '../data/techStack'

const simpleScreens = {
  'tech-stack': techStack,
  experience,
  certifications,
  about,
  contact,
}

const screens = [
  ['home', 'Home'],
  ['projects', 'Projects'],
  ['tech-stack', 'Tech Stack'],
  ['experience', 'Experience'],
  ['certifications', 'Certifications'],
  ['questions-solved', 'Questions Solved'],
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

function ProjectsScreen({ onBack, selectedProject, onSelectProject }) {
  const project = projects.find((item) => item.id === selectedProject)

  if (project) {
    return (
      <div className="portfolio-detail">
        <ScreenHeader number="02" title={project.title} onBack={() => onSelectProject(null)} />
        <p className="detail-description">{project.description}</p>
        <span className="detail-year">{project.year}</span>
        <strong>TECHNOLOGIES</strong>
        <p>{project.technologies.join(' · ')}</p>
        <div className="detail-links">
          <a href={project.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
          {project.demo ? <a href={project.demo} target="_blank" rel="noreferrer">DEMO ↗</a> : <span className="detail-link-unavailable" aria-label="Live demo not available">DEMO UNAVAILABLE</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-list">
      <ScreenHeader number="02" title="PROJECTS" onBack={onBack} />
      {projects.map((project) => <button key={project.id} type="button" onClick={() => onSelectProject(project.id)}><b>›</b><span>{project.title}<small>{project.description}</small></span></button>)}
    </div>
  )
}

function CertificationsScreen({ onBack }) {
  return (
    <div className="portfolio-list">
      <ScreenHeader number="05" title="CERTIFICATIONS" onBack={onBack} />
      {certifications.map((item) => {
        const content = <><b>›</b><span>{item.title}<small>{item.issuer} · {item.issued} · {item.credentialId}</small></span></>

        return item.certificate ? (
          <a className="portfolio-list-link" key={item.id} href={item.certificate} target="_blank" rel="noreferrer">{content}</a>
        ) : (
          <div className="portfolio-list-link portfolio-list-link-unavailable" key={item.id} aria-disabled="true">{content}</div>
        )
      })}
    </div>
  )
}

function ExperienceScreen({ onBack, selectedExperience, onSelectExperience }) {
  const role = experience.find((item) => item.id === selectedExperience)

  if (role) {
    return (
      <div className="portfolio-detail">
        <ScreenHeader number="07" title={role.title} onBack={() => onSelectExperience(null)} />
        <span className="detail-year">{role.duration}</span>
        <strong>ABOUT</strong>
        <p className="detail-description">{role.description}</p>
        <div className="detail-links"><a href={role.certificate} target="_blank" rel="noreferrer">CERTIFICATE ↗</a></div>
      </div>
    )
  }

  return (
    <div className="portfolio-list">
      <ScreenHeader number="04" title="EXPERIENCE" onBack={onBack} />
      {experience.map((item) => <button key={item.id} type="button" onClick={() => onSelectExperience(item.id)}><b>›</b><span>{item.title}<small>{item.duration}</small></span></button>)}
    </div>
  )
}



function getStats(forceSync = false, signal) {
  const query = forceSync ? '?forceSync=true' : ''

  return fetch(`/api/coding-stats${query}`, { signal })
    .then((response) => {
      if (!response.ok) throw new Error('Statistics unavailable')
      return response.json()
    })
}

function QuestionsSolvedScreen({ onBack }) {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    getStats(false, controller.signal)
      .then((data) => {
        setStats(data)
        setHasError(Boolean(data.errors))
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setHasError(true)
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [])

  const handleSync = () => {
    setIsSyncing(true)

    getStats(true)
      .then((data) => {
        setStats(data)
        setHasError(Boolean(data.errors))
      })
      .catch(() => setHasError(true))
      .finally(() => setIsSyncing(false))
  }

  const value = (platform) => stats?.[platform] ?? 0

  return (
    <div className="questions-solved-screen">
      <div className="stats-heading">
        <ScreenHeader number="06" title="QUESTIONS SOLVED" onBack={onBack} />
        <button type="button" className="stats-sync" onClick={handleSync} disabled={isLoading || isSyncing} title="Sync live statistics" aria-label="Sync live statistics">
          {isSyncing ? '...' : '↻'}
        </button>
      </div>
      {isLoading ? <p className="stats-loading">SYNCING...</p> : (
        <>
          <div className="stats-total-label">TOTAL QUESTIONS</div>
          <strong className="stats-total">{stats?.totalSolved ?? 0}+</strong>
          <div className="stats-platforms">
            <div><span>LEETCODE</span><b>{value('leetcode')}</b></div>
            <div><span>GFG</span><b>{value('gfg')}</b></div>
            <div><span>CODECHEF</span><b>{stats?.codechef ?? 0}</b></div>
            <div><span>HACKERRANK</span><b>{stats?.hackerrank ?? 0}</b></div>
          </div>
          {hasError && <p className="stats-status">LIVE DATA PARTIAL</p>}
        </>
      )}
      <button type="button" onClick={onBack}>‹ HOME</button>
    </div>
  )
}

function SimpleScreen({ id, onBack }) {
  const content = simpleScreens[id]
  const categoryLabels = {
    programming: 'PROGRAMMING',
    frontend: 'FRONTEND',
    backend: 'BACKEND',
    databaseAndCloud: 'DATABASE & CLOUD',
    aiAndGenAI: 'AI & GENAI',
    tools: 'TOOLS',
  }
  const highlight = id === 'contact'
    ? <div className="contact-links"><a href="https://www.linkedin.com/in/abhigyandutta/" target="_blank" rel="noreferrer">LinkedIn ↗</a><span>·</span><a href="https://github.com/abhigyan-21" target="_blank" rel="noreferrer">GitHub ↗</a></div>
    : id === 'tech-stack'
      ? <div className="tech-stack-categories">{Object.entries(content.categories).map(([category, items]) => <div key={category}><strong>{categoryLabels[category]}</strong><p>{items.join(' · ')}</p></div>)}</div>
      : <strong>{content.highlight}</strong>

  return <div className="portfolio-simple"><ScreenHeader number={content.number} title={content.title} onBack={onBack} />{content.description && <p>{content.description}</p>}{highlight}<button type="button" onClick={onBack}>‹ HOME</button></div>
}



function PortfolioUI() {
  const [activeScreen, setActiveScreen] = useState('home')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedExperience, setSelectedExperience] = useState(null)
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

    const goBack = () => {
      if (activeScreen === 'projects' && selectedProject) {
        setSelectedProject(null)
        return
      }
      if (activeScreen === 'experience' && selectedExperience) {
        setSelectedExperience(null)
        return
      }
      if (activeScreen !== 'home') setActiveScreen('home')
    }

    const enterSelectedScreen = () => {
      if (activeScreen === 'home') setActiveScreen(screens[selectedIndex][0])
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveScreen('home')
        setSelectedIndex(0)
        setSelectedProject(null)
        setSelectedExperience(null)
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
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        enterSelectedScreen()
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goBack()
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        enterSelectedScreen()
      }
    }
    const handleConsoleControl = (event) => {
      const control = event.detail
      if (control === 'b') {
        setActiveScreen('home')
        setSelectedIndex(0)
        setSelectedProject(null)
        setSelectedExperience(null)
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
      if (control === 'left') goBack()
      if (control === 'right' || control === 'a') enterSelectedScreen()
    }
    const ui = uiRef.current
    ui.addEventListener('keydown', handleKeyDown)
    window.addEventListener('portfolio-control', handleConsoleControl)
    return () => {
      ui.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('portfolio-control', handleConsoleControl)
    }
  }, [activeScreen, selectedIndex, selectedProject, selectedExperience])

  const renderScreen = () => {
    if (activeScreen === 'home') return <HomeScreen onSelect={setActiveScreen} selectedIndex={selectedIndex} />
    if (activeScreen === 'projects') return <ProjectsScreen onBack={() => { setActiveScreen('home'); setSelectedProject(null) }} selectedProject={selectedProject} onSelectProject={setSelectedProject} />
    if (activeScreen === 'experience') return <ExperienceScreen onBack={() => { setActiveScreen('home'); setSelectedExperience(null) }} selectedExperience={selectedExperience} onSelectExperience={setSelectedExperience} />
    if (activeScreen === 'certifications') return <CertificationsScreen onBack={() => setActiveScreen('home')} />
    if (activeScreen === 'questions-solved') return <QuestionsSolvedScreen onBack={() => setActiveScreen('home')} />
    return <SimpleScreen id={activeScreen} onBack={() => setActiveScreen('home')} />
  }

  return <div className="portfolio-ui" ref={uiRef} tabIndex="0" aria-label="Portfolio navigation">{renderScreen()}</div>
}

export default PortfolioUI
