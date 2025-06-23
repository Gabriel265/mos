import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

const AVAILABILITY_OPTIONS = [
  'eBooks',
  'Past Papers',
  'Notes',
  'Practice Questions',
  'Syllabus',
  'Marking Schemes'
]

export function EditResourceModal({ resource, onClose, onSaved }: any) {
  const [title, setTitle] = useState(resource.title || '')
  const [level, setLevel] = useState(resource.level || '')
  const [subjectId, setSubjectId] = useState(resource.subject_id || '')
  const [externalLink, setExternalLink] = useState(resource.external_link || '')
  const [type, setType] = useState(resource.type || '')
  const [availability, setAvailability] = useState<string[]>(resource.availability || [])
  const [file, setFile] = useState<File | null>(null)
  const [subjects, setSubjects] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('subjects').select('*').then(({ data }) => {
      setSubjects(data || [])
    })
  }, [])

  const handleUpdate = async () => {
    setSaving(true)
    let fileUrl = resource.link

    if (file) {
      const { data, error } = await supabase.storage
        .from('resources')
        .upload(`files/${Date.now()}-${file.name}`, file, { upsert: true })

      if (error || !data) {
        toast.error('File upload failed')
        setSaving(false)
        return
      }

      const { data: publicUrlData } = supabase.storage.from('resources').getPublicUrl(data.path)
      fileUrl = publicUrlData.publicUrl
    }

    const { error } = await supabase
      .from('resources')
      .update({
        title,
        level,
        subject_id: subjectId,
        external_link: externalLink || null,
        link: fileUrl || null,
        type,
        availability,
        updated_at: new Date().toISOString()
      })
      .eq('id', resource.id)

    if (!error) {
      toast.success('Resource updated')
      onSaved()
      onClose()
    } else {
      toast.error('Failed to update resource')
    }
    setSaving(false)
  }

  const toggleAvailability = (option: string) => {
    setAvailability(prev =>
      prev.includes(option)
        ? prev.filter(a => a !== option)
        : [...prev, option]
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">Edit Resource</h2>

        <input
          className="w-full p-2 rounded border dark:bg-gray-800"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          className="w-full p-2 rounded border dark:bg-gray-800"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          placeholder="Level"
        />

        <select
          className="w-full p-2 rounded border dark:bg-gray-800"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>

        <select
          className="w-full p-2 rounded border dark:bg-gray-800"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="Document">Document</option>
          <option value="Video">Video</option>
          <option value="Slide">Slide</option>
          <option value="Other">Other</option>
        </select>

        <input
          className="w-full p-2 rounded border dark:bg-gray-800"
          type="url"
          value={externalLink}
          onChange={(e) => setExternalLink(e.target.value)}
          placeholder="External Link (optional)"
        />

        <input
          className="w-full p-2 rounded border dark:bg-gray-800"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {/* Availability Checkboxes */}
        <div>
          <label className="block mb-1 font-medium text-sm">Availability</label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABILITY_OPTIONS.map(option => (
              <label key={option} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={option}
                  checked={availability.includes(option)}
                  onChange={() => toggleAvailability(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border dark:border-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
