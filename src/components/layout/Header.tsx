import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mail, Phone, Scale } from 'lucide-react'
import { FaBars, FaTimes } from 'react-icons/fa'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services', sectionId: 'services' },  
  { label: 'Tutoring', to: '/tutoring', sectionId: 'tutoring' },
  { label: 'Contact', to: '/contact', sectionId: 'contact' }
]

export const Header = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [showNav, setShowNav] = useState(true)
  const lastScroll = useRef(0)

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

  return (
    <header className="relative z-50">
       {/* Top Contact Bar */}
      <div className="bg-gray-900 text-white text-sm py-2 px-4 w-full fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> helpinghandtutor@mail.com</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> +265 999 000 111</span>
          </div>
          <div className="hidden sm:flex gap-4 items-center">
            <span className="hidden md:inline">Get in touch for personalized assistance</span>
            <Link
              to="/contact"
              className="bg-orange-500 px-4 py-1 rounded text-sm hover:bg-orange-600 transition"
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
              <Link
                key={item.to}
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
              <Link
                key={item.to}
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
            ))}
          </div>

        )}
      </div>

      {/* Spacer to prevent overlap */}
      <div className="h-[10px] md:h-[10px]" />
    </header>
  )
}
