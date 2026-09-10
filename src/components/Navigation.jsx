function SocialIcon({ type }) {
  if (type === 'github') return <span aria-hidden="true">◉</span>
  if (type === 'linkedin') return <span aria-hidden="true">in</span>
  if (type === 'email') return <span aria-hidden="true">✉</span>
  return <span aria-hidden="true">▣</span>
}

function Navigation() {
  return (
    <nav className="topbar" aria-label="Primary navigation">
      <a className="wordmark" href="#top" aria-label="Back to top">AD</a>
      <div className="social-links">
        <a href="https://github.com/abhigyan-21" target="_blank" rel="noreferrer"><SocialIcon type="github" /><span>GitHub</span></a>
        <a href="https://www.linkedin.com/in/abhigyandutta/" target="_blank" rel="noreferrer"><SocialIcon type="linkedin" /><span>LinkedIn</span></a>
        <a href="mailto:abhigyandutta@yahoo.com"><SocialIcon type="email" /><span>Email</span></a>
        <a href="/resume.pdf"><SocialIcon type="resume" /><span>Resume</span></a>
      </div>
      <button className="menu-button" type="button" aria-label="Open navigation">☰</button>
    </nav>
  )
}

export default Navigation
