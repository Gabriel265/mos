import React from 'react'
import { Link } from 'react-router-dom'
import Services from './Services'
import Tutoring from './Tutoring'
import Resources from './Resources'
import Contact from './Contact'

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Hero Section */}
<section
  className="relative h-[28rem] sm:h-[32rem] bg-cover bg-center flex items-center justify-center text-center px-6 lg:px-12"
  style={{
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><defs><pattern id="people" patternUnits="userSpaceOnUse" width="100" height="100"><rect fill="%23f3f4f6"/><circle cx="30" cy="30" r="15" fill="%236b7280"/><circle cx="70" cy="70" r="15" fill="%236b7280"/></pattern></defs><rect width="1200" height="400" fill="url(%23people)"/></svg>')`
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/60 z-0" />

  {/* Content */}
  <div className="relative z-10 max-w-6xl text-white">
    <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
      Empowering Learning <br className="hidden sm:block" />
      <span className="text-orange-500">& Digital Solutions</span><br />
      for the Cambridge Syllabus and Beyond.
    </h1>
    <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
      We offer academic support, digital skills training, and custom software & design
      services tailored to students and professionals alike.
    </p>
    <Link to="/contact">
      <button className="btn btn-accent text-white text-lg px-8 py-3 shadow-lg hover:bg-orange-600 transition">
        Get Started
      </button>
    </Link>
  </div>
</section>


      {/* Divider (optional line) */}
      <div className="h-2 bg-orange-500 w-full" />

      {/* Sections */}
      <section id="services" className="section bg-white dark:bg-gray-950">
        <Services />
      </section>

      <section id="tutoring" className="section bg-gray-50 dark:bg-gray-900">
        <Tutoring />
      </section>

      <section id="resources" className="section bg-white dark:bg-gray-950">
        <Resources />
      </section>

      <section id="contact" className="section bg-gray-50 dark:bg-gray-900">
        <Contact />
      </section>
    </div>
  )
}
