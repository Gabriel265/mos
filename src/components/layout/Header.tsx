import { useTheme } from '@/context/ThemeContext'
import { FaSun, FaMoon } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

export const Header = () => {
  const { toggle, theme } = useTheme()
  const { pathname } = useLocation()

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'Resources', to: '/resources' },
    { label: 'Tutoring', to: '/tutoring' },
    { label: 'Contact', to: '/contact' },
  ]

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-background text-foreground transition-colors duration-300 z-50">
      <h1 className="text-2xl font-bold tracking-wide">Malawi Online Services</h1>

      <nav className="hidden md:flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`transition-colors duration-200 hover:text-primary ${
              pathname === item.to ? 'text-primary font-semibold' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={toggle}
        className="p-2 rounded-full hover:bg-muted transition-colors duration-300"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? (
          <FaSun className="text-yellow-400" />
        ) : (
          <FaMoon className="text-cyberBlue" />
        )}
      </button>
    </header>
  )
}
