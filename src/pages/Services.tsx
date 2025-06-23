import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Wallet, Package, Users, Settings, Zap, Shield, Globe, Star, X } from 'lucide-react'

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
  for (const [k, Icon] of Object.entries(categoryIcons)) {
    if (key.includes(k)) return Icon
  }
  return categoryIcons.default
}

const ServiceModal = ({ category, onClose }: { category: any, onClose: () => void }) => {
  const Icon = getIcon(category.name)
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-xl w-full relative shadow-2xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
          <X />
        </button>
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-indigo-500 p-2 rounded-full text-white">
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold">{category.name}</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{category.description}</p>
        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Services Offered:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          {category.services.map((srv: any) => (
            <li key={srv.id}>
              <strong>{srv.title}</strong>{srv.description && ` – ${srv.description}`}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}

export default function Services() {
  const [categories, setCategories] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from('categories').select('*, services(*)').eq('archived', false)
      if (!error && data) {
        const clean = data.map(cat => ({
          ...cat,
          services: (cat.services || []).filter((s: any) => !s.archived)
        }))
        setCategories(clean)
      }
    }
    fetch()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Our Services</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Explore tailored academic, digital, and professional services curated just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const Icon = getIcon(cat.name)
            return (
              <motion.div
                key={cat.id}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center mb-3">
                  <div className="bg-indigo-600 text-white p-2 rounded-full shadow">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-800 dark:text-white">
                    {cat.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{cat.description}</p>

                {cat.services.length > 0 && (
                  <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1 mb-4">
                    {cat.services.slice(0, 4).map((srv: any) => (
                      <li key={srv.id}>{srv.title}</li>
                    ))}
                    {cat.services.length > 4 && <li>+ {cat.services.length - 4} more</li>}
                  </ul>
                )}

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => setSelected(cat)}
                    className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded hover:bg-indigo-700 transition"
                  >
                    View More
                  </button>
                  <Link
                    to="/contact"
                    className="flex-1 bg-orange-500 text-white text-sm py-2 rounded text-center hover:bg-orange-600 transition"
                  >
                    Schedule Consultancy
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ServiceModal category={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
