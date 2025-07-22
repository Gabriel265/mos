import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mail, Phone, ChevronDown } from 'lucide-react'
import { FaBars, FaTimes } from 'react-icons/fa'

const navItems = [
  { label: 'Home', to: '/' },
  { 
    label: 'Services', 
    to: '/services', 
    sectionId: 'services',
    hasDropdown: true
  },  
  { label: 'About Us', to: '/about', sectionId: 'about' },
  { label: 'Our Team', to: '/team', sectionId: 'team' },
  { label: 'Tutoring', to: '/tutoring', sectionId: 'tutoring' },
  { label: 'Contact', to: '/contact', sectionId: 'contact' }
]

const servicesDropdown = [
  { title: 'Academic & Tutoring Services', sectionId: 'tutoring' },
  { title: 'Software & IT Solutions', sectionId: 'it' },
  { title: 'Creative & Digital Media', sectionId: 'graphics' },
  { title: 'Marketing & Business Support', sectionId: 'business' },
  { title: 'AI & Automation', sectionId: 'automation' },
  { title: 'Data & Analytics', sectionId: 'business' }
]

export const Header = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [showNav, setShowNav] = useState(true)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [contactBarHeight, setContactBarHeight] = useState(0)
  const lastScroll = useRef(0)
  const dropdownRef = useRef(null)
  const dropdownTimeoutRef = useRef(null)
  const contactBarRef = useRef(null)

  // Measure contact bar height and update navbar position
  useEffect(() => {
    const measureContactBar = () => {
      if (contactBarRef.current) {
        setContactBarHeight(contactBarRef.current.offsetHeight)
      }
    }

    // Initial measurement
    measureContactBar()

    // Re-measure on resize
    window.addEventListener('resize', measureContactBar)
    return () => window.removeEventListener('resize', measureContactBar)
  }, [])

  // Handle scroll-based hide/show of nav
  useEffect(() => {
    const onScroll = () => {
      const currentScroll = window.scrollY
      setShowNav(currentScroll < lastScroll.current || currentScroll < 100)
      lastScroll.current = currentScroll
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Highlight current section on home page only
  useEffect(() => {
    if (location.pathname !== '/') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { threshold: 0.5 }
    )

    navItems.forEach(({ sectionId }) => {
      if (sectionId) {
        const el = document.getElementById(sectionId)
        if (el) observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [location.pathname])

  // Enhanced dropdown handlers with delay
  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setServicesDropdownOpen(true)
  }

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false)
    }, 300) // 300ms delay before closing
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
    }
  }, [])

  return (
    <header className="relative z-50">
       {/* Top Contact Bar - Darker Colors */}
      <div 
  ref={contactBarRef}
  className="bg-[#d4a464] text-white text-sm py-2 px-4 w-full fixed top-0 z-50 transition-all duration-300"
>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <span className="flex items-center gap-1 text-xs sm:text-sm">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> 
              <span className="truncate">helpinghandtutor3@gmail.com</span>
            </span>
            <span className="flex items-center gap-1 text-xs sm:text-sm">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> 
              +44 7301 096908
            </span>
          </div>
          <div className="hidden sm:flex gap-4 items-center flex-shrink-0">
            <span className="hidden lg:inline text-xs xl:text-sm whitespace-nowrap">Get in touch for personalized assistance</span>
            <Link
              to="/contact"
              className="bg-gradient-to-r from-[#0d1a2e] via-[#1a2f45] to-[#0d1a2e] hover:from-[#8b1a1a] hover:to-[#a02020] px-3 py-1 rounded text-xs transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
            >
              Schedule Consultancy
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Navigation */}
      <div
        className={`fixed left-0 right-0 transition-transform duration-300 z-40 ${
          showNav ? 'translate-y-0' : '-translate-y-full'
        } bg-gray-800 bg-opacity-80 backdrop-blur shadow`}
        style={{ top: `${contactBarHeight}px` }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src="/vite.svg" 
              alt="HAT Logo" 
              className="w-5 h-5 sm:w-6 sm:h-6" 
            />
            <div>
              <div className="text-xs text-gray-300 -mt-1">Helping Hand Tutor</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-4 lg:gap-6">
            {navItems.map((item) => (
              <div key={item.to} className="relative" ref={item.hasDropdown ? dropdownRef : null}>
                {item.hasDropdown ? (
                  <button
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                    className={`flex items-center gap-1 hover:text-[#d4a464] transition-all duration-200 text-sm lg:text-base ${
                      location.pathname === '/' && activeSection === item.sectionId
                        ? 'text-[#d4a464] font-semibold'
                        : location.pathname === item.to
                        ? 'text-[#d4a464] font-semibold'
                        : ''
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    className={`hover:text-[#d4a464] transition text-sm lg:text-base whitespace-nowrap ${
                      location.pathname === '/' && activeSection === item.sectionId
                        ? 'text-[#d4a464] font-semibold'
                        : location.pathname === item.to
                        ? 'text-[#d4a464] font-semibold'
                        : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Enhanced Services Dropdown */}
                {item.hasDropdown && servicesDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 py-3 overflow-hidden transform transition-all duration-200 ease-out"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                    style={{
                      animation: 'fadeInScale 0.2s ease-out',
                    }}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Our Services</h3>
                    </div>
                    {servicesDropdown.map((service, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setServicesDropdownOpen(false)
                          if (location.pathname === '/') {
                            document.getElementById(service.sectionId)?.scrollIntoView({ behavior: 'smooth' })
                          } else {
                            window.location.href = `/#${service.sectionId}`
                          }
                        }}
                        className="block w-full text-left px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-[#d4a464]/10 hover:to-[#d4a464]/20 hover:text-[#b8934d] transition-all duration-200 group relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{service.title}</span>
                          <div className="w-2 h-2 bg-[#d4a464] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-700 flex-shrink-0"
            aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-gray-900 px-4 py-3 space-y-2 max-h-[70vh] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.to}>
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className={`flex items-center justify-between w-full text-left text-sm py-2 transition ${
                        location.pathname === item.to || activeSection === item.sectionId
                          ? 'text-[#d4a464] font-semibold'
                          : 'text-gray-200'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileServicesOpen && (
                      <div className="ml-4 mt-2 space-y-1 bg-gray-800 rounded-lg p-3">
                        {servicesDropdown.map((service, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setMenuOpen(false)
                              setMobileServicesOpen(false)
                              if (location.pathname === '/') {
                                document.getElementById(service.sectionId)?.scrollIntoView({ behavior: 'smooth' })
                              } else {
                                window.location.href = `/#${service.sectionId}`
                              }
                            }}
                            className="block w-full text-left text-sm text-gray-300 hover:text-[#d4a464] transition-colors py-2 px-3 rounded hover:bg-gray-700"
                          >
                            {service.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block text-sm py-2 transition ${
                      location.pathname === item.to || activeSection === item.sectionId
                        ? 'text-[#d4a464] font-semibold'
                        : 'text-gray-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Mobile Contact Button */}
            <div className="pt-2 border-t border-gray-700 mt-4">
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-gradient-to-r from-[#0d1a2e] via-[#1a2f45] to-[#0d1a2e]hover:from-[#8b1a1a] hover:to-[#a02020] px-4 py-2 rounded text-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Schedule Consultancy
              </Link>
            </div>
          </div>
        )}
      </div>

     

      {/* Add CSS animation styles */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </header>
  )
}