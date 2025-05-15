import { useEffect, useState } from 'react'
import {
  faAngular,
  faCss3,
  faGitAlt,
  faHtml5,
  faJsSquare,
  faFigma,
  faSquareDribbble,
} from '@fortawesome/free-brands-svg-icons'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.scss'

const About = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  useEffect(() => {
    return setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)
  }, [])

  return (
    <>
      <div className="container about-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['A', 'b', 'o', 'u', 't', ' ', 'm', 'e']}
              idx={15}
            />
          </h1>
          <p>
          I am a UX Designer with experience collaborating with cross-functional teams across multiple countries to achieve shared goals. My expertise includes working with design systems, designing, Prototyping, and wireframing reusable components in Figma, which I seamlessly translate into functional HTML, CSS, and Javascript (React—Typescript). My knowledge of frontend languages has been a significant advantage, enabling me to bridge the gap between design and engineering teams effectively.
With a strong eye for design aesthetics and technical proficiency, I create visually engaging, user-friendly websites and applications tailored to user needs. My passion for continuous learning drives me to stay updated with emerging skills and technologies to deliver impactful solutions
          </p>
          <p align="LEFT">
           I taught myself some front-end development skills so that I can be more empathetic towards developers and understand technical constraints much better.
          </p>
          <p>
            If I had to enter a leave a room which I have met you for the first time, the 3 words you'd use to describe me is Humble, Fun & Spontaneous
          </p>
        </div>

        <div className="stage-cube-cont">
          <div className="cubespinner">
            <div className="face1">
              <FontAwesomeIcon icon={faSquareDribbble} color="#DD0031" />
            </div>
            <div className="face2">
              <FontAwesomeIcon icon={faHtml5} color="#F06529" />
            </div>
            <div className="face3">
              <FontAwesomeIcon icon={faCss3} color="#28A4D9" />
            </div>
            <div className="face4">
              <FontAwesomeIcon icon={faFigma} color="#5ED4F4" />
            </div>
            <div className="face5">
              <FontAwesomeIcon icon={faJsSquare} color="#EFD81D" />
            </div>
            <div className="face6">
              <FontAwesomeIcon icon={faGitAlt} color="#EC4D28" />
            </div>
          </div>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default About
