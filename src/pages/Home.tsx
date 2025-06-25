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
  id="hero"
  className="relative min-h-screen sm:min-h-[32rem] md:h-[36rem] lg:h-[40rem] bg-cover bg-center bg-fixed flex items-center justify-center text-center px-4 sm:px-6 lg:px-12 overflow-hidden"
  style={{
    backgroundImage: `
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><defs><pattern id="people" patternUnits="userSpaceOnUse" width="100" height="100"><rect fill="%23f3f4f6"/><circle cx="30" cy="30" r="15" fill="%236b7280"/><circle cx="70" cy="70" r="15" fill="%236b7280"/></pattern></defs><rect width="1200" height="400" fill="url(%23people)"/></svg>'),
      url('/images/hero-background.jpg')     
    `,
    backgroundPosition: 'center, center',
    backgroundSize: 'cover, auto',
    backgroundRepeat: 'no-repeat, repeat',
  }}
>
        {/* Animated Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 z-0 animate-pulse-slow" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-500/30 rounded-full animate-float-1"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-orange-500/20 rounded-full animate-float-2"></div>
          <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-white/40 rounded-full animate-float-3"></div>
          <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white/20 rounded-full animate-float-1"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl w-full text-white transform transition-all duration-1000 ease-out">
          <div className="space-y-6 sm:space-y-8">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-fade-in-up">
              <span className="block mb-2 sm:mb-4">Empowering Learning</span>
              <span className="block text-orange-500 drop-shadow-lg transform hover:scale-105 transition-transform duration-300">
                & Digital Solutions
              </span>
              <span className="block mt-2 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl font-normal text-gray-200">
                for the Cambridge Syllabus and Beyond
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4 animate-fade-in-up animation-delay-300">
              We offer academic support, digital skills training, and custom software & design
              services tailored to students and professionals alike.
            </p>
            
            {/* CTA Button */}
            <div className="pt-4 sm:pt-6 animate-fade-in-up animation-delay-600">
              <Link to="/contact" className="inline-block group">
                <button className="relative bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full shadow-2xl transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-orange-500/25 active:scale-95 overflow-hidden">
                  {/* Button shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></span>
                  <span className="relative z-10">Get Started</span>
                </button>
              </Link>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-scroll-indicator"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Divider */}
      <div className="h-1 sm:h-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 w-full shadow-lg"></div>
      
      {/* Sections */}
      <section id="services" className="section bg-white dark:bg-gray-950 transition-colors duration-300">
        <Services />
      </section>
      <section id="tutoring" className="section bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Tutoring />
      </section>
      <section id="resources" className="section bg-white dark:bg-gray-950 transition-colors duration-300">
        <Resources />
      </section>
      <section id="contact" className="section bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Contact />
      </section>
      
      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float-1 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes float-2 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(-180deg); }
          }
          
          @keyframes float-3 {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-15px) scale(1.2); }
          }
          
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          
          @keyframes scroll-indicator {
            0% { opacity: 0; transform: translateY(0); }
            50% { opacity: 1; }
            100% { opacity: 0; transform: translateY(12px); }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
          
          .animation-delay-300 {
            animation-delay: 0.3s;
            opacity: 0;
          }
          
          .animation-delay-600 {
            animation-delay: 0.6s;
            opacity: 0;
          }
          
          .animate-float-1 {
            animation: float-1 6s ease-in-out infinite;
          }
          
          .animate-float-2 {
            animation: float-2 8s ease-in-out infinite;
          }
          
          .animate-float-3 {
            animation: float-3 5s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
          
          .animate-scroll-indicator {
            animation: scroll-indicator 2s ease-in-out infinite;
          }
          
          /* Mobile-first responsive adjustments */
          @media (max-width: 640px) {
            .bg-fixed {
              background-attachment: scroll;
            }
          }
          
          /* Smooth scrolling for better UX */
          html {
            scroll-behavior: smooth;
          }
        `
      }} />
    </div>
  )
}