import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Clock, Phone, Twitter, Facebook, Linkedin, Play, Award, Shield, Cloud, HardDrive, Code, Monitor, ChevronLeft, ChevronRight, ExternalLink, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ITservices: React.FC = () => {
  const [currentSiteIndex, setCurrentSiteIndex] = useState(0);
  
  const portfolioSites = [
    {
      name: "Malawi Online Services",
      url: "https://malawionlineservises.vercel.app",
      description: "Government Services Platform"
    },
    {
      name: "Gabriel Kadiwa Portfolio",
      url: "https://gabrielkadiwa.vercel.app",
      description: "Professional Portfolio Site"
    },
    {
      name: "Designer",
      url: "https://gabrielthedesigner.netlify.app",
      description: "Professional Graphics"
    },
  ];

  const processSteps = [
    "Planning & Discovery",
    "Design & Development", 
    "Testing & Review",
    "Launch & Support"
  ];

  // Auto-rotate through portfolio sites (every 8 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSiteIndex((prev) => (prev + 1) % portfolioSites.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [portfolioSites.length]);

  const nextSite = () => {
    setCurrentSiteIndex((prev) => (prev + 1) % portfolioSites.length);
  };

  const prevSite = () => {
    setCurrentSiteIndex((prev) => (prev - 1 + portfolioSites.length) % portfolioSites.length);
  };

  const currentSite = portfolioSites[currentSiteIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Services Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start space-y-8 lg:space-y-0 lg:space-x-12">
            <div className="w-full lg:flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl transform rotate-3"></div>
                <div className="relative z-10 bg-white rounded-2xl w-full h-64 md:h-80 shadow-lg overflow-hidden group">
                  {/* Website Preview */}
                  <div className="relative h-full">
                    <iframe
                      src={currentSite.url}
                      className="w-full h-full border-0 transform scale-50 origin-top-left"
                      style={{ width: '200%', height: '200%' }}
                      title={currentSite.name}
                    />
                    
                    {/* Navigation Controls */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-between px-4">
                      <button 
                        onClick={prevSite}
                        className="w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                      >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-[#b8934d]" />
                      </button>
                      
                      <button 
                        onClick={nextSite}
                        className="w-10 h-10 md:w-12 md:h-12 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transform translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                      >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-[#b8934d]" />
                      </button>
                    </div>

                    {/* Site Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 md:p-4">
                      <div className="text-white">
                        <p className="font-semibold text-xs md:text-sm">{currentSite.name}</p>
                        <p className="text-xs opacity-80">{currentSite.description}</p>
                      </div>
                    </div>

                    {/* External Link Button */}
                    <button 
                      onClick={() => window.open(currentSite.url, '_blank')}
                      className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-[#b8934d]" />
                    </button>
                  </div>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {portfolioSites.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSiteIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSiteIndex 
                            ? 'bg-white' 
                            : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="mt-6 md:mt-8 flex justify-center items-center">
                <Link 
                  to="/contact" 
                  className="bg-gradient-to-r from-[#b8934d] to-[#b8934d] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 w-auto max-w-xs md:max-w-md flex items-center justify-center"
                >
                  <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="ml-2 text-sm md:text-base whitespace-nowrap">Request Quotation</span>
                </Link>
              </div>
            </div>
            

            <div className="w-full lg:flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
                Software & IT Solutions
              </h2>
              <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                We deliver comprehensive software development and IT support services designed to scale your business operations and enhance productivity through innovative technology solutions.
              </p>
              
              <div className="space-y-4 md:space-y-6">
                <div className="bg-gradient-to-r from-[#b8934d] to-[#b8934d] text-white p-4 md:p-6 rounded-lg">
                  <h3 className="text-lg md:text-xl font-semibold mb-2">5+ Years Of Experience</h3>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Code className="w-5 h-5 md:w-6 md:h-6 text-[#b8934d]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Custom Software Development</h4>
                    <p className="text-gray-600 text-xs md:text-sm mb-1">Web, Android, and Desktop Apps + Hosting</p>
                    <p className="text-gray-500 text-xs md:text-sm">Bespoke systems built for your needs.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-5 h-5 md:w-6 md:h-6 text-[#b8934d]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Digital & IT Systems Support</h4>
                    <p className="text-gray-600 text-xs md:text-sm mb-1">ICT troubleshooting, software setup, networking</p>
                    <p className="text-gray-500 text-xs md:text-sm">Includes DHIS2, system onboarding, and user training.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-right flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Tech Solutions</h4>
                    <p className="text-gray-500 text-xs md:text-sm">Innovation & Development</p>
                  </div>
                  <div className="w-12 h-8 md:w-16 md:h-12 bg-gradient-to-r from-[#b8934d] to-[#b8934d] rounded flex-shrink-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <p className="text-[#b8934d] font-medium mb-4">PROCESS</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">How We Work</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Our proven methodology ensures successful project delivery from conception to completion
            </p>
          </div>
          
          {/* Simple Process Steps */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto">
            {processSteps.map((step, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-[#b8934d] to-[#b8934d] text-white rounded-full flex items-center justify-center font-bold text-base md:text-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-tight">{step}</h3>
              </div>
            ))}
          </div>

          {/* Simple Process Flow */}
          <div className="mt-12 lg:mt-16 flex items-center justify-center">
            <div className="flex items-center space-x-3 md:space-x-6">
              {Array.from({length: 4}).map((_, index) => (
                <React.Fragment key={index}>
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-gradient-to-r from-[#b8934d] to-[#b8934d] text-white' :
                    index === 1 ? 'bg-yellow-400 text-white' :
                    index === 2 ? 'bg-blue-400 text-white' : 'bg-green-400 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div className={`w-12 md:w-16 h-1 rounded ${
                      index === 0 ? 'bg-gradient-to-r from-[#b8934d] to-yellow-400' :
                      index === 1 ? 'bg-gradient-to-r from-yellow-400 to-blue-400' : 
                      'bg-gradient-to-r from-blue-400 to-green-400'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ITservices;