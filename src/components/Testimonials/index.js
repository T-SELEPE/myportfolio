import React, { useState, useEffect } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const Testimonials = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="container testimonials-page">
      <div className="text-zone">
        <h1>
          <AnimatedLetters
            letterClass={letterClass}
            strArray={['T', 'e', 's', 't', 'i', 'm', 'o', 'n', 'i', 'a', 'l', 's']}
            idx={15}
          />
        </h1>
        <p>
          Here are some recommendations written on Linkedin from former colleagues who I've had the pleasure of working with.
          These testimonials reflect my professional skills, work ethic, and collaborative approach.
        </p>
      </div>

      

      <div className="testimonials-container">
      <div className="testimonial-card">
          <div className="testimonial-content">
            <h3>Ye Wang</h3>
            <h4>Principal Product Experience Designer at Oracle</h4>
        
            <p>
            Working with Tshepo was a great experience. One of the qualities that stood out most was his ability to learn quickly and apply new knowledge with confidence. Whether it was adapting to new tools, frameworks, or workflows, Tshepo picked things up faster than most and was able to deliver good-quality work in a short amount of time. He often asked thoughtful questions, and I’m impressed by his deep understanding of the problems to solve and his passion to solve them. 
            I recommend Tshepo as a great UX engineer and I truely think he will be a valuable asset to your team! 
            </p>
           
           
          </div>
        </div>
        <div className="testimonial-card">
          <div className="testimonial-content">
            <h3>Thabang Kutumela</h3>
            <h4>Software Developer at Nintex</h4>
        
            <p>
              I had the privilege of working alongside Tshepo on Nintex's design system, where he demonstrated exceptional
              talent as a UX Engineer. Tshepo's expertise in UX design and his dedication to building scalable, efficient, and
              user-focused systems made a significant impact on our work.
            </p>
            <p>
              Tshepo's approach to design systems goes beyond creating reusable components. He truly understands their
              value in fostering consistency, efficiency, and collaboration across teams. His attention to detail ensured that
              every element we produced adhered to the highest standards, resulting in a seamless and cohesive user
              experience across our digital products.
            </p>
            <p>
              If you're looking for a UX professional who combines technical skills with a clear understanding of the human
              element of design, Tshepo is the person for the job. It was a pleasure working with him, and I can confidently
              recommend him as a true asset to any team.
            </p>
          </div>
        </div>

        <div className="testimonial-card">
          <div className="testimonial-content">
            <h3>Ntobeko Mdlalose</h3>
            <h4>Associate Technical Writer at Nintex</h4>
            
            <p>
              I've had the pleasure of working with Tshepo at Nintex, where he has consistently showcased his exceptional skills
              as a UX Engineer. His ability to design intuitive, user-focused interfaces is outstanding.
            </p>
            <p>
              Tshepo is a collaborative team player, an excellent communicator, and a joy to be around. His dedication to
              creating impactful designs and constantly learning and improving industry trends makes him an invaluable asset
              to any team.
            </p>
            <p>
              I highly recommend Tshepo to anyone seeking a skilled and innovative UX professional.
            </p>
          </div>
        </div>
      </div>

      <Loader type="pacman" />
    </div>
  )
}

export default Testimonials 