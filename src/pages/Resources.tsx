import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  X,
  Menu,
  Filter,
  ArrowUp
} from 'lucide-react'
import ReactPlayer from 'react-player'
import { motion, AnimatePresence } from 'framer-motion'

const availabilityOptions = [
  'eBooks',
  'Past Papers',
  'Notes',
  'Practice Questions',
  'Syllabus',
  'Marking Schemes'
]

export default function Resources() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedAvailability, setSelectedAvailability] = useState('eBooks')
  const [resources, setResources] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedResource, setSelectedResource] = useState<any | null>(null)
  const [openModal, setOpenModal] = useState(false)

  // Desktop layout states
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false)
  const [isMidCollapsed, setIsMidCollapsed] = useState(false)
  const [leftWidth, setLeftWidth] = useState(220)
  const [midWidth, setMidWidth] = useState(320)

  // Mobile layout states
  const [mobileView, setMobileView] = useState<'subjects' | 'filters' | 'preview'>('subjects')
  const [showMobileSubjects, setShowMobileSubjects] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const isDraggingLeft = useRef(false)
  const isDraggingMid = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const startXLeft = useRef(0)
  const startLeftWidth = useRef(leftWidth)
  const startXMid = useRef(0)
  const startMidWidth = useRef(midWidth)

  // Scroll to top handler
  useEffect(() => {
    const handleScroll = () => {
      if (previewRef.current) {
        setShowScrollTop(previewRef.current.scrollTop > 300)
      }
    }

    const previewEl = previewRef.current
    if (previewEl) {
      previewEl.addEventListener('scroll', handleScroll)
      return () => previewEl.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    previewRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    supabase
      .from('subjects')
      .select('*')
      .eq('archived', false)
      .order('name')
      .then(({ data }) => {
        if (data?.length) {
          setSubjects(data)
          setSelectedSubject(data[0].id)
        }
      })
  }, [])

  useEffect(() => {
    if (!selectedSubject) return
    supabase
      .from('resources')
      .select('*')
      .eq('archived', false)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setResources(data)
      })
  }, [selectedSubject])

  useEffect(() => {
    const q = search.toLowerCase()
    const filtered = resources.filter(
      r =>
        r.subject_id === selectedSubject &&
        (!selectedAvailability || r.availability?.some(a => a.toLowerCase() === selectedAvailability.toLowerCase())) &&
        (r.title?.toLowerCase().includes(q) || r.level?.toLowerCase().includes(q))
    )
    setFiltered(filtered)
  }, [search, selectedAvailability, resources, selectedSubject])

  const handleDrag = (e: MouseEvent, type: 'left' | 'mid') => {
    const delta = e.clientX - (type === 'left' ? startXLeft.current : startXMid.current)
    if (type === 'left') {
      setLeftWidth(Math.min(Math.max(180, startLeftWidth.current + delta), 360))
    } else {
      setMidWidth(Math.min(Math.max(220, startMidWidth.current + delta), 480))
    }
  }

  const handleMouseDown = (e: React.MouseEvent, type: 'left' | 'mid') => {
    if ((type === 'left' && isLeftCollapsed) || (type === 'mid' && isMidCollapsed)) return

    if (type === 'left') {
      isDraggingLeft.current = true
      startXLeft.current = e.clientX
      startLeftWidth.current = leftWidth
    } else {
      isDraggingMid.current = true
      startXMid.current = e.clientX
      startMidWidth.current = midWidth
    }

    const onMove = (e: MouseEvent) => handleDrag(e, type)
    const onUp = () => {
      isDraggingLeft.current = false
      isDraggingMid.current = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const handleResourceSelect = (resource: any) => {
    setSelectedResource(resource)
    // Auto-switch to preview on mobile
    if (window.innerWidth < 1024) {
      setMobileView('preview')
      setShowMobileFilters(false)
    }
  }

  const openReader = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (selectedResource?.link) {
      setOpenModal(true)
    }
  }

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId)
    setShowMobileSubjects(false)
    if (window.innerWidth < 1024) {
      setMobileView('filters')
    }
  }

  // Animation variants
  const slideInVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  }

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -2,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }
  }

  // Replace the entire return statement structure with this:

return (
  <div className="flex flex-col h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black relative overflow-hidden p-0">
    
    {/* Title and Tagline Section - Always visible at top */}
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4 px-6 lg:py-6 lg:px-8 flex-shrink-0">
      <motion.h1
          className=" text-center text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-lightBlue-400 to-orange-600">
            Expert Tutoring
          </span>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
          Comprehensive study resources available for all classes following the Cambridge curriculum.
        </p>
        </motion.h1>
      
    </div>

    {/* Main Content Area */}
    <div ref={containerRef} className="flex flex-col lg:flex-row flex-1 relative overflow-hidden">
      
      {/* Mobile Header - Now just for navigation */}
      <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 z-30">
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileSubjects(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium">
              {subjects.find(s => s.id === selectedSubject)?.name || 'Select Subject'}
            </span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </motion.button>
        </div>
      </div>

      {/* Rest of your existing panels code goes here unchanged... */}
      {/* Desktop Subject Panel */}
      <motion.div 
        className={`transition-all duration-500 ease-in-out bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl ${isLeftCollapsed ? 'w-0' : ''} hidden lg:block`} 
        style={{ width: isLeftCollapsed ? 0 : leftWidth }}
        animate={{ width: isLeftCollapsed ? 0 : leftWidth }}
      >
        <div className="p-6 overflow-y-auto h-full custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <motion.h2 
              className="text-lg font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Subjects
            </motion.h2>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLeftCollapsed(true)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </motion.button>
          </div>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {subjects.map((s, index) => (
              <motion.button 
                key={s.id}
                variants={slideInVariants}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSubject(s.id)} 
                className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedSubject === s.id 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105' 
                    : 'hover:bg-white/10 hover:shadow-md'
                }`}
              >
                {s.name}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {!isLeftCollapsed && <div onMouseDown={(e) => handleMouseDown(e, 'left')} className="w-1 bg-gradient-to-b from-gray-300 to-gray-400 hover:from-orange-400 hover:to-orange-500 cursor-col-resize hidden lg:block transition-all duration-300" />}
      
      {isLeftCollapsed && (
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLeftCollapsed(false)} 
          className="absolute top-6 left-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hidden lg:block"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </motion.button>
      )}

      {/* Desktop Filter Panel */}
      <motion.div 
        className={`transition-all duration-500 ease-in-out bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl ${isMidCollapsed ? 'w-0' : ''} hidden lg:block`} 
        style={{ width: isMidCollapsed ? 0 : midWidth }}
        animate={{ width: isMidCollapsed ? 0 : midWidth }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <motion.h2 
              className="text-xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Filters
            </motion.h2>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMidCollapsed(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>

          <motion.div 
            className="relative mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
            <input
              placeholder="Search title or level..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
            />
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {availabilityOptions.map((opt, index) => (
              <motion.button
                key={opt}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                onClick={() => setSelectedAvailability(opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedAvailability === opt 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md'
                }`}
              >
                {opt}
              </motion.button>
            ))}
          </motion.div>

          <motion.div 
            className="flex-1 overflow-y-auto custom-scrollbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {filtered.map((r, index) => (
                <motion.div
                  key={r.id}
                  variants={cardVariants}
                  whileHover="hover"
                  onClick={() => handleResourceSelect(r)}
                  className={`p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedResource?.id === r.id 
                      ? 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700' 
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                >
                  <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white line-clamp-2">{r.title}</h3>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mb-1 font-medium">Level: {r.level}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">{r.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {!isMidCollapsed && <div onMouseDown={(e) => handleMouseDown(e, 'mid')} className="w-1 bg-gradient-to-b from-gray-300 to-gray-400 hover:from-orange-400 hover:to-orange-500 cursor-col-resize hidden lg:block transition-all duration-300" />}
      
      {isMidCollapsed && (
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMidCollapsed(false)} 
          className="absolute top-6 left-[260px] z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hidden lg:block"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </motion.button>
      )}

      {/* Preview Panel */}
      <div className="flex-1 bg-white dark:bg-gray-900 relative">
        <div 
          ref={previewRef}
          className="h-full overflow-y-auto custom-scrollbar p-6 lg:p-8"
        >
          <AnimatePresence mode="wait">
            {selectedResource ? (
              <motion.div
                key={selectedResource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl"
              >
                <motion.h2 
                  className="text-3xl lg:text-4xl font-bold mb-3 text-gray-900 dark:text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedResource.title}
                </motion.h2>
                
                <motion.div 
                  className="flex items-center gap-4 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-full">
                    Level: {selectedResource.level}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
                    {selectedAvailability}
                  </span>
                </motion.div>
                
                <motion.p 
                  className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {selectedResource.description}
                </motion.p>

                {selectedResource.external_link && /(youtube\.com|youtu\.be)/.test(selectedResource.external_link) && (
                  <motion.div 
                    className="aspect-video mb-8 rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <ReactPlayer 
                      url={selectedResource.external_link} 
                      width="100%" 
                      height="100%" 
                      controls 
                      className="rounded-2xl overflow-hidden"
                    />
                  </motion.div>
                )}

                {selectedResource.link && (
                  <motion.button 
                    onClick={openReader}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-3 font-medium shadow-lg hover:shadow-xl"
                  >
                    <BookOpen className="w-5 h-5" />
                    Read Resource
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl"
                  >
                    <BookOpen className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select a resource</h3>
                  <p className="text-gray-500 dark:text-gray-400">Choose from the filters panel to preview content</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-20"
            >
              <ArrowUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Subjects Overlay */}
      <AnimatePresence>
        {showMobileSubjects && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowMobileSubjects(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-gradient-to-b from-gray-900 to-gray-800 w-80 h-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Subjects</h2>
                  <button onClick={() => setShowMobileSubjects(false)} className="text-white p-1">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-3">
                  {subjects.map((s) => (
                    <motion.button
                      key={s.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSubjectSelect(s.id)}
                      className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        selectedSubject === s.id 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {s.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-gray-900 absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters & Resources</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="text-gray-600 dark:text-gray-300 p-1">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="relative mb-6">
                  <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                  <input
                    placeholder="Search title or level..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {availabilityOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedAvailability(opt)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedAvailability === opt 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-3">
                  {filtered.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => handleResourceSelect(r)}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">{r.title}</h3>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Level: {r.level}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {openModal && selectedResource?.link && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-6xl h-[90vh] relative shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpenModal(false)}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full shadow-lg transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              <div className="p-6 pb-0">
                <motion.h3 
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedResource.title}
                </motion.h3>
              </div>
              
              <motion.div
                className="px-6 pb-6 h-[calc(100%-80px)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedResource.link)}&embedded=true`}
                  className="w-full h-full rounded-xl border-0 bg-gray-50 dark:bg-gray-800"
                  title="Resource Preview"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #ea580c);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #dc2626);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (max-width: 1024px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
        }
      `}</style>
    </div>

    </div>
)
}