import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mail, Phone, Scale, ChevronDown } from 'lucide-react'
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
  { title: 'AI & Automation', sectionId: 'business' },
  { title: 'Data & Analytics', sectionId: 'business' }
]

export const Header = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [showNav, setShowNav] = useState(true)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const lastScroll = useRef(0)
  const dropdownRef = useRef(null)
  const dropdownTimeoutRef = useRef(null)

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
      <div className="bg-gradient-to-r from-[#8b1a1a] to-[#7a1515] hover:from-[#7a1515] hover:to-[#8b1a1a] text-white text-sm py-2 px-4 w-full fixed top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> helpinghandtutor3@gmail.com</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> +44 7301 096908</span>
          </div>
          <div className="hidden sm:flex gap-4 items-center">
            <span className="hidden md:inline">Get in touch for personalized assistance</span>
            <Link
              to="/contact"
              className="bg-gradient-to-r from-[#a02020] to-[#8b1a1a] hover:from-[#8b1a1a] hover:to-[#a02020] px-4 py-1 rounded text-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Schedule Consultancy
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Navigation */}
      <div
        className={`fixed top-10 left-0 right-0 transition-transform duration-300 z-40 ${
          showNav ? 'translate-y-0' : '-translate-y-full'
        } bg-gray-800 bg-opacity-80 backdrop-blur shadow`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-orange-500" />
            <div>
              <div className="text-lg font-bold leading-none">HAT</div>
              <div className="text-xs text-gray-300 -mt-1">Helping Hand Tutor</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <div key={item.to} className="relative" ref={item.hasDropdown ? dropdownRef : null}>
                {item.hasDropdown ? (
                  <button
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                    className={`flex items-center gap-1 hover:text-orange-400 transition-all duration-200 ${
                      location.pathname === '/' && activeSection === item.sectionId
                        ? 'text-orange-500 font-semibold'
                        : location.pathname === item.to
                        ? 'text-orange-500 font-semibold'
                        : ''
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    className={`hover:text-orange-400 transition ${
                      location.pathname === '/' && activeSection === item.sectionId
                        ? 'text-orange-500 font-semibold'
                        : location.pathname === item.to
                        ? 'text-orange-500 font-semibold'
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
                        className="block w-full text-left px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 transition-all duration-200 group relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{service.title}</span>
                          <div className="w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
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
            className="md:hidden p-2 rounded hover:bg-gray-700"
            aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-gray-900 px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <div key={item.to}>
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className={`flex items-center justify-between w-full text-left text-sm transition ${
                        location.pathname === item.to || activeSection === item.sectionId
                          ? 'text-orange-400 font-semibold'
                          : 'text-gray-200'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileServicesOpen && (
                      <div className="ml-4 mt-2 space-y-2 bg-gray-800 rounded-lg p-3">
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
                            className="block w-full text-left text-sm text-gray-300 hover:text-orange-400 transition-colors py-2 px-3 rounded hover:bg-gray-700"
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
                    className={`block text-sm transition ${
                      location.pathname === item.to || activeSection === item.sectionId
                        ? 'text-orange-400 font-semibold'
                        : 'text-gray-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spacer to prevent overlap */}
      <div className="h-[10px] md:h-[10px]" />

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