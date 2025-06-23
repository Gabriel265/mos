import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { EditResourceModal } from '@/components/admin/EditResourceModal'
import AdminLayout from '@/components/layout/AdminLayout'
import { toast } from 'sonner'

export default function ResourcesAdmin() {
  const [resources, setResources] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [newRes, setNewRes] = useState({
  title: '',
  level: '',
  subject_id: '',
  external_link: '',
  file: null,
  description: '',
  availability: [] as string[]
})

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loader = useRef(null)
  const [editingResource, setEditingResource] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)


  const [filters, setFilters] = useState({
    searchTitle: '',
    filterLevel: '',
    filterSubject: '',
    filterFrom: '',
    filterTo: '',
    useTitle: true,
    useLevel: true,
    useSubject: true,
    useDate: true,
    archived: 'active',
    availability: ''

  })

  useEffect(() => {
    fetchSubjects()
    fetchResources(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })
    if (loader.current) observer.observe(loader.current)
    return () => observer.disconnect()
  }, [hasMore])

  useEffect(() => {
    if (page > 1) fetchResources()
  }, [page])

  useEffect(() => {
    fetchResources(true)
  }, [filters])

  const fetchSubjects = async () => {
    const { data } = await supabase.from('subjects').select('*')
    setSubjects(data || [])
  }

  const fetchResources = async (reset = false) => {
    const from = reset ? 0 : (page - 1) * 10
    const to = from + 9

    let query = supabase.from('resources').select('*, subjects(name)').order('updated_at', { ascending: false })

        if (filters.useTitle && filters.searchTitle) {
          query = query.ilike('title', `%${filters.searchTitle}%`)
        }
        if (filters.useLevel && filters.filterLevel) {
          query = query.ilike('level', `%${filters.filterLevel}%`)
        }
        if (filters.useSubject && filters.filterSubject) {
          query = query.eq('subject_id', filters.filterSubject)
        }
        if (filters.useDate && filters.filterFrom && filters.filterTo) {
          query = query.gte('created_at', filters.filterFrom).lte('created_at', filters.filterTo)
        }
        if (filters.archived === 'active') {
          query = query.eq('archived', false)
        }
        if (filters.archived === 'archived') {
          query = query.eq('archived', true)
        }

        if (filters.availability) {
          query = query.contains('availability', [filters.availability])
        }


    const { data, error } = await query.range(from, to)

    if (reset) {
      setResources(data || [])
    } else {
      setResources(prev => [...prev, ...(data || [])])
    }

    if (!data || data.length < 10) setHasMore(false)
  }

  
  const handleAdd = async () => {
  const { title, level, subject_id, external_link, file, description } = newRes;

  if (!title || !level || !subject_id || !description) {
    return toast.error('Title, Level, Subject, and Description are required');
  }

  if (!file && !external_link) {
    return toast.error('Provide at least a file or an external link');
  }

  let fileUrl: string | null = null;

  if (file) {
    const { data, error } = await supabase.storage
      .from('resources')
      .upload(`files/${Date.now()}-${file.name}`, file, { upsert: true });

    if (error || !data) {
      return toast.error('File upload failed');
    }

    const { data: publicUrlData } = supabase.storage.from('resources').getPublicUrl(data.path);
    fileUrl = publicUrlData?.publicUrl || null;
  }

  const { error } = await supabase.from('resources').insert([{
    title,
    level,
    subject_id,
    external_link: external_link || null,
    link: fileUrl || null,
    description,
    availability: newRes.availability,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }]);

  if (!error) {
    toast.success('Resource added successfully');
    setNewRes({
      title: '',
      level: '',
      subject_id: '',
      external_link: '',
      file: null,
      description: '',
      availability: []
    });
    setPage(1);
    setHasMore(true);
    fetchResources(true);
  } else {
    toast.error('Failed to add resource');
  }
};


  const toggleArchive = async (id: string, current: boolean) => {
    const confirmed = confirm(current ? 'Unarchive this resource?' : 'Archive this resource?')
    if (!confirmed) return

    await supabase.from('resources').update({ archived: !current, updated_at: new Date().toISOString() }).eq('id', id)
    setPage(1)
    setHasMore(true)
    fetchResources(true)
  }

  const handleDelete = async (res: any) => {
  const confirmed = confirm(`Are you sure you want to delete "${res.title}"?`)
  if (!confirmed) return

  // Delete uploaded file from Supabase Storage if exists
  if (res.link && !res.external_link) {
    const filePath = res.link.split('/resources/')[1] // get path relative to bucket
    if (filePath) {
      const { error: fileError } = await supabase.storage.from('resources').remove([filePath])
      if (fileError) {
        toast.warning('File deletion from storage failed (may already be gone).')
      }
    }
  }

  // Delete DB record
  const { error } = await supabase.from('resources').delete().eq('id', res.id)
  if (error) {
    toast.error('Failed to delete resource')
  } else {
    toast.success('Resource deleted')
    setResources(prev => prev.filter(r => r.id !== res.id))
  }
}


  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">📚 Manage Resources</h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Resource
          </button>
        </div>


        {/* Filter Controls */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 space-y-2">
          <h2 className="text-lg font-semibold">Filter Resources</h2>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={filters.useTitle} onChange={e => setFilters(prev => ({ ...prev, useTitle: e.target.checked }))} />
            <input
              className="w-full p-2 rounded border dark:bg-gray-700"
              placeholder="Filter by Title"
              value={filters.searchTitle}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTitle: e.target.value }))}
              disabled={!filters.useTitle}
            />
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={filters.useLevel} onChange={e => setFilters(prev => ({ ...prev, useLevel: e.target.checked }))} />
            <input
              className="w-full p-2 rounded border dark:bg-gray-700"
              placeholder="Filter by Level"
              value={filters.filterLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, filterLevel: e.target.value }))}
              disabled={!filters.useLevel}
            />
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={filters.useSubject} onChange={e => setFilters(prev => ({ ...prev, useSubject: e.target.checked }))} />
            <select
              className="w-full p-2 rounded border dark:bg-gray-700"
              value={filters.filterSubject}
              onChange={(e) => setFilters(prev => ({ ...prev, filterSubject: e.target.value }))}
              disabled={!filters.useSubject}
            >
              <option value="">Filter by Subject</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={filters.useDate} onChange={e => setFilters(prev => ({ ...prev, useDate: e.target.checked }))} />
            <input
              type="date"
              className="p-2 rounded border dark:bg-gray-700"
              value={filters.filterFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, filterFrom: e.target.value }))}
              disabled={!filters.useDate}
            />
            to
            <input
              type="date"
              className="p-2 rounded border dark:bg-gray-700"
              value={filters.filterTo}
              onChange={(e) => setFilters(prev => ({ ...prev, filterTo: e.target.value }))}
              disabled={!filters.useDate}
            />
          </label>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Archived Filter</label>
            <select
              className="w-full p-2 rounded border dark:bg-gray-700"
              value={filters.archived}
              onChange={(e) => setFilters(prev => ({ ...prev, archived: e.target.value }))}
            >
              <option value="active">Only Active</option>
              <option value="archived">Only Archived</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Availability Filter</label>
            <select
              className="w-full p-2 rounded border dark:bg-gray-700"
              value={filters.availability}
              onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
            >
              <option value="">All Types</option>
              {['eBooks', 'Past Papers', 'Notes', 'Practice Questions', 'Syllabus', 'Marking Schemes'].map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>


        </div>

        {/* Resource List */}
        <div className="space-y-4">
          {resources.map(res => (
            <div key={res.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{res.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Level: {res.level} | Type: {res.type} | Subject: {res.subjects?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                     {res.description}
                  </p>
                  {res.availability?.length > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Available As: {res.availability.join(', ')}
                    </p>
                  )}

                  {res.external_link && (
                    <a href={res.external_link} target="_blank" className="text-blue-500 text-sm underline">Open External Link</a>
                  )}
                  {res.link && !res.external_link && (
                    <a href={res.link} target="_blank" className="text-blue-500 text-sm underline">Open Uploaded File</a>
                  )}
                </div>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => setEditingResource(res)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleArchive(res.id, res.archived)}
                    className="text-yellow-500 hover:underline"
                  >
                    {res.archived ? 'Unarchive' : 'Archive'}
                  </button>

                  <button
                    onClick={() => handleDelete(res)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>

              </div>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                Updated: {new Date(res.updated_at).toLocaleString()}
              </p>
            </div>
          ))}
          <div ref={loader} className="h-10"></div>
        </div>

        {/* Edit Modal */}
        {editingResource && (
          <EditResourceModal
            resource={editingResource}
            onClose={() => setEditingResource(null)}
            onSaved={() => {
              setPage(1)
              setHasMore(true)
              fetchResources(true)
            }}
          />
        )}
      </div>

      {showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-lg border dark:border-gray-700">

      <h2 className="text-xl font-semibold">Add New Resource</h2>

      <input
        className="w-full p-2 rounded border dark:bg-gray-800"
        placeholder="Title"
        value={newRes.title}
        onChange={(e) => setNewRes({ ...newRes, title: e.target.value })}
      />

      <input
        className="w-full p-2 rounded border dark:bg-gray-800"
        placeholder="Level"
        value={newRes.level}
        onChange={(e) => setNewRes({ ...newRes, level: e.target.value })}
      />

      <select
        className="w-full p-2 rounded border dark:bg-gray-800"
        value={newRes.subject_id}
        onChange={(e) => setNewRes({ ...newRes, subject_id: e.target.value })}
      >
        <option value="">Select Subject</option>
        {subjects.map(sub => (
          <option key={sub.id} value={sub.id}>{sub.name}</option>
        ))}
      </select>

      <textarea
        className="w-full p-2 rounded border dark:bg-gray-800"
        placeholder="Short description of the resource"
        value={newRes.description}
        onChange={(e) => setNewRes({ ...newRes, description: e.target.value })}
      />


      <input
        className="w-full p-2 rounded border dark:bg-gray-800"
        type="url"
        placeholder="External link (optional)"
        value={newRes.external_link}
        onChange={(e) => setNewRes({ ...newRes, external_link: e.target.value })}
      />

      <input
        className="w-full p-2 rounded border dark:bg-gray-800"
        type="file"
        onChange={(e) => setNewRes({ ...newRes, file: e.target.files?.[0] || null })}
      />

      <div>
  <label className="block mb-1 font-medium">Availability</label>
  <div className="grid grid-cols-2 gap-2">
    {['eBooks', 'Past Papers', 'Notes', 'Practice Questions', 'Syllabus', 'Marking Schemes'].map(option => (
      <label key={option} className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          value={option}
          checked={newRes.availability.includes(option)}
          onChange={(e) => {
            const checked = e.target.checked
            setNewRes(prev => ({
              ...prev,
              availability: checked
                ? [...prev.availability, option]
                : prev.availability.filter(item => item !== option),
            }))
          }}
        />
        {option}
      </label>
    ))}
  </div>
</div>


      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={() => setShowAddModal(false)}
          className="px-4 py-2 rounded border dark:border-gray-600"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await handleAdd()
            setShowAddModal(false)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Resource
        </button>
      </div>
    </div>
  </div>
)}

    </AdminLayout>
  )
}
