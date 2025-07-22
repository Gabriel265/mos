import React, { useState, useEffect } from 'react'
import { Phone, UserCheck, Star, ArrowRight, BookOpen, Award, Clock, Users, CheckCircle, MessageCircle, Mail } from 'lucide-react'
import CalendlyDialog from '@/components/shared/CalendlyDialog'

const TutoringServiceSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('online')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const subjects = [
    { name: 'Maths' },
    { name: 'Physics' },
    { name: 'Chemistry' },
    { name: 'Biology' },
    { name: 'English' },
    { name: 'History' },
    { name: 'Geography' },
    { name: 'Economics' },
    { name: 'Business Studies' },
    { name: 'Computer Science' },
    { name: 'French' },
  ]

  const handleContactClick = () => {
    window.location.href = 'tel:+447301096908'
  }

  return (
    <>
      
      

      <div className="relative overflow-hidden bg-gradient-to-br from-[#b8934d]/5 via-orange-50 to-white min-h-screen">
        {/* Enhanced Decorative Elements */}
        <div className="absolute top-4 sm:top-10 left-4 sm:left-10 grid grid-cols-4 sm:grid-cols-7 gap-1 sm:gap-2 opacity-20 animate-pulse">
          {Array.from({ length: window.innerWidth < 640 ? 16 : 28 }, (_, i) => (
            <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#b8934d] rounded-full transform hover:scale-150 transition-transform duration-300"></div>
          ))}
        </div>

        <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2 opacity-20 animate-pulse delay-700">
          {Array.from({ length: window.innerWidth < 640 ? 12 : 16 }, (_, i) => (
            <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#b8934d] rounded-full transform hover:scale-150 transition-transform duration-300"></div>
          ))}
        </div>

        {/* Responsive Geometric Shapes */}
        <div className="absolute top-0 right-0 w-32 sm:w-48 lg:w-96 h-full bg-gradient-to-bl from-[#b8934d] to-[#b8934d] transform skew-x-12 translate-x-16 sm:translate-x-24 lg:translate-x-48 opacity-80"></div>
        <div className="absolute top-10 sm:top-20 right-8 sm:right-20 w-32 sm:w-48 lg:w-80 h-32 sm:h-48 lg:h-80 bg-white/20 transform skew-x-6 rounded-full blur-sm"></div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
          {/* Trust Indicators */}
          <div className={`text-center mb-8 sm:mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm sm:text-base text-gray-600 bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-8 py-2 sm:py-3 mx-auto max-w-fit shadow-lg">
              <div className="flex items-center">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#b8934d] mr-2" />
                <span className="font-semibold">5+ Years Experience</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#b8934d] mr-2" />
                <span className="font-semibold">500+ Students</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2 fill-current" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto gap-8 lg:gap-12">
            {/* Left Content - Enhanced */}
            <div className={`w-full lg:w-1/2 space-y-6 sm:space-y-8 text-center lg:text-left transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              
              {/* CTA Button - Mobile Optimized */}
                
              <CalendlyDialog
                      trigger={
              <button 
                className="inline-flex items-center bg-gradient-to-r from-[#0d1a2e] to-[#0d1a2e] hover:from-[#b8934d] hover:to-[#b8934d] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                aria-label="Schedule a free demo tutoring session"
              >
                <Star className="w-4 h-4 mr-2 fill-current animate-pulse" />
                <span className="hidden sm:inline">Schedule Session</span>
                <span className="sm:hidden">Schedule Session</span>
              </button>

            }
                    />

              {/* Headline - Responsive Typography */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#0d1a2e] leading-tight">
                <span className="block">Private</span>
                <span className="block bg-gradient-to-r from-[#0d1a2e] to-[#0d1a2e] bg-clip-text text-transparent">Tutoring</span>
              </h1>

              {/* Enhanced Description */}
              <div className="space-y-4 sm:space-y-6">
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Expert tutoring in all Cambridge curriculum subjects from secondary school to university level with personalized attention and proven results.
                </p>

                {/* Subjects List - Simple */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-md max-w-4xl mx-auto lg:mx-0">
                  <h3 className="text-lg sm:text-xl font-bold text-[#b8934d] mb-4 text-center lg:text-left">Cambridge Curriculum Subjects</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                    {subjects.map((subject, index) => (
                      <div key={subject.name} className="text-sm sm:text-base text-gray-700 hover:text-[#9e1b1b] transition-colors duration-200 cursor-default">
                        • {subject.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mode Information Display */}
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md max-w-lg mx-auto lg:mx-0">
                  <div className="flex rounded-lg bg-gray-100 p-1">
                    <div className="flex-1 py-2 px-4 rounded-md text-sm font-medium bg-[#b8934d] text-white shadow-md text-center">
                      💻 Online Sessions
                    </div>
                    <div className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-gray-600 text-center">
                      🏠 In-Person Available
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 text-center">
                    Flexible online sessions via google meet  and face-to-face options where applicable
                  </div>
                </div>
              </div>

              {/* Enhanced CTA Button */}
              <CalendlyDialog
                      trigger={
              <button className="w-full sm:w-auto bg-gradient-to-r from-[#0d1a2e] to-[#0d1a2e] hover:from-[#b8934d] hover:to-[#b8934d] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg flex items-center justify-center space-x-3 transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-xl border border-white/20 group">
                <span>Schedule Session</span>
                <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            }
                    />
            </div>
            

            {/* Right Content - Enhanced */}
            <div className={`w-full lg:w-1/2 relative mt-8 lg:mt-0 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative flex justify-center">
                <div className="w-64 sm:w-72 lg:w-80 h-64 sm:h-72 lg:h-80 mx-auto bg-white rounded-full shadow-2xl overflow-hidden border-4 sm:border-8 border-white hover:scale-105 transition-transform duration-500">
                  <img
                    src="/images/tutor.jpeg"
                    alt="Professional tutor teaching Cambridge curriculum subjects"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Enhanced Free Demo Badge - Now Clickable */}
                <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">



                  
                  <CalendlyDialog
                      trigger={
                  <button
                    className="bg-gradient-to-r from-[#b8934d] to-[#b8934d] hover:from-[#0d1a2e] hover:to-[#0d1a2e] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg relative hover:scale-110 transition-transform duration-300 cursor-pointer"
                    aria-label="Book free demo class"
                  >
                    <div className="text-center">
                      <div className="font-semibold text-sm sm:text-base">Free Demo</div>
                      <div className="text-xs sm:text-sm opacity-90">Class Available</div>
                    </div>
                    <div className="absolute top-0 left-6 sm:left-8 transform -translate-y-2">
                      <div className="w-3 sm:w-4 h-3 sm:h-4 bg-[#b8934d] rotate-45"></div>
                    </div>
                  </button>
                    }
                    />
                </div>
              </div>

              {/* Floating Achievement Badge */}
              <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-[#b8934d] to-[#b8934d] rounded-full flex items-center justify-center shadow-lg hover:rotate-12 transition-transform duration-300">
                <UserCheck className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
              </div>

              {/* Success Stats - Floating Card */}
              <div className="hidden lg:block absolute -right-8 top-20 bg-white rounded-lg shadow-lg p-4 border border-gray-100 hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold text-[#b8934d]">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Enhanced Information Grid */}
          <div className={`mt-12 sm:mt-16 lg:mt-20 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Cambridge Resources - Enhanced */}
              <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="text-2xl">📚</div>
                  <h3 className="text-xl font-bold text-[#b8934d] group-hover:text-[#0d1a2e] transition-colors duration-300">Cambridge Resources</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Comprehensive study resources for all Cambridge curriculum subjects with regular updates and past papers.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {subjects.slice(0, 8).map(subject => (
                    <div key={subject.name} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-xs">{subject.name}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  <strong>Includes:</strong> eBooks, past papers, notes, practice questions, video explanations for all subjects
                </div>
              </div>

              {/* Exam Preparation - Enhanced */}
              <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="text-2xl">📝</div>
                  <h3 className="text-xl font-bold text-[#b8934d] group-hover:text-[#0d1a2e] transition-colors duration-300">Exam Preparation</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Structured exam preparation with mock tests and personalized feedback for IGCSE, AS & A Level examinations.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-500 mr-2" />
                    Timed mock exams
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
                    Past paper practice
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Award className="w-4 h-4 text-blue-500 mr-2" />
                    Performance tracking
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                  <strong>Average improvement:</strong> 2+ grade levels across all subjects
                </div>
              </div>

              {/* Essay & Thesis Writing - Enhanced */}
              <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group md:col-span-2 lg:col-span-1">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="text-2xl">🎓</div>
                  <h3 className="text-xl font-bold text-[#b8934d] group-hover:text-[#0d1a2e] transition-colors duration-300">Essay & Thesis Writing</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Professional writing support from high school essays to university dissertations across all subjects.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                    Structure & planning
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                    Research methods
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                    Citation & referencing
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-sm text-purple-700">
                  <strong>Levels:</strong> IGCSE to University support available
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schema.org Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalService",
            "name": "Private Tutoring Services - Cambridge Curriculum",
            "description": "Expert private tutoring in all Cambridge curriculum subjects from secondary to university level",
            "provider": {
              "@type": "Person",
              "name": "NCR Tutor",
              "telephone": "+91-8929483938"
            },
            "serviceType": ["Mathematics Tutoring", "Physics Tutoring", "Chemistry Tutoring", "Biology Tutoring", "English Tutoring", "History Tutoring", "Geography Tutoring", "Economics Tutoring", "Business Studies Tutoring", "Psychology Tutoring", "Computer Science Tutoring", "Art & Design Tutoring", "Music Tutoring", "French Tutoring", "Spanish Tutoring", "German Tutoring"],
            "areaServed": "India",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Cambridge Curriculum Tutoring Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Free Demo Class"
                  }
                }
              ]
            }
          })}
        </script>
      </div>
    </>
  )
}

export default TutoringServiceSection