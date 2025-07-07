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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl">🧠</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
              Manage Subjects
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
              Create, edit, and organize your subjects with ease
            </p>
          </div>

          {/* Add Subject Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Add New Subject
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                className="flex-1 p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                placeholder="Enter subject name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSubject()}
              />
              <button 
                onClick={addSubject} 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                         text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium
                         transition-all duration-200 transform hover:scale-105 active:scale-95
                         shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                         whitespace-nowrap"
                disabled={!newName.trim()}
              >
                Add Subject
              </button>
            </div>
          </div>

          {/* Subjects List */}
          <div className="space-y-3 sm:space-y-4">
            {subjects.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="text-6xl sm:text-8xl mb-4 opacity-50">📚</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No subjects yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500 text-sm sm:text-base">
                  Add your first subject to get started
                </p>
              </div>
            ) : (
              subjects.map(sub => (
                <div key={sub.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 
                                           hover:shadow-xl transition-all duration-200 overflow-hidden">
                  {editingId === sub.id ? (
                    /* Edit Mode */
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <input
                          className="flex-1 p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                                   bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                   transition-all duration-200"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && updateSubject()}
                          autoFocus
                        />
                        <div className="flex gap-2 sm:gap-3">
                          <button 
                            onClick={updateSubject} 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                                     text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium
                                     transition-all duration-200 transform hover:scale-105 active:scale-95
                                     shadow-md hover:shadow-lg flex-1 sm:flex-none"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingId(null)} 
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium
                                     transition-all duration-200 transform hover:scale-105 active:scale-95
                                     shadow-md hover:shadow-lg flex-1 sm:flex-none"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                            {sub.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium
                                          ${sub.archived 
                                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' 
                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}>
                              <div className={`w-2 h-2 rounded-full mr-1 sm:mr-2 ${sub.archived ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                              {sub.archived ? 'Archived' : 'Active'}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
                          <button 
                            onClick={() => startEditing(sub.id, sub.name)} 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                                     text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm
                                     transition-all duration-200 transform hover:scale-105 active:scale-95
                                     shadow-md hover:shadow-lg"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => toggleArchive(sub.id, sub.archived)} 
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm
                                      transition-all duration-200 transform hover:scale-105 active:scale-95
                                      shadow-md hover:shadow-lg
                                      ${sub.archived 
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' 
                                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'}`}
                          >
                            {sub.archived ? '📂 Unarchive' : '📁 Archive'}
                          </button>
                          <button 
                            onClick={() => deleteSubject(sub.id)} 
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                                     text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm
                                     transition-all duration-200 transform hover:scale-105 active:scale-95
                                     shadow-md hover:shadow-lg"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}