import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Wallet, Package, Users, Settings, Zap, Shield, Globe, Star, X, ChevronRight, ArrowRight, Sparkles } from 'lucide-react'
import CalendlyDialog from '@/components/shared/CalendlyDialog'

const categoryIcons: { [key: string]: any } = {
  wallet: Wallet,
  connect: Wallet,
  product: Package,
  high: Star,
  client: Users,
  management: Settings,
  asset: Shield,
  service: Zap,
  global: Globe,
  default: Package
}

const getIcon = (name: string) => {
  const key = name.toLowerCase()
  return Object.entries(categoryIcons).find(([k]) => key.includes(k))?.[1] ?? categoryIcons.default
}

type Category = {
  id: string
  name: string
  description: string
  services: { id: string; title: string; description?: string }[]
}

const ServiceModal = ({ category, onClose }: { category: Category; onClose: () => void }) => {
  const Icon = getIcon(category.name)
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl max-w-2xl w-full relative shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0, y: 50 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <motion.button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Header */}
        <motion.div 
          className="flex items-center space-x-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl text-white shadow-lg">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{category.name}</h2>
            <div className="flex items-center text-orange-600 text-sm mt-1">
              <Sparkles className="w-4 h-4 mr-1" />
              <span>{category.services.length} Services Available</span>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p 
          className="text-gray-700 mb-8 text-base leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {category.description}
        </motion.p>

        {/* Services Grid */}
        <motion.div 
          className="grid gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {category.services.map((srv, index) => (
            <motion.div
              key={srv.id}
              className="group bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200/60 rounded-2xl p-4 hover:shadow-md transition-all duration-300 hover:border-orange-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-orange-800 font-semibold text-sm sm:text-base mb-1 group-hover:text-orange-900 transition-colors">
                    {srv.title}
                  </h4>
                  {srv.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {srv.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-orange-400 group-hover:text-orange-600 transition-colors flex-shrink-0" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-end gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button 
            onClick={onClose} 
            className="px-6 py-3 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-full transition-all duration-200 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/contact" 
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              Schedule Consultancy
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function Services() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selected, setSelected] = useState<Category | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase
          .from('categories')
          .select('*, services(*)')
          .eq('archived', false)
        /* --no reversed
        if (data) {
          setCategories(data.map(cat => ({
            ...cat,
            services: (cat.services || []).filter((s: any) => !s.archived)
          })))
        }*/
          if (data) {
  const reversed = [...data].reverse() // reverses the order
  setCategories(
    reversed.map(cat => ({
      ...cat,
      services: (cat.services || []).filter((s: any) => !s.archived)
    }))
  )
}

      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-orange-50/30 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4 animate-pulse max-w-md mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded-lg animate-pulse max-w-2xl mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="h-6 bg-gray-200 rounded flex-1"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="services" className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-orange-50/30 px-4 pt-4 sm:pt-6 lg:pt-16 pb-2 sm:pb-3 lg:pb-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-transparent bg-clip-text mb-4 sm:mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            What We Offer
          </motion.h1>
          <motion.p 
            className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Browse our curated services across academic, technical, and creative domains—tailored to your needs.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {categories.map((cat, i) => {
            const Icon = getIcon(cat.name)
            const isHovered = hovered === cat.id

            return (
              <motion.div
                key={cat.id}
                onClick={() => setSelected(cat)}
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
                className={`group relative cursor-pointer rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-500 shadow-sm hover:shadow-xl bg-gradient-to-br overflow-hidden ${
                  isHovered
                    ? 'from-white to-orange-50/80 shadow-2xl scale-[1.02] border border-orange-200/50'
                    : 'from-white to-slate-50/80 hover:from-white hover:to-orange-50/50'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: i * 0.1, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon & Title */}
                <motion.div 
                  className="relative flex items-center gap-4 mb-6 z-10"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl text-white shadow-lg group-hover:shadow-xl"
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: [0, -5, 5, 0],
                      boxShadow: "0 20px 40px rgba(251, 146, 60, 0.3)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-orange-900 transition-colors duration-300">
                    {cat.name}
                  </h3>
                </motion.div>

                {/* Description */}
                <p className="relative text-gray-600 text-sm sm:text-base line-clamp-3 mb-6 leading-relaxed z-10">
                  {cat.description}
                </p>

                {/* Service Tags - Enhanced Animation */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      className="relative flex flex-wrap gap-2 mb-6 z-10"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {cat.services.slice(0, 4).map((srv, index) => (
                        <motion.span 
                          key={srv.id}
                          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 text-xs sm:text-sm font-medium shadow-sm"
                          initial={{ opacity: 0, scale: 0.8, x: -10 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.2 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {srv.title}
                        </motion.span>
                      ))}
                      {cat.services.length > 4 && (
                        <motion.span 
                          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-xs sm:text-sm font-medium"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.2 }}
                        >
                          +{cat.services.length - 4} more
                        </motion.span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="relative mt-auto flex items-center justify-between z-10">
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); setSelected(cat) }}
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm sm:text-base font-medium group/btn"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    View More
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <CalendlyDialog
                      trigger={
                        <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-white text-sm sm:text-base font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                          Schedule Consultation
                        </button>
                      }
                    />
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16 sm:mt-20 lg:mt-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Start Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence mode="wait">
        {selected && <ServiceModal category={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}