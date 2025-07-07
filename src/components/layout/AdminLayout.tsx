import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const links = [
  { path: '/admin/services', label: 'Services' },
  { path: '/admin/tutors', label: 'Tutors' },
  { path: '/admin/subjects', label: 'Subjects' },
  { path: '/admin/contact', label: 'Contact' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <div className="min-h-screen flex bg-lightBg dark:bg-darkBg text-lightText dark:text-darkText">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 shadow-md p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">Helping Hand Tutor</h2>
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              'block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition',
              location.pathname === link.path ? 'bg-gray-200 dark:bg-gray-700 font-semibold' : ''
            )}
          >
            {link.label}
          </Link>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6">{children}</main>
    </div>
  )
}
