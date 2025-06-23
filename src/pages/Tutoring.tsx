import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { ChevronUp, ChevronDown, Volume2 } from 'lucide-react'

interface Tutor {
  id: string
  name: string
  bio: string
  mode: 'Online' | 'In-person' | 'Both'
  subjects: string[]
  profile_url?: string
}

export default function Tutoring() {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      const { data: tutorsData } = await supabase
        .from('tutors')
        .select(`
          id, name, bio, mode, profile_url,
          tutor_subjects (subject_id, subjects(name))
        `)
        .eq('archived', false)

      const formatted = (tutorsData || []).map(t => ({
        id: t.id,
        name: t.name,
        bio: t.bio,
        mode: t.mode,
        profile_url: t.profile_url,
        subjects: t.tutor_subjects?.map(ts => ts.subjects?.name).filter(Boolean) || []
      }))

      const { data: subs } = await supabase.from('subjects').select('name')
      setTutors(formatted)
      setSubjects(subs?.map(s => s.name) || [])
    }

    fetchData()
  }, [])

  const filtered = selectedSubject
    ? tutors.filter(t => t.subjects.includes(selectedSubject))
    : tutors

  const currentProfile = filtered[currentIndex] || null

  const changeIndex = (dir: 'up' | 'down' | number) => {
    if (isAnimating || filtered.length === 0) return
    setIsAnimating(true)
    let next = dir === 'up'
      ? (currentIndex > 0 ? currentIndex - 1 : filtered.length - 1)
      : dir === 'down'
        ? (currentIndex < filtered.length - 1 ? currentIndex + 1 : 0)
        : dir

    setCurrentIndex(next)
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-2"
      >
        Private Tutoring
      </motion.h1>
      <p className="text-center text-gray-600 dark:text-gray-400 text-lg mb-4">
        Expert tutoring in science and language from secondary school to university level.
      </p>

      <div className="text-center mb-8">
        <span className="text-sm font-medium px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-white rounded-full shadow-sm">
          Modes: Online & In-person
        </span>
      </div>

      <div className="bg-gradient-to-r from-purple-200 via-blue-100 to-green-100 dark:from-purple-900 dark:via-blue-900 dark:to-green-900 rounded-xl p-6 mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-center mb-2">Academic Journey: Inspired by the Cambridge Pathway</h2>
        <p className="text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-sm">
          Our tutoring program follows a progressive learning pathway designed to support growth from secondary school through to university entrance.
        </p>
      </div>


      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {subjects.map(sub => (
          <button
            key={sub}
            onClick={() => {
              const newSub = selectedSubject === sub ? null : sub
              setSelectedSubject(newSub)
              setCurrentIndex(0)
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedSubject === sub
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-800'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>
      <motion.div
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="flex flex-col items-center mb-8 px-4"
>
  <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-center">
    Meet Our Tutors
  </h3>
  <div className="w-24 h-1 mt-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
</motion.div>


      <div className="flex h-[500px] bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-md">
        {/* Left Strip */}
        <div className="w-20 bg-white dark:bg-gray-800 flex flex-col items-center justify-center border-r border-gray-200">
          <div className="transform -rotate-90 text-sm font-medium text-gray-600 tracking-wider">
            Tutors
          </div>
        </div>

        {/* Thumbnails */}
        <div className="w-48 bg-white dark:bg-gray-800 flex flex-col justify-center items-center space-y-4 border-r border-gray-200 p-4 overflow-hidden">
          {filtered.map((p, idx) => (
            <div
              key={p.id}
              className={`w-16 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                idx === currentIndex ? 'ring-2 ring-blue-500 scale-110' : 'opacity-60 hover:opacity-80'
              }`}
              onClick={() => changeIndex(idx)}
            >
              <img src={p.profile_url || ''} alt={p.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div className={`flex-1 flex items-center justify-center transition-all duration-500 ${currentProfile?.bgColor || 'bg-gray-50 dark:bg-gray-800'}`}>
          <motion.div
            className={`relative transition-all duration-500 ${isAnimating ? 'scale-110 opacity-90' : 'scale-100 opacity-100'}`}
          >
            <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img src={currentProfile?.profile_url || ''} alt={currentProfile?.name} className="w-full h-full object-cover transition-transform duration-500" />
            </div>
          </motion.div>
        </div>

        {/* Profile Info */}
        <div className="w-96 bg-white dark:bg-gray-800 p-8 flex flex-col justify-center">
          <motion.div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{currentProfile?.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{currentProfile?.mode}</p>
            </div>
            <blockquote className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-6">
              "{currentProfile?.bio}"
            </blockquote>
            <div className="flex items-center justify-between">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <Button className="mt-6 w-full" onClick={() => navigate('/contact')}>
              Start Now
            </Button>
          </motion.div>
        </div>

        {/* Scroll Controls */}
        <div className="w-16 bg-white dark:bg-gray-800 flex flex-col items-center justify-center space-y-4 border-l border-gray-200 dark:border-gray-700">
          <button
            onClick={() => changeIndex('up')}
            disabled={isAnimating}
            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
          >
            <ChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex flex-col space-y-2">
            {filtered.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-gray-800 dark:bg-gray-200' : 'bg-gray-300 dark:bg-gray-600'}`}
              />
            ))}
          </div>
          <button
            onClick={() => changeIndex('down')}
            disabled={isAnimating}
            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
          >
            <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

    </section>
  )
}
