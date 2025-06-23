import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  X
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

  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false)
  const [isMidCollapsed, setIsMidCollapsed] = useState(false)
  const [leftWidth, setLeftWidth] = useState(220)
  const [midWidth, setMidWidth] = useState(320)

  const isDraggingLeft = useRef(false)
  const isDraggingMid = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const startXLeft = useRef(0)
  const startLeftWidth = useRef(leftWidth)
  const startXMid = useRef(0)
  const startMidWidth = useRef(midWidth)

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

  // Fixed: Handle resource selection without triggering download
  const handleResourceSelect = (resource: any) => {
    setSelectedResource(resource)
  }

  // Fixed: Handle modal opening
  const openReader = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (selectedResource?.link) {
      setOpenModal(true)
    }
  }

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row h-screen w-full bg-white dark:bg-black relative overflow-hidden">
      {/* Subject Panel */}
      <div className={`transition-all duration-300 bg-gray-900 text-white ${isLeftCollapsed ? 'w-0' : ''} hidden lg:block`} style={{ width: isLeftCollapsed ? 0 : leftWidth }}>
        <div className="p-4 overflow-y-auto h-full">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold">Subjects</h2>
            <button onClick={() => setIsLeftCollapsed(true)}>
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </div>
          {subjects.map((s) => (
            <button key={s.id} onClick={() => setSelectedSubject(s.id)} className={`block w-full text-left px-4 py-2 rounded mb-2 ${selectedSubject === s.id ? 'bg-orange-500 text-white' : 'hover:bg-gray-800'}`}>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {!isLeftCollapsed && <div onMouseDown={(e) => handleMouseDown(e, 'left')} className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize hidden lg:block" />}
      {isLeftCollapsed && (
        <button onClick={() => setIsLeftCollapsed(false)} className="absolute top-4 left-2 z-10 bg-white rounded-full p-1 shadow-lg hover:bg-gray-200 hidden lg:block">
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Filter Panel */}
      <div className={`transition-all duration-300 bg-white border-r ${isMidCollapsed ? 'w-0' : ''} hidden lg:block`} style={{ width: isMidCollapsed ? 0 : midWidth }}>
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={() => setIsMidCollapsed(true)}>
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="relative mb-5">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search title or level"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {availabilityOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedAvailability(opt)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${selectedAvailability === opt ? 'bg-orange-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3 max-h-[70vh] overflow-y-auto">
            {filtered.map((r) => (
              <div
                key={r.id}
                onClick={() => handleResourceSelect(r)}
                className="p-3 border rounded cursor-pointer hover:shadow transition-shadow"
              >
                <h3 className="font-semibold text-sm mb-1">{r.title}</h3>
                <p className="text-xs text-gray-500">Level: {r.level}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isMidCollapsed && <div onMouseDown={(e) => handleMouseDown(e, 'mid')} className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize hidden lg:block" />}
      {isMidCollapsed && (
        <button onClick={() => setIsMidCollapsed(false)} className="absolute top-4 left-[260px] z-10 bg-white rounded-full p-1 shadow-lg hover:bg-gray-200 hidden lg:block">
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Preview Panel */}
      <div className="flex-1 bg-white dark:bg-black p-6 overflow-y-auto">
        {selectedResource ? (
          <>
            <h2 className="text-2xl font-bold mb-1">{selectedResource.title}</h2>
            <p className="text-sm text-gray-500 mb-1">Level: {selectedResource.level}</p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedResource.description}</p>

            {selectedResource.external_link && /(youtube\.com|youtu\.be)/.test(selectedResource.external_link) && (
              <div className="aspect-video mb-6 rounded overflow-hidden">
                <ReactPlayer url={selectedResource.external_link} width="100%" height="100%" controls />
              </div>
            )}

            {selectedResource.link && (
              <button 
                onClick={openReader} 
                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Read Resource
              </button>
            )}
          </>
        ) : (
          <div className="text-gray-400 h-full flex items-center justify-center">
            <p className="text-lg">Select a resource to preview</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openModal && selectedResource?.link && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-black p-6 rounded-lg w-full max-w-5xl h-[80vh] relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedResource.link)}&embedded=true`}
                className="w-full h-full rounded border-0"
                title="Preview"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}