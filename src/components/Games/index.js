import React, { useState, useEffect } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPalette, 
  faExclamationTriangle, 
  faUniversalAccess, 
  faGamepad 
} from '@fortawesome/free-solid-svg-icons'

const Games = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [selectedGame, setSelectedGame] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const renderGameContent = () => {
    if (!selectedGame) return null

    switch (selectedGame) {
      case 'design-system-match':
        return (
          <div className="game-content">
            <h2>Design System Match</h2>
            <p>Match colors, components, or typography in this fun matching game.</p>
            <p className="coming-soon">Coming soon!</p>
            <button className="back-button" onClick={() => setSelectedGame(null)}>
              Back to Games
            </button>
          </div>
        )
      case 'ux-anti-patterns':
        return (
          <div className="game-content">
            <h2>UX Anti-Patterns Game</h2>
            <p>Identify bad UX decisions in a timed quiz. Test your knowledge!</p>
            <p className="coming-soon">Coming soon!</p>
            <button className="back-button" onClick={() => setSelectedGame(null)}>
              Back to Games
            </button>
          </div>
        )
      case 'accessibility-challenge':
        return (
          <div className="game-content">
            <h2>Accessibility Challenge</h2>
            <p>Find and fix accessibility flaws in website designs.</p>
            <p className="coming-soon">Coming soon!</p>
            <button className="back-button" onClick={() => setSelectedGame(null)}>
              Back to Games
            </button>
          </div>
        )
      case 'snake-game':
        return (
          <div className="game-content">
            <h2>Snake Game</h2>
            <p>Control the snake and grow without crashing.</p>
            <p className="coming-soon">Coming soon!</p>
            <button className="back-button" onClick={() => setSelectedGame(null)}>
              Back to Games
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="container games-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['G', 'a', 'm', 'e', 's']}
              idx={15}
            />
          </h1>
          <p>
            Take a break and have some fun with these design and UX-related games. 
            Challenge yourself, learn something new, and enjoy the experience!
          </p>
        </div>

        {!selectedGame ? (
          <div className="games-grid">
            <div 
              className="game-card" 
              onClick={() => setSelectedGame('design-system-match')}
            >
              <FontAwesomeIcon icon={faPalette} className="game-icon" />
              <h2>Design System Match</h2>
              <p>Match colors, components, or typography</p>
            </div>

            <div 
              className="game-card" 
              onClick={() => setSelectedGame('ux-anti-patterns')}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} className="game-icon" />
              <h2>UX Anti-Patterns</h2>
              <p>Identify bad UX decisions in a timed quiz</p>
            </div>

            <div 
              className="game-card" 
              onClick={() => setSelectedGame('accessibility-challenge')}
            >
              <FontAwesomeIcon icon={faUniversalAccess} className="game-icon" />
              <h2>Accessibility Challenge</h2>
              <p>Find and fix accessibility flaws</p>
            </div>

            <div 
              className="game-card" 
              onClick={() => setSelectedGame('snake-game')}
            >
              <FontAwesomeIcon icon={faGamepad} className="game-icon" />
              <h2>Snake Game</h2>
              <p>Control the snake and grow without crashing</p>
            </div>
          </div>
        ) : (
          renderGameContent()
        )}
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default Games 