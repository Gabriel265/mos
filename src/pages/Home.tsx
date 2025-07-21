import React from 'react'
import { ArrowRight, Monitor, UserCog, Palette, BookOpen, Megaphone, ClipboardCheck } from 'lucide-react'
import Services from './Services'
import Tutoring from './Tutoring'
import Resources from './Resources'
import Contact from './Contact'
import FloatingWidgets from './FloatingWidgets'
import ITServices from './ITservices'
import Graphics from './Graphics'
import Business from './Business'


export default function Home() {
  const handleNavClick = (href) => {
    window.location.href = href
  }

  return (
    <div className="bg-white text-[#1a1a1a] font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] sm:min-h-screen flex items-center ">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('/images/hero-background.png')`
          }}
        />

        <svg
          className="absolute inset-y-0 left-0 h-full w-[95%] sm:w-[85%] md:w-[75%] -z-5"
          viewBox="0 0 900 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="overlayGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9e1b1b" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#c54d42" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d45645" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <path d="M0,0 L650,0 Q900,400 650,800 L0,800 Z" fill="url(#overlayGradient)" />
        </svg>

        <div className="relative max-w-3xl px-8 sm:px-12 md:px-16 lg:px-20 text-white z-10">
          <button
            onClick={() => handleNavClick('/about')}
            className="mt-4 inline-flex items-center bg-white/25 backdrop-blur-md rounded-full px-6 py-3 text-sm font-medium border border-white/40 mb-8 max-w-max hover:bg-white/30 hover:text-yellow-300 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <span className="flex items-center">
              We offer Digital services
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8 drop-shadow-lg">
            Empowering Learning &amp; Digital Solutions
            <br />
            <span className="text-transparent bg-gradient-to-r from-yellow-300 via-orange-300 to-orange-400 bg-clip-text drop-shadow-none">
              for the Cambridge Syllabus and Beyond
            </span>
          </h1>

          <button
            onClick={() => handleNavClick('/contact')}
            className="bg-gradient-to-r from-[#c54d42] to-[#9e1b1b] hover:from-[#9e1b1b] hover:to-[#c54d42] text-white px-10 py-4 rounded-full font-semibold text-lg flex items-center space-x-3 transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-xl border border-white/20 cursor-pointer mb-32 sm:mb-40"
          >
            <span>Get Started</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* components */}

      <section id="services" className="relative max-w-6xl mx-auto px-6 sm:px-8 -mt-8 sm:-mt-16 z-30 mb-16">
        <Services />
      </section>
      
      <section id="tutoring" className="section bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Tutoring />
      </section>
      <section id="it" className="section bg-gray-100 transition-colors duration-300">
        <ITServices />
      </section>
      <section id="graphics" className="section bg-gray-100 transition-colors duration-300">
        <Graphics />
      </section>
      <section id="business" className="section bg-gray-100 transition-colors duration-300">
        <Business />
      </section>
      <section id="contact" className="section bg-gray-100 transition-colors duration-300">
        <Contact />
      </section>
      <section id="contact" className="section bg-gray-100 transition-colors duration-300">
        <FloatingWidgets />
      </section>
      

    </div>
  )
}
