import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import Logo from './Logo'
import './index.scss'

const Home = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  const nameArray = ['S', 'e', 'l', 'e', 'p', 'e', '.']
  const jobArray = [
    'U',
    'X',
    '/',
    'U',
    'I',
    ' ',
    'D',
    'e',
    's',
    'i',
    'g',
    'n',
    'e',
    'r',
    '.',
  ]

  useEffect(() => {
    return setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 4000)
  }, [])

  return (
    <>
      <div className="container home-page">
        <div className="text-zone">
          <h1>
            <span className={letterClass}>H</span>
            <span className={`${letterClass} _12`}>i,</span>
            <br />
            <span className={`${letterClass} _13`}>I</span>
            <span className={`${letterClass} _14`}>'m</span>
            <span className={`${letterClass} _14`}></span>
            <span className={`${letterClass} _14`}>T</span>
            <span className={`${letterClass} _14`}>s</span>
            <span className={`${letterClass} _14`}>h</span>
            <span className={`${letterClass} _14`}>e</span>
            <span className={`${letterClass} _14`}>p</span>
            <span className={`${letterClass} _14`}>o</span>
            <span className={`${letterClass} _14`}></span>
            
            <AnimatedLetters
              letterClass={letterClass}
              strArray={nameArray}
              idx={15}
            />
            <br />
            <AnimatedLetters
              letterClass={letterClass}
              strArray={jobArray}
              idx={22}
            />
          </h1>
          <h2>Design Systems | Figma | Prototyping | Wireframing | User Research</h2>
          <Link to="/contact" className="flat-button">
            CONTACT ME
          </Link>
        </div>
        <Logo />
      </div>

      <Loader type="pacman" />
    </>
  )
}

export default Home
