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
import Automation from './Automation'


export default function Home() {
  const handleNavClick = (href) => {
    window.location.href = href
  }

  return (
    <div className="text-[#2D3E47] font-sans overflow-x-hidden" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Hero Section */}
      <section className="relative min-h-[95vh] sm:min-h-screen flex items-center ">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            background: `linear-gradient(rgba(160, 180, 183, 0.3), rgba(108, 125, 138, 0.4)), url('/images/hero-background.png')`,
            backgroundColor: '#A0B4B7'
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
              <stop offset="0%" stopColor="#7A969C" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#7A969C" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7A969C" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <path d="M0,0 L650,0 Q900,400 650,800 L0,800 Z" fill="url(#overlayGradient)" />
        </svg>

        <div className="relative max-w-3xl px-8 sm:px-12 md:px-16 lg:px-20 text-white z-10">
          <button
            onClick={() => handleNavClick('/about')}
            className="mt-4 inline-flex items-center backdrop-blur-md rounded-full px-6 py-3 text-sm font-medium border mb-8 max-w-max transition-all duration-300 shadow-lg cursor-pointer"
            style={{
              backgroundColor: 'rgba(245, 243, 240, 0.25)',
              borderColor: 'rgba(245, 243, 240, 0.4)',
              color: '#F5F3F0'
            }}
          >
            <span className="flex items-center">
              We offer Digital services
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8 drop-shadow-lg" style={{ color: '#F5F3F0' }}>
            Empowering Learning &amp; Digital Solutions
            <br />
            <span 
              className="drop-shadow-none"
              style={{
                background: 'linear-gradient(to right, #2D3E47, #6C7D8A, #2D3E47)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              for the Cambridge Syllabus and Beyond
            </span>
          </h1>

          <button
            onClick={() => handleNavClick('/contact')}
            className="px-10 py-4 rounded-full font-semibold text-lg flex items-center space-x-3 transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-xl border cursor-pointer mb-32 sm:mb-40"
            style={{
              background: 'linear-gradient(to right, #2D3E47, #6C7D8A, #2D3E47)',
              color: '#F5F3F0',
              borderColor: 'rgba(245, 243, 240, 0.2)'
            }}
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
      
      <section id="tutoring" className="section transition-colors duration-300" style={{ backgroundColor: '#A0B4B7' }}>
        <Tutoring />
      </section>
      <section id="it" className="section transition-colors duration-300" style={{ backgroundColor: '#E8E6E3' }}>
        <ITServices />
      </section>
      <section id="graphics" className="section transition-colors duration-300" style={{ backgroundColor: '#E8E6E3' }}>
        <Graphics />
      </section>
      <section id="business" className="section transition-colors duration-300" style={{ backgroundColor: '#E8E6E3' }}>
        <Business />
      </section>
      <section id="automation" className="section transition-colors duration-300" style={{ backgroundColor: '#E8E6E3' }}>
        <Automation/>
      </section>
      <section id="contact" className="section transition-colors duration-300" style={{ backgroundColor: '#E8E6E3' }}>
        <Contact />
      </section>
      <section id="contact" className="section transition-colors duration-300" style={{ backgroundColor: '#E8E6E3' }}>
        <FloatingWidgets />
      </section>
      

    </div>
  )
}