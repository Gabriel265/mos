// Resources.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  ChevronLeft, ChevronRight, Search, BookOpen, X
} from 'lucide-react';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const availabilityOptions = [
  'eBooks', 'Past Papers', 'Notes', 'Practice Questions', 'Syllabus', 'Marking Schemes'
];

export default function Resources() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState('eBooks');
  const [allResources, setAllResources] = useState<any[]>([]);
  const [displayed, setDisplayed] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isMidCollapsed, setIsMidCollapsed] = useState(false);
  const [leftWidth, setLeftWidth] = useState(220);
  const [midWidth, setMidWidth] = useState(320);

  const startXLeft = useRef(0);
  const startXMid = useRef(0);
  const startLeftWidth = useRef(leftWidth);
  const startMidWidth = useRef(midWidth);

  const isDraggingLeft = useRef(false);
  const isDraggingMid = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

  const fetchSubjects = async () => {
    const { data } = await supabase.from('subjects').select('*').eq('archived', false).order('name');
    if (data?.length) {
      setSubjects(data);
      setSelectedSubject(data[0].id);
    }
  };

  const fetchResources = useCallback(async () => {
    const { data } = await supabase
      .from('resources')
      .select('*')
      .eq('archived', false)
      .eq('subject_id', selectedSubject)
      .order('created_at', { ascending: false });

    if (data) setAllResources(data);
    setDisplayed(data?.slice(0, 20) || []);
    setPage(1);
  }, [selectedSubject]);

  useEffect(() => { fetchSubjects(); }, []);
  useEffect(() => { if (selectedSubject) fetchResources(); }, [selectedSubject, fetchResources]);

  useEffect(() => {
    if (inView && allResources.length > displayed.length) {
      const next = allResources.slice(0, (page + 1) * 20);
      setDisplayed(next);
      setPage(p => p + 1);
    }
  }, [inView]);

  const filtered = displayed.filter(r =>
    (!selectedAvailability || r.availability?.some(a => a.toLowerCase() === selectedAvailability.toLowerCase())) &&
    (r.title?.toLowerCase().includes(search.toLowerCase()) || r.level?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleMouseDown = (e: React.MouseEvent, type: 'left' | 'mid') => {
    if ((type === 'left' && isLeftCollapsed) || (type === 'mid' && isMidCollapsed)) return;
    const start = e.clientX;
    const handler = (e: MouseEvent) => {
      const delta = e.clientX - start;
      if (type === 'left') setLeftWidth(Math.min(Math.max(180, startLeftWidth.current + delta), 360));
      else setMidWidth(Math.min(Math.max(220, startMidWidth.current + delta), 480));
    };
    const up = () => {
      document.removeEventListener('mousemove', handler);
      document.removeEventListener('mouseup', up);
    };
    if (type === 'left') {
      isDraggingLeft.current = true;
      startXLeft.current = start;
      startLeftWidth.current = leftWidth;
    } else {
      isDraggingMid.current = true;
      startXMid.current = start;
      startMidWidth.current = midWidth;
    }
    document.addEventListener('mousemove', handler);
    document.addEventListener('mouseup', up);
  };

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row h-screen w-full bg-white dark:bg-black relative overflow-hidden">

      {/* SUBJECT PANEL */}
      <div className={`transition-all duration-300 bg-gray-900 text-white ${isLeftCollapsed ? 'w-0' : ''} hidden lg:block`} style={{ width: isLeftCollapsed ? 0 : leftWidth }}>
        <div className="p-4 overflow-y-auto h-full">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold">Subjects</h2>
            <button onClick={() => setIsLeftCollapsed(true)}>
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </div>
          {subjects.map(s => (
            <button key={s.id} onClick={() => setSelectedSubject(s.id)} className={`block w-full text-left px-4 py-2 rounded mb-2 ${selectedSubject === s.id ? 'bg-orange-500 text-white' : 'hover:bg-gray-800'}`}>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {!isLeftCollapsed && (
        <div onMouseDown={(e) => handleMouseDown(e, 'left')} className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize hidden lg:block" />
      )}
      {isLeftCollapsed && (
        <button onClick={() => setIsLeftCollapsed(false)} className="absolute top-4 left-2 z-10 bg-white rounded-full p-1 shadow-lg hover:bg-gray-200 hidden lg:block">
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* FILTER PANEL */}
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
            <input placeholder="Search title or level" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>

          <div className="flex flex-wrap gap-2">
            {availabilityOptions.map(opt => (
              <button key={opt} onClick={() => setSelectedAvailability(opt)} className={`px-3 py-1 rounded-full text-sm font-medium ${selectedAvailability === opt ? 'bg-orange-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {opt}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3 max-h-[70vh] overflow-y-auto">
            {filtered.map(r => (
              <motion.div key={r.id} onClick={() => setSelectedResource(r)} className="p-3 border rounded cursor-pointer hover:shadow" whileHover={{ scale: 1.02 }}>
                <div className="text-sm font-semibold mb-1">{r.title}</div>
                <p className="text-xs text-gray-500 mb-1">Level: {r.level}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{r.description}</p>
              </motion.div>
            ))}
            <div ref={loadMoreRef} className="h-1" />
          </div>
        </div>
      </div>

      {/* FILTER PANEL RESTORE */}
      {isMidCollapsed && (
        <button onClick={() => setIsMidCollapsed(false)} className="absolute top-4 left-[260px] z-10 bg-white rounded-full p-1 shadow-lg hover:bg-gray-200 hidden lg:block">
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
      {!isMidCollapsed && (
        <div onMouseDown={(e) => handleMouseDown(e, 'mid')} className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize hidden lg:block" />
      )}

      {/* RESOURCE PREVIEW PANEL */}
      <div className="flex-1 bg-white dark:bg-black p-6 overflow-y-auto">
        {selectedResource ? (
          <>
            <h2 className="text-2xl font-bold mb-1">{selectedResource.title}</h2>
            <p className="text-sm text-gray-500 mb-1">Level: {selectedResource.level}</p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedResource.description}</p>

            {selectedResource.external_link?.includes('youtube') && (
              <div className="aspect-video mb-6 rounded overflow-hidden">
                <ReactPlayer url={selectedResource.external_link} width="100%" height="100%" controls />
              </div>
            )}

            {selectedResource.link && (
              <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogTrigger asChild>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
                    📖 Read Resource
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl h-[80vh]">
                  <div className="w-full h-full">
                    <iframe
                      src={selectedResource.link.includes('drive.google.com')
                        ? `https://docs.google.com/gview?url=${selectedResource.link}&embedded=true`
                        : selectedResource.link}
                      className="w-full h-full"
                      title="Document"
                      allowFullScreen
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {!selectedResource.link && !selectedResource.external_link && (
              <div className="text-gray-500 text-center pt-12">
                <BookOpen className="w-10 h-10 mx-auto mb-2" />
                No preview available.
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-400 h-full flex items-center justify-center">
            <p className="text-lg">Select a resource to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
