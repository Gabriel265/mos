import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Wallet, 
  Package, 
  Users, 
  Settings,
  Zap,
  Shield,
  Globe,
  Star,
  X
} from 'lucide-react'

const CARDS_PER_VIEW = 1

// Enhanced icon mapping for service categories
const categoryIcons: { [key: string]: any } = {
  'wallet': Wallet,
  'connect': Wallet,
  'product': Package,
  'high': Star,
  'client': Users,
  'management': Settings,
  'asset': Shield,
  'service': Zap,
  'global': Globe,
  'default': Package
}

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 20,
    size: Math.random() * 3 + 2
  }))

  return (
    <div className="floating-particles">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
        />
      ))}
    </div>
  )
}

// Modal component for detailed view
const ServiceModal = ({ category, onClose }: { category: any; onClose: () => void }) => {
  const IconComponent = categoryIcons[category.name.toLowerCase()] || categoryIcons.default
  
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="floating-card max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'none' }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="card-icon">
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        
        <h3 className="card-title">{category.name}</h3>
        <p className="card-description">{category.description}</p>
        
        {category.services.length > 0 && (
          <ul className="services-list">
            {category.services.map((service: any) => (
              <li key={service.id} className="service-item">
                <div>
                  <div className="service-name">{service.title}</div>
                  {service.description && (
                    <div className="service-desc">{service.description}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Services() {
  const [categories, setCategories] = useState<any[]>([])
  const [filteredCategories, setFilteredCategories] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*, services:services(*)')
        .eq('archived', false)

      if (!error && data) {
        const filtered = data.map(cat => ({
          ...cat,
          services: cat.services?.filter((s: any) => !s.archived) || []
        }))
        setCategories(filtered)
        setFilteredCategories(filtered)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!search.trim()) {
      setFilteredCategories(categories)
      setCurrentCardIndex(0)
      return
    }
    const lower = search.toLowerCase()
    const filtered = categories
      .map(cat => ({
        ...cat,
        services: cat.services.filter((s: any) =>
          s.title.toLowerCase().includes(lower) ||
          s.description.toLowerCase().includes(lower)
        )
      }))
      .filter(cat => cat.services.length > 0)
    setFilteredCategories(filtered)
    setCurrentCardIndex(0)
  }, [search, categories])

  const getIconForCategory = (categoryName: string) => {
    const key = categoryName.toLowerCase()
    for (const [iconKey, IconComponent] of Object.entries(categoryIcons)) {
      if (key.includes(iconKey)) return IconComponent
    }
    return categoryIcons.default
  }

  const maxCardIndex = Math.max(0, filteredCategories.length - CARDS_PER_VIEW)
  const canScrollUp = currentCardIndex > 0
  const canScrollDown = currentCardIndex < maxCardIndex

  const scrollUp = () => {
    if (canScrollUp) {
      setCurrentCardIndex(currentCardIndex - 1)
    }
  }

  const scrollDown = () => {
    if (canScrollDown) {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY > 0 && canScrollDown) {
      scrollDown()
    } else if (e.deltaY < 0 && canScrollUp) {
      scrollUp()
    }
  }

  const visibleCategories = filteredCategories.slice(
    currentCardIndex,
    currentCardIndex + CARDS_PER_VIEW
  )

  return (
    <>
      <div className="services-container">
        <div className="services-background" />
        <FloatingParticles />
        
        <div className="services-layout">
          {/* Left Section - Text and Search */}
          <div className="left-section">
            <div className="hero-text">
              <motion.h1 
                className="hero-title"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                Empowering Learning<br />
                & Digital Solutions<br />
                <span className="text-yellow-300">
                  for the Cambridge Syllabus<br />
                  and Beyond.
                </span>
              </motion.h1>
              
              <motion.p 
                className="hero-subtitle"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                We offer academic support, digital skills training, and custom software & design services tailored to students and professionals alike.
              </motion.p>
              
              <motion.div 
                className="search-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Search className="search-icon w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </motion.div>
            </div>
          </div>

          {/* Right Section - Service Cards */}
          <div className="right-section">
            <div 
              className="cards-container"
              onWheel={handleWheel}
            >
              <motion.div 
                className="cards-scroll"
                style={{
                  transform: `translateY(-${currentCardIndex * 280}px)`
                }}
              >
                {filteredCategories.map((cat, idx) => {
                  const IconComponent = getIconForCategory(cat.name)
                  return (
                    <motion.div
                      key={cat.id}
                      className="floating-card cursor-pointer"
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: idx * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      onClick={() => setSelectedCategory(cat)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="card-icon">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      
                      <h3 className="card-title">{cat.name}</h3>
                      <p className="card-description">{cat.description}</p>
                      
                      {cat.services.length > 0 && (
                        <div className="compact-services">
                          <h4 className="services-header">Services:</h4>
                          <ul className="compact-services-list">
                            {cat.services.map((service: any) => (
                              <li key={service.id} className="compact-service-item">
                                • {service.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>

            {/* Scroll Controls */}
            {filteredCategories.length > CARDS_PER_VIEW && (
              <div className="scroll-controls">
                <button
                  onClick={scrollUp}
                  disabled={!canScrollUp}
                  className="scroll-button"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  onClick={scrollDown}
                  disabled={!canScrollDown}
                  className="scroll-button"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* No Results State */}
        {filteredCategories.length === 0 && search && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="floating-card text-center">
              <div className="card-icon mx-auto">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h3 className="card-title">No services found</h3>
              <p className="card-description">
                Try adjusting your search terms or browse all available services.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <ServiceModal
            category={selectedCategory}
            onClose={() => setSelectedCategory(null)}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .services-container {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .services-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
        }

        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float-particle 20s infinite linear;
        }

        @keyframes float-particle {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-10vh) rotate(360deg);
            opacity: 0;
          }
        }

        .services-layout {
          position: relative;
          z-index: 10;
          display: flex;
          min-height: 100vh;
        }

        .left-section {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 3rem 1.5rem;
          position: relative;
        }

        .right-section {
          flex: 1;
          position: relative;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 50% 0 0 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .hero-text {
          color: white;
          max-width: 480px;
        }

        .hero-title {
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.2rem;
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .hero-subtitle {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .search-container {
          position: relative;
          max-width: 320px;
        }

        .search-input {
          width: 100%;
          padding: 0.8rem 0.8rem 0.8rem 2.5rem;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 0.9rem;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(120, 119, 198, 0.5);
          box-shadow: 0 0 0 3px rgba(120, 119, 198, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.7);
        }

        .cards-container {
          max-height: 75vh;
          overflow: hidden;
          position: relative;
          width: 100%;
          max-width: 360px;
          display: flex;
          justify-content: center;
        }

        .cards-scroll {
          transition: transform 0.5s ease;
          width: 100%;
        }

        .floating-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          margin: 0.5rem auto;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          animation: card-float 6s ease-in-out infinite;
          position: relative;
          width: 100%;
          max-width: 320px;
          transition: transform 0.2s ease;
          text-align: center;
          min-height: 260px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        @keyframes card-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .floating-card:nth-child(2n) {
          animation-delay: -2s;
        }

        .floating-card:nth-child(3n) {
          animation-delay: -4s;
        }

        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
          flex-shrink: 0;
        }

        .card-title {
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.6rem;
          text-align: center;
        }

        .card-description {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          text-align: center;
          flex-grow: 1;
          display: flex;
          align-items: center;
        }

        .compact-services {
          margin-top: auto;
          width: 100%;
        }

        .services-header {
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
          text-align: center;
        }

        .compact-services-list {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: center;
        }

        .compact-service-item {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.7rem;
          line-height: 1.3;
          margin-bottom: 0.2rem;
        }

        .services-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .service-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.8rem;
          padding-left: 0.8rem;
          position: relative;
        }

        .service-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.4rem;
          width: 5px;
          height: 5px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
        }

        .service-name {
          color: white;
          font-weight: 500;
          font-size: 0.8rem;
          margin-bottom: 0.2rem;
        }

        .service-desc {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.7rem;
          line-height: 1.4;
        }

        .scroll-controls {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          z-index: 20;
        }

        .scroll-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }

        .scroll-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .scroll-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .scroll-button:disabled:hover {
          transform: none;
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 1024px) {
          .services-layout {
            flex-direction: column;
          }
          
          .right-section {
            border-radius: 0 0 50% 50%;
            min-height: 60vh;
          }
          
          .left-section {
            padding: 2rem 1rem;
            text-align: center;
          }
          
          .scroll-controls {
            position: static;
            transform: none;
            flex-direction: row;
            justify-content: center;
            margin-top: 1rem;
          }
        }

        @media (max-width: 768px) {
          .floating-card {
            padding: 1.2rem;
            margin: 0.4rem auto;
            min-height: 220px;
          }
          
          .left-section {
            padding: 1.5rem 1rem;
          }
          
          .right-section {
            padding: 1rem;
          }
          
          .cards-container {
            max-height: 55vh;
          }

          .hero-title {
            font-size: clamp(1.8rem, 4vw, 2.8rem);
          }

          .hero-subtitle {
            font-size: 0.85rem;
          }

          .card-icon {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </>
  )
}