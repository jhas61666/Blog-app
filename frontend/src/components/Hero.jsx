import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import heroImg from '../assets/heroImg.png'

const Hero = () => {
  return (
    <div className="px-4 md:px-0 dark:bg-gray-900 h-screen mt-0 pt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center h-auto md:h-[600px] my-10 md:my-0 gap-10 ">
        
        {/* text + buttons section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-snug">
            Explore the Latest Tech & Web Trends
          </h1>
          <p className="text-base sm:text-lg md:text-xl opacity-80 mb-6">
            Stay ahead with in-depth articles, tutorials, and insights on web
            development, digital marketing, and tech innovations
          </p>

          {/* Buttons centered on mobile */}
          <div className="flex gap-4 justify-center md:justify-start">
            <Link to={'/dashboard/write-blog'}>
              <Button className="text-base sm:text-lg px-6 py-3">
                Get Started
              </Button>
            </Link>
            <Link to={'/about'}>
              <Button
                variant="outline"
                className="border-white px-6 py-3 text-base sm:text-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* image section */}
        <div className="flex items-center justify-center mt-8 md:mt-0">
          <img
            src={heroImg}
            alt="Hero"
            className=" md:h-[580px] md:w-[670px] object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
