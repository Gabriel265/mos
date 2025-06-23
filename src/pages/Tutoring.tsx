import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'


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
  const carouselRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()


  useEffect(() => {
    const fetchData = async () => {
      const { data: tutorsData, error } = await supabase
            .from('tutors')
            .select(`
              id,
              name,
              bio,
              mode,
              profile_url,
              tutor_subjects (
                subject_id,
                subjects (
                  name
                )
              )
            `)
            .eq('archived', false)

          if (error) {
            console.error("Failed to fetch tutors:", error.message)
            return
          }

          // Transform to flatten subjects into array of names
          const formattedTutors = (tutorsData || []).map(t => ({
            ...t,
            subjects: t.tutor_subjects?.map(ts => ts.subjects?.name).filter(Boolean) || [],
          }))


      const { data: subjectData } = await supabase
        .from('subjects')
        .select('name')

      setTutors(formattedTutors)
      setSubjects(subjectData?.map(s => s.name) || [])
    }

    fetchData()
  }, [])

  const filteredTutors = selectedSubject
    ? tutors.filter(tutor => tutor.subjects.includes(selectedSubject))
    : tutors

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: dir === 'left' ? -320 : 320,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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

      {/* Cambridge Pathway Representation */}
      <div className="bg-gradient-to-r from-purple-200 via-blue-100 to-green-100 dark:from-purple-900 dark:via-blue-900 dark:to-green-900 rounded-xl p-6 mb-10 shadow-sm">
        <h2 className="text-xl font-semibold text-center mb-2">Academic Journey: Inspired by the Cambridge Pathway</h2>
        <p className="text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-sm">
          Our tutoring program follows a progressive learning pathway designed to support growth from secondary school through to university entrance. Whether you're preparing for IGCSEs, A-levels, or advanced university entrance tests, our tutors are here to guide you.
        </p>
      </div>

      {/* Subject Selector */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {subjects.map(subject => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject === selectedSubject ? null : subject)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedSubject === subject
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-800'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Carousel Section */}
      <div className="relative">
        {filteredTutors.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4 px-2">
              <Button onClick={() => scrollCarousel('left')} variant="ghost">
                ←
              </Button>
              <Button onClick={() => scrollCarousel('right')} variant="ghost">
                →
              </Button>
            </div>

            <div
              ref={carouselRef}
              className="flex overflow-x-auto space-x-6 px-1 pb-4 scrollbar-hide scroll-smooth"
            >
              {filteredTutors.map((tutor, idx) => (
                <motion.div
                  key={tutor.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="min-w-[280px] max-w-xs bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 shrink-0"
                >
                  <div className="flex items-center gap-4 mb-3">
                    {tutor.profile_url && (
                      <img
                        src={tutor.profile_url}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{tutor.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{tutor.mode}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{tutor.bio}</p>
                  <div className="flex flex-wrap gap-2 text-xs mb-4">
                    {tutor.subjects.map((subj, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 dark:bg-blue-900 dark:text-white text-blue-800 px-2 py-1 rounded-full"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                  <Button
                    onClick={() => navigate('/contact')}

                    className="w-full"
                    size="sm"
                  >
                    Start Now
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No tutors found for the selected subject.
          </p>
        )}
      </div>
    </section>
  )
}
