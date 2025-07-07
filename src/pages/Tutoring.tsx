import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { ChevronUp, ChevronDown, Volume2, Filter, Star, LibraryBig, MapPin, Clock, Users } from 'lucide-react'

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
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    async function fetchData() {
  // Fetch tutors
  const { data: tutorsData, error: tutorError } = await supabase
    .from('tutors')
    .select('*')
    .eq('archived', false);

  if (tutorError) {
    console.error('Error fetching tutors:', tutorError.message);
    return;
  }

  // Fetch subject links with subjects joined
  const { data: subjectLinks, error: subjectError } = await supabase
    .from('tutor_subjects')
    .select('tutor_id, subjects(name)');

  if (subjectError) {
    console.error('Error fetching subjects:', subjectError.message);
    return;
  }

  // Combine tutors with their subject names
  const tutorsWithSubjects = tutorsData.map((tutor) => {
    const subjects = subjectLinks
      .filter((link) => link.tutor_id === tutor.id)
      .map((link) => link.subjects?.name)
      .filter(Boolean);

    return {
      id: tutor.id,
      name: tutor.name,
      bio: tutor.bio,
      mode: tutor.mode,
      profile_url: tutor.profile_url ?? null, // Already a public URL
      subjects,
    };
  });

  // Fetch all subject names for filter buttons
  const { data: allSubjects, error: allSubError } = await supabase
    .from('subjects')
    .select('name');

  if (allSubError) {
    console.error('Error fetching all subjects:', allSubError.message);
  }

  setTutors(tutorsWithSubjects);
  setSubjects(allSubjects?.map((s) => s.name) || []);
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const profileVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateY: 90 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateY: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      rotateY: -90,
      transition: { duration: 0.3 }
    }
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Online': return <Clock className="w-4 h-4" />
      case 'In-person': return <MapPin className="w-4 h-4" />
      case 'Both': return <Users className="w-4 h-4" />
      default: return null
    }
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Online': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'In-person': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'Both': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <motion.section 
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  className="max-w-screen-2xl mx-auto px-4 pt-0 pb-2 md:pt-1 md:pb-0"
>
      {/* Header */}
      

      {/* Hero Banner */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-green-900/30 rounded-3xl p-6 md:p-8 mb-8 md:mb-12 shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <div className="relative z-10">
          <motion.h1
          className=" text-center text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-lightBlue-400 to-orange-600">
            Expert Tutoring
          </span>
        </motion.h1>


            <motion.p 
            className="text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-sm md:text-base mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Expert tutoring in science and language from secondary school to university level. 
            Personalized learning experiences tailored to your success.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-medium px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-full shadow-lg">
              <Clock className="w-4 h-4 text-green-600" />
              Online Sessions
            </span>
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-medium px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-full shadow-lg">
              <MapPin className="w-4 h-4 text-blue-600" />
              In-Person Available
            </span>
          </motion.div>

             {/* Additional Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
      >
        {[
          {
            icon: <Clock className="w-8 h-8" />,
            title: "Flexible Scheduling",
            description: "Book sessions that fit your schedule, available 7 days a week",
            color: "from-green-500 to-emerald-600"
          },
          {
            icon: <Users className="w-8 h-8" />,
            title: "Expert Tutors",
            description: "Learn from qualified professionals with years of teaching experience",
            color: "from-blue-500 to-cyan-600"
          },
          {
            icon: <LibraryBig className="w-8 h-8" />,
            title: "Cambridge Resources",
            description: "Comprehensive study resources available for all classes following the Cambridge curriculum.",
            color: "from-purple-500 to-pink-600"
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden group"
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />
            <div className="relative z-10">
              <motion.div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-4 shadow-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

        </div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-4 right-4 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-4 left-4 w-16 h-16 bg-purple-200/30 rounded-full blur-xl"
          animate={{ 
            y: [0, 10, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>

      {/* Subject Filters */}
      <motion.div variants={itemVariants} className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4">
          {/* Meet Our Tutors Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center mb-8 md:mb-12"
      >
        <motion.h5 
          className="text-2xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-lightBlue-400 to-orange-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Meet Our Tutors
        </motion.h5>
        <motion.div 
          className="w-24 h-1 rounded-full bg-gradient-to-r from-blue-900 via-lightBlue-400 to-orange-600"
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        
        <motion.div 
          className={`flex flex-wrap justify-center gap-2 md:gap-3 ${isMobile && !showFilters ? 'hidden' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, staggerChildren: 0.05 }}
        >
          {subjects.map((sub, index) => (
            <motion.button
              key={sub}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newSub = selectedSubject === sub ? null : sub
                setSelectedSubject(newSub)
                setCurrentIndex(0)
              }}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                selectedSubject === sub
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white transform scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {sub}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      

      {/* Tutor Carousel */}
      <motion.div 
        variants={itemVariants} 
        className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20"
      >
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="p-6">
            <AnimatePresence mode="wait">
              {currentProfile && (
                <motion.div
                  key={currentProfile.id}
                  variants={profileVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-center"
                >
                  <div className="relative mb-6">
                    <motion.div 
                      className="w-48 h-64 mx-auto rounded-3xl overflow-hidden shadow-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                      src={currentProfile.profile_url || '/api/placeholder/200/300'} 
                      onError={(e) => e.currentTarget.src = '/api/placeholder/200/300'}
                      alt={currentProfile.name}
                      className="w-full h-full object-cover" 
                    />

                    </motion.div>
                    <motion.div
                      className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium shadow-lg ${getModeColor(currentProfile.mode)}`}>
                        {getModeIcon(currentProfile.mode)}
                        {currentProfile.mode}
                      </span>
                    </motion.div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {currentProfile.name}
                      </h3>
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {currentProfile.subjects.slice(0, 3).map((subject, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <blockquote className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                      "{currentProfile.bio}"
                    </blockquote>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                      onClick={() => navigate('/contact')}
                    >
                      Start Learning
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Mobile Navigation */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeIndex('up')}
                disabled={isAnimating}
                className="rounded-full"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              
              <div className="flex space-x-2">
                {filtered.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex 
                        ? 'bg-blue-600 w-6' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeIndex('down')}
                disabled={isAnimating}
                className="rounded-full"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="flex min-h-[600px]">
            {/* Left Brand Strip */}
            <motion.div 
              className="w-20 bg-gradient-to-b from-blue-900 to-orange-600 flex flex-col items-center justify-center text-white relative overflow-hidden"
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"
                animate={{ 
                  backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="transform -rotate-90 text-sm font-bold tracking-widest relative z-10">
                TUTORS
              </div>
            </motion.div>

            {/* Thumbnails */}
            <motion.div 
              className="w-64 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex flex-col justify-center items-center space-y-4 border-r border-white/20 p-6 overflow-hidden"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {filtered.map((tutor, idx) => (
                <motion.div
                  key={tutor.id}
                  className={`relative w-20 h-24 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                    idx === currentIndex 
                      ? 'ring-4 ring-blue-500 scale-110 shadow-2xl' 
                      : 'opacity-60 hover:opacity-90 hover:scale-105 shadow-lg'
                  }`}
                  onClick={() => changeIndex(idx)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src={tutor.profile_url || '/api/placeholder/200/300'} 
                    onError={(e) => e.currentTarget.src = '/api/placeholder/200/300'}
                    alt={tutor.name}
                    className="w-full h-full object-cover" 
                  />


                  {idx === currentIndex && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Main Image */}
            <motion.div 
              className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 relative overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Background Elements */}
              <motion.div
                className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"
                animate={{ 
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl"
                animate={{ 
                  x: [0, -25, 0],
                  y: [0, 15, 0],
                  scale: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
              
              <AnimatePresence mode="wait">
                {currentProfile && (
                  <motion.div
                    key={currentProfile.id}
                    variants={profileVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative z-10"
                  >
                    <motion.div 
                      className="w-80 h-96 lg:w-96 lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl"
                      whileHover={{ 
                        scale: 1.02,
                        rotateY: 5,
                        rotateX: 5
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={currentProfile.profile_url || '/api/placeholder/400/500'} 
                        alt={currentProfile.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Profile Info */}
            <motion.div 
              className="w-96 lg:w-[420px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 flex flex-col justify-center border-l border-white/20"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <AnimatePresence mode="wait">
                {currentProfile && (
                  <motion.div
                    key={currentProfile.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div>
                      <motion.h2 
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {currentProfile.name}
                      </motion.h2>
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getModeColor(currentProfile.mode)}`}>
                          {getModeIcon(currentProfile.mode)}
                          {currentProfile.mode}
                        </span>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentProfile.subjects.map((subject, idx) => (
                          <motion.span 
                            key={idx}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {subject}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.blockquote 
                      className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic border-l-4 border-blue-500 pl-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      "{currentProfile.bio}"
                    </motion.blockquote>
                    
                    
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-900 to-orange-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => navigate('/contact')}
                        size="lg"
                      >
                        Start Learning Journey
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Scroll Controls */}
            <motion.div 
              className="w-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 border-l border-white/20"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.button
                onClick={() => changeIndex('up')}
                disabled={isAnimating}
                className="p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </motion.button>
              
              <div className="flex flex-col space-y-3">
                {filtered.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all duration-500 cursor-pointer ${
                      idx === currentIndex 
                        ? 'bg-blue-600 scale-125 shadow-lg' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-400'
                    }`}
                    onClick={() => changeIndex(idx)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
              
              <motion.button
                onClick={() => changeIndex('down')}
                disabled={isAnimating}
                className="p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.1, y: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </motion.div>
          </div>
        )}
      </motion.div>

     

      
    </motion.section>
  )
}