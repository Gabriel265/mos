import { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  LogOut, 
  Settings, 
  Users, 
  BookOpen, 
  MessageSquare,
  Menu,
  X,
  GraduationCap,
  ChevronRight
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

const links = [
  { path: '/admin/services', label: 'Services', icon: Settings },
  { path: '/admin/tutors', label: 'Tutors', icon: Users },
  { path: '/admin/subjects', label: 'Subjects', icon: BookOpen },
  { path: '/admin/contact', label: 'Contact', icon: MessageSquare },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Logout failed: ' + error.message)
    } else {
      toast.success('Logged out')
      navigate('/admin/login')
    }
  }

  const sidebarWidth = isCollapsed && !isHovered ? 'w-16' : 'w-64'
  const showLabels = !isCollapsed || isHovered
  const mainContentMargin = isMobile ? 'ml-0' : (isCollapsed && !isHovered ? 'ml-16' : 'ml-64')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800 text-gray-800 dark:text-gray-100">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 md:hidden"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          'transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between z-50',
          isMobile 
            ? `fixed left-0 top-0 h-full w-64 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `fixed left-0 top-0 h-full ${sidebarWidth}`
        )}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Header */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              {showLabels && (
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                    Helping Hand Tutor
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
                </div>
              )}
            </div>
            
            {/* Collapse Button (Desktop Only) */}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isCollapsed ? "rotate-0" : "rotate-180"
                )} />
              </button>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="space-y-2">
            {links.map(link => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-colors flex-shrink-0",
                    isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  )} />
                  
                  {showLabels && (
                    <span className="font-medium text-sm truncate">
                      {link.label}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && !isHovered && !isMobile && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {link.label}
                    </div>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
        
        {/* Logout Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 group",
              "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {showLabels && (
              <span className="font-medium text-sm truncate">Logout</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && !isHovered && !isMobile && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className={cn(
        "min-h-screen overflow-auto transition-all duration-300",
        isMobile ? "p-4 pt-16" : "p-6",
        mainContentMargin
      )}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}