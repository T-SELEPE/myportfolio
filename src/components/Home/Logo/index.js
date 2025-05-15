import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import './index.scss'

const Logo = () => {
  const bgRef = useRef()
  const outlineLogoRef = useRef()
  const solidLogoRef = useRef()

  useEffect(() => {
    // Register the plugin
    gsap.registerPlugin(DrawSVGPlugin)

    gsap
      .timeline()
      .to(bgRef.current, {
        duration: 1,
        opacity: 1,
      })
      .from(outlineLogoRef.current, {
        drawSVG: 0,
        duration: 20,
      })

    gsap.fromTo(
      solidLogoRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        delay: 4,
        duration: 4,
      }
    )
  }, [])

  return (
    <div className="logo-container" ref={bgRef}>
      {/* T logo solid fill */}
      <svg 
        className="solid-logo"
        ref={solidLogoRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 400"
        width="100%"
        height="100%"
      >
        <path
          d="M50,50 L250,50 L250,100 L175,100 L175,350 L125,350 L125,100 L50,100 Z"
          fill="#000"
        />
      </svg>

      {/* T logo outline */}
      <svg
        width="559pt"
        height="897pt"
        version="1.0"
        viewBox="0 0 559 897"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          className="svg-container"
          transform="translate(0 457) scale(.1 -.1)"
          fill="none"
        >
          <path
            ref={outlineLogoRef}
            d="M1000 4500 L1000 4000 L500 4000 L0 4000 L0 3650 L0 3300 L2750 3300 L5500 3300 L5500 3650 L5500 4000 L5000 4000 L4500 4000 L4500 4500 L4500 5000 L3500 5000 L2500 5000 L2500 4500 L2500 4000 L2000 4000 L1500 4000 L1500 4500 L1500 5000 L1250 5000 L1000 5000 L1000 4500 Z"
          />
        </g>
      </svg>
    </div>
  )
}

export default Logo
