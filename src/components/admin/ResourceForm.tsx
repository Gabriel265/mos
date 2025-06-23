import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function ResourceForm({ onSaved }: { onSaved: () => void }) {
  const [subjects, setSubjects] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [externalLink, setExternalLink] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.from('subjects').select('*').then(({ data }) => {
      setSubjects(data || [])
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    let fileUrl = ''
    if (file) {
      const { data, error } = await supabase.storage
        .from('resources')
        .upload(`files/${Date.now()}-${file.name}`, file)
      if (error) {
        alert('File upload failed')
        setUploading(false)
        return
      }
      fileUrl = data?.path || ''
    }

    const { error } = await supabase.from('resources').insert({
      title,
      level,
      subject_id: subjectId,
      file_url: fileUrl,
      external_link: externalLink || null,
    })

    if (!error) {
      setTitle('')
      setLevel('')
      setSubjectId('')
      setFile(null)
      setExternalLink('')
      onSaved()
    }

    setUploading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg dark:border-gray-700">
      <h2 className="text-lg font-semibold">Add New Resource</h2>

      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 rounded border dark:bg-gray-800"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Level (e.g., IGCSE, A-Level)"
        className="w-full p-2 rounded border dark:bg-gray-800"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        required
      />

      <select
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
        className="w-full p-2 rounded border dark:bg-gray-800"
        required
      >
        <option value="">Select Subject</option>
        {subjects.map(sub => (
          <option key={sub.id} value={sub.id}>{sub.name}</option>
        ))}
      </select>

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <input
        type="url"
        placeholder="External Link (optional)"
        className="w-full p-2 rounded border dark:bg-gray-800"
        value={externalLink}
        onChange={(e) => setExternalLink(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Resource'}
      </button>
    </form>
  )
}
