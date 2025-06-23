import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'

export default function SubjectsAdmin() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    const { data } = await supabase.from('subjects').select('*').order('created_at', { ascending: false })
    setSubjects(data || [])
  }

  const addSubject = async () => {
    if (!newName.trim()) return
    const { error } = await supabase.from('subjects').insert([{ name: newName }])
    if (error) return toast.error('Failed to add subject')
    setNewName('')
    fetchSubjects()
    toast.success('Subject added')
  }

  const startEditing = (id: string, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const updateSubject = async () => {
    if (!editingId || !editingName.trim()) return
    const { error } = await supabase.from('subjects').update({ name: editingName }).eq('id', editingId)
    if (error) return toast.error('Failed to update subject')
    setEditingId(null)
    setEditingName('')
    fetchSubjects()
    toast.success('Subject updated')
  }

  const toggleArchive = async (id: string, archived: boolean) => {
    const confirmed = window.confirm(`Are you sure you want to ${archived ? 'unarchive' : 'archive'} this subject?`)
    if (!confirmed) return
    const { error } = await supabase.from('subjects').update({ archived: !archived }).eq('id', id)
    if (error) return toast.error('Failed to toggle archive')
    fetchSubjects()
    toast.success(`Subject ${archived ? 'unarchived' : 'archived'}`)
  }

  const deleteSubject = async (id: string) => {
    const confirmed = window.confirm('Delete this subject? This action is irreversible.')
    if (!confirmed) return
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) return toast.error('Failed to delete subject')
    fetchSubjects()
    toast.success('Subject deleted')
  }

  return (
    <AdminLayout>
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">🧠 Manage Subjects</h1>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded dark:bg-gray-800"
          placeholder="New subject name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={addSubject} className="bg-green-600 text-white px-4 rounded hover:bg-green-700">
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {subjects.map(sub => (
          <li key={sub.id} className="bg-card dark:bg-gray-800 p-3 rounded shadow flex justify-between items-center">
            {editingId === sub.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  className="flex-1 p-2 border rounded dark:bg-gray-700"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={updateSubject} className="text-blue-600 hover:underline">Save</button>
                <button onClick={() => setEditingId(null)} className="text-gray-500 hover:underline">Cancel</button>
              </div>
            ) : (
              <div className="flex-1">
                <p className="font-medium text-lg">{sub.name}</p>
                <p className="text-sm text-muted-foreground">{sub.archived ? 'Archived' : 'Active'}</p>
              </div>
            )}
            <div className="text-sm flex flex-col gap-1 text-right">
              <button onClick={() => startEditing(sub.id, sub.name)} className="text-cambridgeBlue hover:underline">Edit</button>
              <button onClick={() => toggleArchive(sub.id, sub.archived)} className="text-warningAmber hover:underline">
                {sub.archived ? 'Unarchive' : 'Archive'}
              </button>
              <button onClick={() => deleteSubject(sub.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </AdminLayout>
  )
}
