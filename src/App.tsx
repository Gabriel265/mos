import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/context/ThemeContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Navigate } from 'react-router-dom'


// Page imports
import HomePage from '@/pages/Home'
import ServicesPage from '@/pages/Services'
import ResourcesPage from '@/pages/Resources'
import TutoringPage from '@/pages/Tutoring'
import ContactPage from '@/pages/Contact'

// Admin pages
import AdminLogin from '@/pages/admin/Login'
import ServicesAdmin from '@/pages/admin/ServicesAdmin'
import ResourcesAdmin from '@/pages/admin/ResourcesAdmin'
import TutorsAdmin from '@/pages/admin/TutorsAdmin'
import SubjectsAdmin from '@/pages/admin/SubjectsAdmin'
import ContactAdmin from '@/pages/admin/ContactAdmin'


export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-lightBg dark:bg-darkBg text-lightText dark:text-darkText">
          <Header />
          <Toaster richColors position="top-center" />
          <main className="flex-grow p-4">
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
              <Route path="/admin/services" element={<ServicesAdmin />} />
              <Route path="/admin/resources" element={<ResourcesAdmin />} />
              <Route path="/admin/tutors" element={<TutorsAdmin />} />
              <Route path="/admin/subjects" element={<SubjectsAdmin />} />
              <Route path="/admin/contact" element={<ContactAdmin />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}
