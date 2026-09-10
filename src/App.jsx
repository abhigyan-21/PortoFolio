import './App.css'
import HeroScene from './components/HeroScene'
import MusicToggle from './components/MusicToggle'
import Navigation from './components/Navigation'
import SEO from './components/SEO'

function App() {
  return (
    <main className="portfolio-hero">
      <SEO />
      <Navigation />
      <MusicToggle />
      <HeroScene />
    </main>
  )
}

export default App
