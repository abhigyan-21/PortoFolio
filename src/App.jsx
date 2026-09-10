import './App.css'
import HeroScene from './components/HeroScene'
import MusicToggle from './components/MusicToggle'
import Navigation from './components/Navigation'

function App() {
  return (
    <main className="portfolio-hero">
      <Navigation />
      <MusicToggle />
      <HeroScene />
    </main>
  )
}

export default App
