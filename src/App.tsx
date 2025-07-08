import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/context/ThemeContext'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'

// Page imports
import HomePage from '@/pages/Home'
import ServicesPage from '@/pages/Services'
import ResourcesPage from '@/pages/Resources'
import TutoringPage from '@/pages/Tutoring'
import ContactPage from '@/pages/Contact'

// Admin pages
import PrivateRoute from '@/components/auth/PrivateRoute'
import AdminLogin from '@/pages/admin/Login'
import ServicesAdmin from '@/pages/admin/ServicesAdmin'
import ResourcesAdmin from '@/pages/admin/ResourcesAdmin'
import TutorsAdmin from '@/pages/admin/TutorsAdmin'
import SubjectsAdmin from '@/pages/admin/SubjectsAdmin'
import ContactAdmin from '@/pages/admin/ContactAdmin'

function AppRoutes() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col bg-lightBg dark:bg-darkBg text-lightText dark:text-darkText">
      {/* Show header/footer only on non-admin routes */}
      {!isAdminRoute && <Header />}
      <Toaster richColors position="top-center" />
      <main className="flex-grow p-4 mt-20">

        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/tutoring" element={<TutoringPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/admin/services" element={<ServicesAdmin />} />
            <Route path="/admin/resources" element={<ResourcesAdmin />} />
            <Route path="/admin/tutors" element={<TutorsAdmin />} />
            <Route path="/admin/subjects" element={<SubjectsAdmin />} />
            <Route path="/admin/contact" element={<ContactAdmin />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}
